# Sanitized Engineering Samples

These files are representative excerpts adapted from DevHouse AI production patterns. They are intentionally small, dependency-light, and stripped of production configuration, customer data, private identifiers, and operational wiring.

They are here to make the engineering approach inspectable without publishing the full production repository.

## Included

- [`ai/normalize-call-analysis.ts`](./ai/normalize-call-analysis.ts) — converts provider-specific post-call analysis into a stable internal shape.
- [`consent/message-consent.ts`](./consent/message-consent.ts) — recognizes opt-out/help messages before downstream communication actions.
- [`reliability/provider-fallback.ts`](./reliability/provider-fallback.ts) — demonstrates explicit preferred-provider, fallback, and deterministic last-resort behavior.

## Not included

The public samples do not contain production endpoints, credentials, tenant/customer data, phone numbers, private database schemas, internal runbooks, or provider account identifiers.

These examples are portfolio material, not a deployable SDK or open-source package.