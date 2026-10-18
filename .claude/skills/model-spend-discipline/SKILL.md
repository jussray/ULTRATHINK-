---
name: model-spend-discipline
description: Decide when and how an app's model calls should use caching, batching, fast mode, or a planner/advisor model — measure usage first, change one lever, prove the saving. Use whenever code calls an LLM API, a model bill or latency is questioned, or someone proposes caching, batch, fast mode, or an advisor.
---

# Model Spend Discipline

Make every model call cost and latency a measured decision, not a vibe. Works with any model provider and any AI executing it. Provider-specific facts live in the adapter tables at the end and expire — re-check them before relying on them.

Runs alongside the other founder skills:
- **ULTRATHINK / Redteam** — first ask whether the call should exist at all.
- **goalfix** — change one lever, the smallest one, then verify.
- **l99 transactional authority** — turning on a paid lever (fast mode, a bigger model, an advisor) is a spend decision. Propose it; the founder approves it.
- **truth-decay** — prices, minimums, model names and beta flags are perishable. Mark each as CURRENT only after re-reading the provider's docs.
- **sauce-guard** — usage numbers, prompts and costs are private metrics. Never publish them.

## Rule 0 — Measure before optimizing

No lever gets turned without numbers from real calls.

1. Find every call site that hits a model API. List: file, model, what is sent (system, tools, messages), roughly how many tokens are fixed vs. per-request, how often it runs, whether a person is waiting.
2. Make each call record the provider's usage block (input, output, cache-write, cache-read, plus any per-iteration or speed fields) into the receipt or log it already writes. Omit usage the provider didn't report — never estimate it.
3. Collect at least two real calls per path before deciding. Write the result as REALITY: VERIFIED / INFERRED / UNKNOWN.

If you can't run the call (no key, no network), say BLOCKED and hand the founder a runnable probe that prints usage. Do not fill the gap with assumed numbers.

## Rule 1 — Pick the lever from the shape of the call

| Shape of the call | Lever | Not this |
|---|---|---|
| Large fixed prefix (system, tools, docs) re-sent on many calls | Prompt caching | — |
| Fixed prefix below the provider's cache minimum | Nothing. Caching would silently no-op | Padding the prompt just to cache it, unless reuse is high and proven |
| Many independent calls, nobody waiting | Batch / async | Batch for chained steps where call N needs call N-1's answer |
| A person is waiting on long output, cost matters less | Fast / priority speed tier | Fast mode for background jobs |
| Long multi-step agent loop, most steps routine, plan quality decisive | Cheaper executor + stronger advisor/planner | Advisor on single-turn Q&A ("nothing to plan") |
| Simple task, big model | Smaller model, proven by an eval | Downgrading without an eval |

One lever per change. Stacking is allowed only after each lever is proven on its own (e.g. batch + cache).

## Rule 2 — Caching done right (any provider with prefix caching)

- **Order from most stable to least:** tools → system/kernel/skills → per-project docs → conversation → the new message.
- **Put the cache marker at the end of the last block that is identical across calls**, never on a block that changes.
- **Anything volatile goes after the last marker:** timestamps, run IDs, receipts, dates, user names. A timestamp inside the prefix means a paid cache write on every call and zero reads.
- **Keep generation settings fixed within a session** (reasoning/thinking mode, effort). Changing them can invalidate the cache.
- **Choose the TTL from the real gap between calls.** If a human approval sits between calls, the short TTL usually expires. Pay for the longer TTL only if the reuse count earns it (see break-even).
- **Optional:** pre-warm the cache at session start with a zero-output request, if the provider supports it.
- **Prove it:** on call 2 the cache-read count must be above 0. If it is 0, the marker is on content that changes, or the prefix is under the minimum.

**Break-even** (W = write multiplier, R = read multiplier, both relative to normal input price; n = calls inside one TTL):
cached cost = W + (n−1)·R, uncached cost = n. Cache only when W + (n−1)·R < n.

## Rule 3 — Batch done right

- Use it only for work where nobody waits on each answer: evals, backfills, sweeps, bulk drafting, nightly review.
- Use a stable custom id per request so results map back. Results can arrive in any order.
- Expect partial failure. Handle succeeded, errored, expired and canceled per item. Never mark the batch done because it ended.
- When batch requests share context, pair batching with the long cache TTL. Cache hits in a batch are best-effort.

## Rule 4 — Fast / priority tiers

- This is a paid upgrade. Propose it with the expected latency win and cost multiple; the founder approves.
- Confirm from the response which speed was actually used. Bill and claims follow the response, not the request.
- Have a fallback: if the fast tier is rate-limited or unavailable, decide up front whether to fail, retry, or drop to standard.

## Rule 5 — Advisor / planner pattern

- Fits long-horizon agent work: coding agents, multi-step research, computer use.
- The pair must be valid: the advisor must be at least as capable as the executor.
- **Cost tracking must read per-iteration usage.** Advisor tokens are often reported apart from the top-level totals, so a receipt that reads only the top level undercounts.
- Cap advisor output on the advisor itself. The main output cap usually doesn't bound it.
- Prove it on your own task with an eval: quality vs. executor-alone and vs. advisor-alone, with total cost.

## Output

```text
REALITY:    call sites + measured usage (VERIFIED / INFERRED / UNKNOWN / BLOCKED)
DECISION:   one lever, or "none — <reason>"
FIX:        exact change (files / config), smallest possible
PROOF:      before/after usage from real calls (cache-read > 0, batch per-item results, speed field, iteration totals)
COST:       before vs after per call / per day, with the price source and its date
RISK:       what silently breaks the saving (prefix drift, TTL expiry, undercounted usage)
ROLLBACK:   remove the lever; responses are unchanged
NEXT GATE:  the one founder decision (usually: approve a paid lever, or run the probe)
```

## Never

- Claim a saving without before/after usage from real calls.
- Put caching, batch or speed flags inside a portable skill or prompt file. They belong in the per-provider adapter in code, so the same skill runs on any model.
- Turn on a paid tier, a bigger model or an advisor without founder approval.
- Publish prompts, usage or costs.

---

## Adapter: Anthropic Claude API (verified from platform.claude.com docs, 2026-10-06 — re-verify before use)

**Caching**
- `cache_control: {type: "ephemeral"}` on a block; `ttl: "1h"` for the long TTL. Also available as automatic top-level caching.
- Up to 4 breakpoints. Lookback is 20 blocks per breakpoint.
- Order is tools → system → messages; a change at one level invalidates that level and everything after it.
- Minimum cacheable prompt: 512 tokens (Fable 5.1, Mythos 5.1, Opus 5.5, Opus 5, Sonnet 5.5, Fable 5, Mythos 5); 1,024 (Opus 4.8, Sonnet 5, Sonnet 4.6); 2,048 (Opus 4.7); 4,096 (Opus 4.6, Opus 4.5, Haiku 4.5). Below the minimum, the call runs uncached with no error.
- Multipliers vs base input: 5m write 1.25×, 1h write 2×, read ≈0.05–0.1× (Opus 5.5 $0.20 on $4; Sonnet 5.5 $0.20 on $2; Haiku 4.5 $0.10 on $1).
- Break-even: 5m TTL pays from the 2nd call; 1h TTL pays from the 3rd.
- Pre-warm: send `max_tokens: 0`. It writes the cache and returns empty content with full usage.
- Changing thinking settings or `output_config.effort` invalidates the message cache.
- Usage fields: `cache_creation_input_tokens`, `cache_read_input_tokens`. Both 0 means the call wasn't cached.

**Batch (Message Batches API)**
- All usage is billed at 50%. Up to 100,000 requests or 256 MB per batch.
- Most batches finish within 1 hour; the processing window is 24 hours.
- Stacks with caching; batch cache hits are best-effort (30–98%). Use the 1h TTL for shared context.

**Fast mode (research preview, access required)**
- Request with `speed: "fast"` plus beta header `fast-mode-2026-02-01`.
- Models: Opus 5.5, Opus 5, Opus 4.8 only. Not available on Opus 4.7, which returns an error.
- Opus 5.5 fast pricing is $8 / $40 per MTok, about 2× standard. Check `usage.speed` on the response.
- Claude API and Managed Agents only.

**Advisor tool (beta)**
- Tool `{type: "advisor_20260301", name: "advisor", model: <advisor>}` plus beta header `advisor-tool-2026-03-01`.
- Top-level `usage` counts the executor only. Advisor tokens appear in `usage.iterations[]` with `type: "advisor_message"` and are billed at the advisor's rates.
- Cap advisor output with `max_tokens` on the tool definition (minimum 1024).
- Example valid pairs: Sonnet 5.5 executor with Opus 5.5 / Fable 5.1 advisor; Haiku 4.5 executor with Opus or Fable advisor.
- Claude API and Claude Platform on AWS only.

## Adapter: other providers (OpenAI, Gemini, DeepSeek, Perplexity, Meta/Muse)

UNKNOWN until verified. Before using a lever on one of these, fill in from that provider's current docs: whether caching exists and is automatic or explicit, the minimum prefix, read/write prices, a batch/async API and its discount, priority or speed tiers, and the usage field names. Record the source URL and date. Until filled, Rule 0 still applies: measure first.
