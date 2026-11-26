"""Replay base billing demand for one energized Ohio Power Schedule DCT New Load contract."""

import argparse
import csv
import hashlib
import json
import sys
from collections import deque
from decimal import Decimal, DecimalException, ROUND_HALF_UP
from pathlib import Path


TARIFF_BOOK = 'https://www.aepohio.com/lib/docs/ratesandtariffs/Ohio/November_2026_Ohio_Power_Tariff_Book.pdf'
TARIFF_SHA256 = 'c489a1fc8cb3e70fd8d977bdf70d0af4cdf9d739a3fa3970eeacf9bd9bae95c2'
RATES = {
    'primary': (Decimal('8.08'), Decimal('186.30')),
    'secondary': (Decimal('9.05'), Decimal('21.00')),
}
FRACTION = Decimal('0.85')
HISTORY_MONTHS = 11
REFERENCE = Path(__file__).with_name('aep-ohio-data-center-tariff-minimum-demand.json')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def demand(value, label):
    try:
        amount = Decimal(str(value))
    except DecimalException:
        raise ValueError(f'{label} must be a non-negative number of kW.') from None
    require(amount.is_finite() and amount >= 0, f'{label} must be a non-negative number of kW.')
    return amount


def contract_floor(contract_kw):
    if contract_kw <= 75000:
        return Decimal('15000') + FRACTION * (contract_kw - 25000)
    return min(Decimal('57500') + contract_kw - 75000, FRACTION * contract_kw)


def kw(amount):
    return format(amount.normalize(), 'f')


def usd(amount):
    return format(amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), 'f')


def replay(scenario):
    service_voltage = scenario['service_voltage']
    require(service_voltage in RATES, 'Service voltage must be primary or secondary.')
    distribution_rate, customer_charge = RATES[service_voltage]
    contract_kw = demand(scenario['contract_kw'], 'Contract capacity')
    require(contract_kw >= 25001, 'This single-contract replay requires at least 25,001 kW of contract capacity.')
    input_history = scenario['prior_billed_kw']
    require(isinstance(input_history, list) and len(input_history) <= HISTORY_MONTHS,
            'Supply up to 11 preceding monthly billed demands, oldest first.')
    history = deque((demand(value, 'Prior billed demand') for value in input_history), maxlen=HISTORY_MONTHS)

    months = scenario['months']
    require(isinstance(months, list) and months, 'Supply an ordered list of consecutive billing months.')
    seen_post_ramp = False
    rows = []
    for number, month in enumerate(months, start=1):
        phase = month['phase']
        require(phase in ('ramp', 'post_ramp'), f'Month {number}: use ramp or post_ramp.')
        require(not (phase == 'ramp' and seen_post_ramp), f'Month {number}: a ramp cannot follow the post-ramp period.')
        meter = demand(month['metered_kw'], f'Month {number} metered peak')
        agreed_ramp = None
        previous_high = None
        ratchet = None
        components = {'meter': meter}
        if phase == 'ramp':
            agreed_ramp = demand(month['agreed_ramp_kw'], f'Month {number} agreed ramp capacity')
            require(0 < agreed_ramp <= contract_kw, f'Month {number}: agreed ramp capacity must be above zero and at or below contract capacity.')
            floor = FRACTION * agreed_ramp
            components['ramp_floor'] = floor
        else:
            seen_post_ramp = True
            require(len(history) == HISTORY_MONTHS,
                    f'Month {number}: enter all 11 preceding billed demands before calculating a post-ramp month.')
            previous_high = max(history)
            ratchet = FRACTION * previous_high
            floor = contract_floor(contract_kw)
            components.update({'contract_floor': floor, 'prior_billed_ratchet': ratchet})

        billed = max(components.values())
        rows.append({
            'month': number,
            'phase': phase,
            'metered_kw': kw(meter),
            'agreed_ramp_kw': kw(agreed_ramp) if agreed_ramp is not None else None,
            'previous_11_month_highest_billed_kw': kw(previous_high) if previous_high is not None else None,
            'minimum_kw': kw(floor),
            'ratchet_kw': kw(ratchet) if ratchet is not None else None,
            'billed_kw': kw(billed),
            'binding_factors': '+'.join(name for name, value in components.items() if value == billed),
            'meter_exceeds_contract': meter > contract_kw,
            'base_distribution_usd': usd(billed * distribution_rate),
            'customer_charge_usd': usd(customer_charge),
            'base_subtotal_usd': usd(billed * distribution_rate + customer_charge),
            'base_distribution_above_meter_only_usd': usd((billed - meter) * distribution_rate),
        })
        history.append(billed)

    return {
        'tariff_book': TARIFF_BOOK,
        'tariff_book_sha256': TARIFF_SHA256,
        'contract_kw': kw(contract_kw),
        'service_voltage': service_voltage,
        'demand_rate_usd_per_kw': usd(distribution_rate),
        'base_subtotal_all_months_usd': usd(sum(Decimal(row['base_subtotal_usd']) for row in rows)),
        'base_distribution_above_meter_only_all_months_usd': usd(sum(Decimal(row['base_distribution_above_meter_only_usd']) for row in rows)),
        'months': rows,
    }


def verify_reference(reference):
    require(reference['tariff']['source_file_sha256'] == TARIFF_SHA256, 'Reference tariff vintage differs.')
    for entry in reference['contract_tier_examples']:
        require(contract_floor(Decimal(entry['capacity_kw'])) == entry['floor_kw'],
                f"Contract-tier floor differs at {entry['capacity_kw']} kW.")
    ramp = replay({
        'service_voltage': 'primary', 'contract_kw': 100000, 'prior_billed_kw': [],
        'months': [{'phase': 'ramp', 'agreed_ramp_kw': 50000, 'metered_kw': reference['first_year_example_month']['metered_peak_kw']}],
    })['months'][0]
    entry = reference['first_year_example_month']
    require(Decimal(ramp['billed_kw']) == entry['billed_demand_kw']
            and ramp['base_subtotal_usd'] == entry['primary_base_charge_usd'], 'First ramp month differs from the research fixture.')

    expected = reference['post_ramp_months']
    result = replay({
        'service_voltage': 'primary', 'contract_kw': 100000,
        'prior_billed_kw': reference['billed_demands_before_post_ramp_month_1_kw_oldest_first'],
        'months': [{'phase': 'post_ramp', 'metered_kw': row['metered_peak_kw']} for row in expected],
    })
    checks = {
        'previous_11_month_highest_billed_kw': 'previous_11_month_highest_billed_kw',
        'minimum_kw': 'contract_tier_floor_kw',
        'ratchet_kw': 'ratchet_kw',
        'billed_kw': 'billed_demand_kw',
        'base_subtotal_usd': 'primary_base_charge_usd',
    }
    for actual, entry in zip(result['months'], expected, strict=True):
        for field, expected_key in checks.items():
            require(Decimal(actual[field]) == Decimal(entry[expected_key]),
                    f"Reference month {actual['month']} differs for {field}.")
    return {'verified_post_ramp_months': len(expected), 'verified_ramp_months': 1,
            'verified_contract_tier_examples': len(reference['contract_tier_examples']), **result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--input', type=Path, help='Scenario JSON with kW inputs and consecutive billing months.')
    mode.add_argument('--check-reference', type=Path, nargs='?', const=REFERENCE, help='Verify results against the published research fixture.')
    parser.add_argument('--format', choices=('json', 'csv'), default='json', help='CSV contains the individual billing months.')
    parser.add_argument('--tariff-book', type=Path, help='Optionally verify the downloaded source PDF checksum.')
    args = parser.parse_args()

    try:
        if args.tariff_book:
            require(hashlib.sha256(args.tariff_book.read_bytes()).hexdigest() == TARIFF_SHA256,
                    'The tariff PDF differs from the pinned November 2026 Ohio Power tariff book.')
        with (args.input or args.check_reference).open(encoding='utf-8') as source:
            values = json.load(source, parse_float=Decimal)
        result = replay(values) if args.input else verify_reference(values)
    except (OSError, ValueError, KeyError, TypeError, DecimalException) as error:
        parser.exit(2, f'Error: {error}\n')

    if args.format == 'csv':
        writer = csv.DictWriter(sys.stdout, fieldnames=list(result['months'][0]), lineterminator='\n')
        writer.writeheader()
        writer.writerows(result['months'])
    else:
        print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
