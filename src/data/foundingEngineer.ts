export const FOUNDING_ENGINEER = {
  title: 'Founding Engineer',
  email: 'jobs@invariant-ai.com',
  pageTitle: 'Careers at Invariant | Founding Engineer',
  description: 'Join Invariant as a founding engineer in San Francisco. Build production AI agents for mission-critical compliance. $140K base, 1.5% equity, relocation covered.',
  responsibilities: [
    'Design and own the agent architecture that reads a regulatory corpus and drafts filing sections with citations that resolve back to the rule text.',
    'Set the eval practice for the team: behavioural evals written before the feature, and used to decide whether a change ships.',
    'Build retrieval over large rule corpora, including chunking, embeddings in pgvector and reranking, and know when each one earns its cost.',
    'Deploy with customers, run the agents on their data, and turn what you find into fixes between one working session and the next.',
    'Build and run production Python services: FastAPI, background workers, and streaming progress into a Next.js interface.',
    'Decide where the agent should stop and hand back to a human, and design the failure modes and refusal behaviour around that.',
    'Set engineering standards, review code, and help hire the engineers who come after you.',
  ],
  requirements: [
    'Several years shipping production software, with at least one system you owned end to end in front of real users.',
    'You’ve built something with LLMs that survived contact with a paying customer. A demo doesn’t count.',
    'Strong Python. Comfortable with async, type hints, and a codebase where mypy --strict is a merge gate.',
    'Enough statistics to tell a real improvement from noise on a small eval set.',
    'Comfortable in front of a customer, including the meeting where the agent got something wrong.',
    'Careful with sensitive material.',
    'Full time, in person in San Francisco.',
  ],
  niceToHave: [
    'Time at a satellite operator, launch provider, space agency, or on a university cubesat or rocketry team.',
    'Background in RF, orbital mechanics, or guidance and control.',
    'Retrieval work deep enough that you know when reranking helps and when it does nothing.',
    'Early-stage startup experience, ideally as one of the first few engineers.',
    'Open source contributions we can read.',
  ],
  equalOpportunity: 'Invariant AI is an equal opportunity employer. We do not discriminate on the basis of race, colour, religion, sex, sexual orientation, gender identity, gender expression, national origin, ancestry, citizenship or immigration status, age, disability, medical condition, marital status, veteran status, or any other characteristic protected by federal law, by California’s Fair Employment and Housing Act, or by San Francisco ordinance.',
} as const

export type JobApplication = { name: string; email: string; project: string; agent: string; customer: string }

/** Kept out of analytics and storage. The applicant sends the draft themselves. */
export function prepareJobApplication(values: JobApplication) {
  const application = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])) as JobApplication
  const body = [
    'Hi Parthiv and Pranav,',
    '',
    'I’m applying for the Founding Engineer role at Invariant.',
    '',
    `Name: ${application.name}`,
    `Email: ${application.email}`,
    `Project: ${application.project}`,
    '',
    'An AI agent I shipped:',
    application.agent,
    '',
    'How I made it work for a customer:',
    application.customer,
    '',
    application.name,
  ].join('\n')
  return {
    ...application,
    body,
    href: `mailto:${FOUNDING_ENGINEER.email}?subject=${encodeURIComponent(FOUNDING_ENGINEER.title)}&body=${encodeURIComponent(body)}`,
  }
}
