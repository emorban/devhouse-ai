# Engineering Highlights

This file summarizes the engineering patterns behind DevHouse AI without publishing the production repository.

## Voice AI to operational workflow

A call is not treated as an isolated voice interaction. The useful output is a structured operational record: who called, what they needed, what happened, whether a booking or follow-up is required, and what the next action should be.

The system therefore separates:

1. provider event ingestion
2. payload normalization
3. AI-assisted analysis
4. deterministic workflow rules
5. CRM/database persistence
6. operator-facing presentation

That separation makes it easier to test each boundary independently.

## Structured AI analysis

Post-call analysis is normalized into a known schema rather than passed around as free-form model text. Typical fields include intent, outcome, sentiment, lead score, pain points, objections, timeline, decision-maker signal, and next action.

The important design choice is that provider/model output is treated as untrusted external data: normalize it, constrain it, and provide sensible defaults.

See [`../samples/ai/normalize-call-analysis.ts`](../samples/ai/normalize-call-analysis.ts).

## Consent and suppression

Communication workflows need a persistent concept of permission. STOP/UNSUBSCRIBE-style messages are recognized independently from the provider that delivered them, and downstream messaging can check a single suppression state before attempting a send.

The public sample focuses on message classification; production persistence and provider wiring remain private.

See [`../samples/consent/message-consent.ts`](../samples/consent/message-consent.ts).

## Failure handling and fallback

AI and communications providers can fail, time out, return incomplete payloads, or be unavailable in a given environment. DevHouse treats degraded operation as a normal engineering case rather than an exceptional afterthought.

The pattern is:

- use the preferred provider when configured
- classify errors and keep the failure observable
- try a safe fallback only when the environment supports it
- preserve a deterministic last-resort path where possible
- return an explicit result instead of silently pretending success

See [`../samples/reliability/provider-fallback.ts`](../samples/reliability/provider-fallback.ts).

## Read/write separation

Operational read models and snapshots are kept conceptually separate from write actions. This helps prevent a dashboard refresh, verification script, or monitoring process from accidentally mutating production state.

For action paths, the system favors explicit checks around configuration, authorization, consent, and target identity before a provider call or database write occurs.

## Testing philosophy

The private production repository uses layered verification across:

- unit tests for transformation and domain logic
- integration tests for API/provider boundaries
- end-to-end browser tests for user flows
- lint/build gates
- deployment and observability checks

Public portfolio examples are intentionally small and are not presented as the complete production test suite.

## Product-engineering tradeoff

DevHouse AI is built as a product system, not a collection of disconnected demos. Engineering decisions are evaluated against the operational outcome: answer the lead, capture the right information, preserve consent, update the system of record, make the next step visible, and fail safely when a dependency is unavailable.
