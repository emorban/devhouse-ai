import { describe, expect, it } from 'vitest';
import {
  classifyConsentMessage,
  shouldSuppressOutbound,
} from '../samples/consent/message-consent';

describe('message consent', () => {
  it('normalizes and classifies opt-out keywords', () => {
    expect(classifyConsentMessage('  stop   all ')).toEqual({
      kind: 'opt_out',
      normalized: 'STOP ALL',
    });
    expect(shouldSuppressOutbound('unsubscribe')).toBe(true);
  });

  it('separates help and resume intents from opt-out', () => {
    expect(classifyConsentMessage('help').kind).toBe('help');
    expect(classifyConsentMessage('start').kind).toBe('resume');
    expect(shouldSuppressOutbound('start')).toBe(false);
  });

  it('treats ordinary messages as non-consent commands', () => {
    expect(classifyConsentMessage('Can you call me tomorrow?')).toEqual({
      kind: 'other',
      normalized: 'CAN YOU CALL ME TOMORROW?',
    });
  });
});
