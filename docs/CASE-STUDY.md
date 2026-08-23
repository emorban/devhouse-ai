# DevHouse AI — Product & Engineering Case Study

This case study is intentionally sanitized. It describes the product problem, system design, engineering decisions, and ownership model without publishing production credentials, customer data, private provider identifiers, or internal operating procedures.

## Problem

Service businesses often lose opportunities because inbound calls, lead forms, booking, CRM updates, and follow-up live in separate systems. The operational failure is not simply “a call was missed”; it is that no reliable workflow turns that lead into a visible next action.

DevHouse AI was designed around that gap.

## Product thesis

The system should treat every inbound interaction as the start of a traceable workflow:

1. capture the interaction
2. understand intent and outcome
3. normalize the result into structured data
4. apply consent and workflow rules
5. update the system of record
6. make the next action visible to an operator
7. preserve observability when a provider fails

Avery, the voice-AI layer, is one entry point into that broader system rather than the entire product.

## Architecture decisions

### Normalize before the rest of the product consumes provider data

External AI, telephony, and CRM providers expose their own event shapes. The application converts those payloads into stable internal objects so downstream logic does not depend directly on a provider response.

See [`../samples/ai/normalize-call-analysis.ts`](../samples/ai/normalize-call-analysis.ts).

### Keep AI output structured

Post-call analysis is useful only if other systems can rely on it. The workflow therefore expects known fields such as intent, outcome, sentiment, lead score, objections, timeline, and next action instead of passing free-form model output through the product.

### Treat communication as a guarded side effect

Outbound communication should not happen merely because a workflow reached a send step. Consent, suppression state, configuration, target identity, and authorization belong in the action boundary.

See [`../samples/consent/message-consent.ts`](../samples/consent/message-consent.ts).

### Design for provider failure

A production workflow cannot assume that every AI or communications provider is always healthy. The system uses explicit fallback ordering, preserves failure information, and prefers visible degraded states over silent success.

See [`../samples/reliability/provider-fallback.ts`](../samples/reliability/provider-fallback.ts).

### Separate reads from writes

Operator views, verification, and monitoring should be able to inspect state without accidentally changing it. Read models and write actions are intentionally treated as different paths.

## What I owned

My role across DevHouse AI has included:

- defining the product problem and workflow boundaries
- deciding how Avery, CRM, booking, application state, and operator surfaces fit together
- defining schemas, acceptance criteria, failure behavior, and production gates
- directing implementation across human-written and AI-assisted development work
- reviewing code and agent output rather than treating generation as completion
- testing end-to-end behavior and investigating failed paths
- deciding what was ready to ship versus what remained blocked
- iterating the product based on operational and commercial needs

The public repository is deliberately explicit about this ownership model because “AI-assisted development” can otherwise hide who made the technical and product decisions.

## What changed as the product matured

Early versions were more feature-centric: voice AI, CRM integration, booking, dashboards. Production work shifted the focus toward system behavior:

- What is the source of truth?
- Which actions are safe to automate?
- What happens when a provider is unavailable?
- How is consent preserved?
- Can the operator see what happened and why?
- Is a feature merely coded, or has the real path actually been verified?

Those questions drove the architecture toward clearer boundaries, stronger test gates, and more explicit operational states.

## Verification philosophy

The production codebase uses layered verification across unit tests, integration boundaries, end-to-end flows, build/lint gates, and deployment checks. This public portfolio includes a small executable test suite around the representative samples so reviewers can inspect both the patterns and how they are verified.

Run:

```bash
npm install
npm run verify
```

## Why the production repository is private

The full production repository includes operational runbooks, environment-specific wiring, provider-specific monitoring, internal recovery procedures, and other material that should not be exposed merely to prove technical work.

This portfolio preserves the useful part for hiring teams: architecture, representative code, engineering reasoning, and ownership — without publishing the production attack surface.
