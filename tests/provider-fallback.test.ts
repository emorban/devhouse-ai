import { describe, expect, it } from 'vitest';
import { runWithFallback } from '../samples/reliability/provider-fallback';

describe('runWithFallback', () => {
  it('returns the first successful provider and preserves earlier failures', async () => {
    const result = await runWithFallback([
      {
        provider: 'primary',
        run: async () => {
          throw new Error('timeout');
        },
      },
      {
        provider: 'secondary',
        run: async () => 'ok',
      },
    ]);

    expect(result).toEqual({
      ok: true,
      provider: 'secondary',
      value: 'ok',
      failures: [{ provider: 'primary', message: 'timeout' }],
    });
  });

  it('skips disabled providers', async () => {
    let called = false;
    const result = await runWithFallback([
      {
        provider: 'disabled',
        enabled: () => false,
        run: async () => {
          called = true;
          return 'wrong';
        },
      },
      { provider: 'fallback', run: async () => 'right' },
    ]);

    expect(called).toBe(false);
    expect(result.ok && result.provider).toBe('fallback');
  });

  it('returns an explicit failure result when every provider fails', async () => {
    const result = await runWithFallback([
      {
        provider: 'one',
        run: async () => {
          throw 'bad';
        },
      },
    ]);

    expect(result).toEqual({
      ok: false,
      failures: [{ provider: 'one', message: 'Unknown provider error' }],
    });
  });
});
