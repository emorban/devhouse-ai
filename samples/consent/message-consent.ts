export type ConsentMessage =
  | { kind: 'opt_out'; normalized: string }
  | { kind: 'help'; normalized: string }
  | { kind: 'resume'; normalized: string }
  | { kind: 'other'; normalized: string };

const OPT_OUT = new Set([
  'STOP',
  'STOP ALL',
  'UNSUBSCRIBE',
  'CANCEL',
  'END',
  'QUIT',
]);

const HELP = new Set(['HELP', 'INFO']);
const RESUME = new Set(['START', 'UNSTOP', 'YES']);

function normalizeMessage(body: string): string {
  return body.trim().replace(/\s+/g, ' ').toUpperCase();
}

/**
 * Classify inbound consent-related messages before any downstream send logic.
 * Production code persists suppression state and applies provider-specific
 * requirements; those details are intentionally private.
 */
export function classifyConsentMessage(body: string): ConsentMessage {
  const normalized = normalizeMessage(body);

  if (OPT_OUT.has(normalized)) return { kind: 'opt_out', normalized };
  if (HELP.has(normalized)) return { kind: 'help', normalized };
  if (RESUME.has(normalized)) return { kind: 'resume', normalized };

  return { kind: 'other', normalized };
}

export function shouldSuppressOutbound(body: string): boolean {
  return classifyConsentMessage(body).kind === 'opt_out';
}
