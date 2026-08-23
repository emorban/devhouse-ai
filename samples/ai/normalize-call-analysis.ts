export type NormalizedCallAnalysis = {
  summary: string;
  intent: string;
  outcome: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore: number | null;
  painPoints: string[];
  objections: string[];
  keyQuotes: string[];
  budgetSignal: string;
  timeline: string;
  decisionMaker: string;
  nextAction: string;
  companyName: string | null;
  industry: string;
  callSuccessful: boolean;
};

type ProviderCallAnalysis = {
  call_summary?: unknown;
  user_sentiment?: unknown;
  call_successful?: unknown;
  in_voicemail?: unknown;
  custom_analysis_data?: Record<string, unknown> | null;
};

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSentiment(value: unknown): NormalizedCallAnalysis['sentiment'] {
  const sentiment = String(value ?? '').toLowerCase();
  if (sentiment.includes('posi')) return 'positive';
  if (sentiment.includes('nega')) return 'negative';
  return 'neutral';
}

function asBoolean(value: unknown): boolean {
  return value === true || String(value ?? '').toLowerCase() === 'true';
}

/**
 * Convert a provider-specific post-call payload into the stable shape used by
 * downstream product workflows. Production code applies additional validation,
 * persistence, and tenant-specific rules that are intentionally omitted here.
 */
export function normalizeCallAnalysis(
  input: ProviderCallAnalysis | null | undefined,
): NormalizedCallAnalysis {
  const analysis = input && typeof input === 'object' ? input : {};
  const custom =
    analysis.custom_analysis_data && typeof analysis.custom_analysis_data === 'object'
      ? analysis.custom_analysis_data
      : {};

  const rawLeadScore = Number(custom.lead_score);
  const voicemail = asBoolean(analysis.in_voicemail);
  const recommendation = asText(custom.closing_recommendation, 'Review call');

  return {
    summary: asText(analysis.call_summary),
    intent: asText(custom.intent, 'unknown'),
    outcome: voicemail ? 'voicemail_left' : asText(custom.outcome, 'other'),
    sentiment: normalizeSentiment(analysis.user_sentiment),
    leadScore: Number.isFinite(rawLeadScore) ? rawLeadScore : null,
    painPoints: asStringList(custom.pain_points),
    objections: asStringList(custom.objections),
    keyQuotes: asStringList(custom.key_quotes ?? custom.key_quote),
    budgetSignal: asText(custom.budget_signal, 'unknown'),
    timeline: asText(custom.timeline, 'unknown'),
    decisionMaker: asText(custom.decision_maker, 'unknown'),
    nextAction: recommendation,
    companyName: asText(custom.company_name) || null,
    industry: asText(custom.industry, 'unknown'),
    callSuccessful: asBoolean(analysis.call_successful),
  };
}
