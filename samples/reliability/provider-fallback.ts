export type Attempt<T> = {
  provider: string;
  run: () => Promise<T>;
  enabled?: () => boolean;
};

export type FallbackResult<T> =
  | { ok: true; provider: string; value: T; failures: ProviderFailure[] }
  | { ok: false; failures: ProviderFailure[] };

export type ProviderFailure = {
  provider: string;
  message: string;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown provider error';
}

/**
 * Try providers in an explicit order and preserve every failure for logging or
 * audit. Disabled providers are skipped rather than attempted optimistically.
 *
 * Production workflows add provider-specific timeout, retry, and telemetry
 * policies around this pattern.
 */
export async function runWithFallback<T>(
  attempts: Attempt<T>[],
): Promise<FallbackResult<T>> {
  const failures: ProviderFailure[] = [];

  for (const attempt of attempts) {
    if (attempt.enabled && !attempt.enabled()) continue;

    try {
      const value = await attempt.run();
      return {
        ok: true,
        provider: attempt.provider,
        value,
        failures,
      };
    } catch (error) {
      failures.push({
        provider: attempt.provider,
        message: errorMessage(error),
      });
    }
  }

  return { ok: false, failures };
}

/**
 * Example usage:
 *
 * const result = await runWithFallback([
 *   { provider: 'primary-ai', run: () => callPrimary() },
 *   {
 *     provider: 'local-dev-ai',
 *     enabled: () => process.env.NODE_ENV === 'development',
 *     run: () => callLocal(),
 *   },
 * ]);
 *
 * if (!result.ok) return deterministicFallback(input);
 */
