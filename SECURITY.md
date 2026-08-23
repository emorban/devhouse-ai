# Security

This repository is a sanitized public engineering portfolio. The production DevHouse AI repository and operational infrastructure are private.

## Reporting an issue

If you find a credential, token, customer record, private identifier, operational runbook, or other information that appears to have been published unintentionally, please **do not open a public GitHub issue**.

Report it through the contact path at https://www.devhouseai.com and include the affected file/path and a short description.

## Public-repository boundary

The following should never be committed here:

- API keys, tokens, webhook secrets, credentials, or private keys
- real customer or tenant data
- production phone numbers or private account identifiers
- environment files other than sanitized examples
- internal incident, rollback, recovery, or blocker procedures
- private monitoring/proof scripts
- internal sales or commercial-operating material

Code examples in this repository are intentionally sanitized and may omit production-specific configuration and defensive checks.