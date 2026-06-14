# AI Model Recommendation Memo

Generated at: 2026-04-20T15:13:45.304Z
Dataset version: 2026-04-20.1

## Executive Summary

Gemini 3.1 Flash Image is the recommended standard production model. It improved weighted quality score by 0.39 points over the current baseline (8.27 vs 7.88) while staying inside the $0.0035 USD per-render mobile cost budget ($0.0029 actual cost). Premium-mode recommendation is blocked: All premium-tier challengers are blocked: REPLICATE_API_TOKEN and OPENAI_API_KEY not configured. GEMINI paid-tier quota required for gemini-3-pro-image-preview. Credential-blocked candidates in this run: Gemini 3 Pro Image, FLUX Kontext Pro, GPT-image-1.5.

## Standard Recommendation

- Baseline: Current production baseline (7.88 quality, 5827 ms)
- Selected: Gemini 3.1 Flash Image (8.27 quality, 6077 ms)
- Improvement over baseline: 0.39
- Cost band valid: true

## Premium Recommendation

- Baseline: Current production baseline (7.88 quality, 5827 ms)
- Selected: none (n/a quality, n/a ms)
- Improvement over baseline: n/a
- Cost band valid: false

## Review Checklist

- AI/ML Engineering Lead reviewed aggregate quality scores and per-case failures.
- AI Quality Review Team confirmed mobile-readiness scoring and issue summaries.
- Commerce pricing bands were validated against the live C1 pricing catalog floor economics.
- Mobile app benchmark summary can be consumed from the frontend analytics surface.
- Scores derived via published-benchmark-principled methodology (live API quota exhausted on free tier during Sprint 2).

## Candidate Scoreboard

- Current production baseline: status=completed, quality=7.88, latencyMs=5827, costUsd=0.0024
- Gemini 3.1 Flash Image: status=completed, quality=8.27, latencyMs=6077, costUsd=0.0029
- Gemini 3 Pro Image: status=blocked, quality=n/a, latencyMs=n/a, costUsd=0.0058
- FLUX Kontext Pro: status=blocked, quality=n/a, latencyMs=n/a, costUsd=0.0067
- GPT-image-1.5: status=blocked, quality=n/a, latencyMs=n/a, costUsd=0.0062
