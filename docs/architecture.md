# Architecture

## Goal

Surface the few Reddit conversations where an affiliated product can genuinely help, draft a useful response, and stop at human review.

## Pipeline

```
Product Brain
  -> Intent Search
  -> Reddit Provider
  -> Trust Boundary / Need Extraction
  -> Qualification
  -> Community Policy
  -> Opportunity Scoring
  -> Context Retrieval
  -> Reply Draft
  -> Critic + Policy
  -> Human Review
  -> POST_READY
  -> Human publishes
  -> Outcome Tracking
  -> Learning
```

## Agent topology

- Orchestrator — coordinates state, never invents evidence.
- Discovery — searches only configured subreddits and high-intent phrases.
- Need Extractor — converts untrusted Reddit text into structured stated needs.
- Qualifier — rejects weak fit and already-saturated/non-actionable threads.
- Community Agent — interprets subreddit self-promotion constraints.
- Context Agent — retrieves only verified product facts and experience evidence.
- Writer — short, peer-like, non-salesy drafts.
- Critic — checks helpfulness, specificity, disclosure, claims, and register.
- Compliance — hard gate before review.
- Learning — records outcomes without optimizing toward spam volume.

## State machine

`discovered -> pre_filtered -> qualified -> rules_checked -> context_ready -> drafted -> critique_passed -> review_required -> approved -> post_ready -> posted -> tracking -> learned`

`dismissed` is terminal and may be reached from any pre-publish review state.

## M1 boundary

M1 intentionally has no Reddit credential storage or autonomous write path.
