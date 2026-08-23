import { describe, expect, it } from 'vitest';
import { normalizeCallAnalysis } from '../samples/ai/normalize-call-analysis';

describe('normalizeCallAnalysis', () => {
  it('maps provider data into a stable domain shape', () => {
    const result = normalizeCallAnalysis({
      call_summary: 'Caller needs help with missed leads.',
      user_sentiment: 'positive',
      call_successful: true,
      custom_analysis_data: {
        intent: 'booking_strategy_call',
        outcome: 'interested_needs_followup',
        lead_score: '88',
        pain_points: 'missed calls; slow response',
        objections: ['price'],
        key_quote: 'We need someone answering after hours.',
        budget_signal: 'yes_implied',
        timeline: 'this_month',
        decision_maker: 'yes',
        closing_recommendation: 'Follow up tomorrow',
        company_name: 'Example Service Co',
        industry: 'home_services',
      },
    });

    expect(result).toEqual({
      summary: 'Caller needs help with missed leads.',
      intent: 'booking_strategy_call',
      outcome: 'interested_needs_followup',
      sentiment: 'positive',
      leadScore: 88,
      painPoints: ['missed calls', 'slow response'],
      objections: ['price'],
      keyQuotes: ['We need someone answering after hours.'],
      budgetSignal: 'yes_implied',
      timeline: 'this_month',
      decisionMaker: 'yes',
      nextAction: 'Follow up tomorrow',
      companyName: 'Example Service Co',
      industry: 'home_services',
      callSuccessful: true,
    });
  });

  it('uses safe defaults for missing or malformed provider data', () => {
    expect(normalizeCallAnalysis(null)).toEqual({
      summary: '',
      intent: 'unknown',
      outcome: 'other',
      sentiment: 'neutral',
      leadScore: null,
      painPoints: [],
      objections: [],
      keyQuotes: [],
      budgetSignal: 'unknown',
      timeline: 'unknown',
      decisionMaker: 'unknown',
      nextAction: 'Review call',
      companyName: null,
      industry: 'unknown',
      callSuccessful: false,
    });
  });

  it('lets voicemail state override a provider outcome', () => {
    const result = normalizeCallAnalysis({
      in_voicemail: 'true',
      custom_analysis_data: { outcome: 'booked' },
    });

    expect(result.outcome).toBe('voicemail_left');
  });
});
