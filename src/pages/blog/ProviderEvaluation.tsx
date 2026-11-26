import type { BlogCollectionData } from '../../data/blogCollections'
import trial from '../../data/physical-world-data-api-trial.json'
import BlogCollection from './BlogCollection'
import ProviderComparisons from './ProviderComparisons'

export default function ProviderEvaluation({ collection }: { collection: BlogCollectionData }) {
  const trialLinks = (
    <>
      <a href={trial.json_path} download>Download cases as JSON <span aria-hidden="true">↓</span></a>
      <a href={trial.release_url}>Versioned reference pack <span aria-hidden="true">↗</span></a>
    </>
  )

  return (
    <BlogCollection collection={collection} trialLinks={trialLinks}>
      <ProviderComparisons />
      <section className="blog-collection-cases" aria-labelledby="reference-cases">
        <h2 id="reference-cases">Reference cases</h2>
        {trial.cases.map(item => (
          <details key={item.test_id} className="blog-collection-case" id={item.test_id}>
            <summary>{item.title}</summary>
            <dl>
              <div><dt>Input</dt><dd>{item.case_input}</dd></div>
              <div><dt>Request</dt><dd>{item.request}</dd></div>
              <div><dt>Acceptance criteria</dt><dd>{item.acceptance_criteria}</dd></div>
              <div><dt>Reference result</dt><dd>{item.reference_result}</dd></div>
              <div><dt>Reference date</dt><dd>{item.reference_as_of}</dd></div>
            </dl>
            <div className="blog-collection-case-links">
              <a href={item.source_case_url}>Walkthrough</a>
              <a href={item.reference_fixture_url} download>Reference file</a>
              <a href={item.primary_source_url}>Primary source</a>
              <a href={item.second_source_url}>Second source</a>
            </div>
          </details>
        ))}
      </section>
    </BlogCollection>
  )
}
