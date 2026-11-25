const FILLER_WORDS = new Set('a an and are as at be can do does for from how i in is it me near of on or should the to use was were what when where which who will with you'.split(' '))
const WATTS = { k: 1e3, m: 1e6, g: 1e9 }

export function articleSearchWords(value) {
  return value.toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/(?<=\d),(?=\d{3}\b)/g, '')
    .replace(/['’]/g, '')
    .replace(/\b(\d+(?:\.\d+)?)\s*[-–—‐‑]?\s*(kw|mw|gw|kilowatts?|megawatts?|gigawatts?)\b/g, (_, amount, unit) => {
      const watts = Number(amount) * WATTS[unit[0]]
      return ` ${Number(watts.toPrecision(15))}w `
    })
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
    .replace(/\bdata\s*cent(?:er|re)s?\b/g, 'data center')
    .replace(/\bpowerflow\b/g, 'power flow')
    .replace(/\b(boundar|propert|stud)ies\b/g, '$1y')
    .replace(/\bpre\s+fill\b/g, 'prefill')
    .replace(/\bsemi\s*trucks?\b/g, 'truck')
    .replace(/\bcharg(?:e[dr]?s?|ing)\b/g, 'charge')
    .trim().split(/\s+/)
    .filter(word => word && !FILLER_WORDS.has(word))
    .map(word => word.length > 3 && /[^s]s$/.test(word) ? word.slice(0, -1) : word)
}
