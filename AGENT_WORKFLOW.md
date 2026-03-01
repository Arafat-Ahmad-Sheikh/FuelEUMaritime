# AI Agent Workflow Log

## Agents Used
- GitHub Copilot (inline coding assistance)
- Local LLM (used for planning and prompt refinement in drafts)

## Prompts & Outputs
- Example 1: Prompt used to generate computeCB formula

# AI Agent Workflow Log

## Agents Used
- GitHub Copilot — inline code suggestions and small snippets.
- Local planning LLM — used for prompt drafting and iterative task breakdowns.

## How agents were used (high level)
- Scaffolding: generated TypeScript/React file stubs, route handlers, and test skeletons.
- Implementation hints: suggested formulas and small helper functions (for CB computation, pooling allocation).
- Tests: produced example unit and component test scaffolds which were refined and extended.

## Representative prompts & responses

- Example 1 — compute CB formula (refined prompt):

```
Write a TypeScript function `computeCB(route)` that calculates compliance balance as (TARGET_INTENSITY - route.ghgIntensity) * (route.fuelConsumption * MJ_PER_TONNE). Return a typed number and include constants for `TARGET_INTENSITY` (gCO2e/MJ) and `MJ_PER_TONNE`.
```

The agent returned a typed function and suggested using a constant for MJ per tonne. I verified units and integrated the snippet at `backend/src/core/application/computeCB.ts`.

- Example 2 — pool allocation sketch:

```
Provide a greedy allocation algorithm in TypeScript that, given an array of members with `cb_before`, sorts surplus providers and fills deficits until exhausted. Return `cb_after` per member.
```

The agent produced a clear, testable algorithm which I adapted and added validation rules in `backend/src/core/application/pooling.ts`.

## Validation & corrections
- Unit tests: every agent-suggested formula and algorithm was verified with Vitest unit tests added to the project. Tests caught edge cases (e.g., negative values, rounding) and guided refinements.
- Linting & types: I ran ESLint and TypeScript checks; some agent outputs required stronger typing and small bug fixes (unused variables, explicit return types).
- Manual review: numeric units and domain-specific assumptions (MJ per tonne, target intensity value) were manually confirmed against the spec before finalizing.

## Observations
- Saved time: agents accelerated boilerplate creation (file headers, route handlers, test scaffolds) allowing focus on business rules.
- Where they struggled: domain-specific unit handling and off-by-one rounding decisions required human review; some generated code assumed implicit types that TypeScript flagged.
- Best role for agents: prototyping, generating examples, and suggesting refactors — not final authority on domain logic.

## Best practices I followed
- Iterative prompts: break tasks into small, verifiable prompts and re-run agents after tests failed.
- Validate with tests: every significant agent output was covered by at least one unit or integration test.
- Keep agent suggestions minimal: used the agent for small, focused snippets and integrated them after review rather than pasting large blocks unchecked.

## Reproducible snippets
- See `backend/src/core/application/computeCB.ts`, `backend/src/core/application/pooling.ts`, and frontend components under `frontend/src/adapters/ui/` for concrete code that originated from iterative agent prompts.

## Closing notes
This project demonstrates a pragmatic workflow: use agents to accelerate scaffolding and ideation, then lock changes with tests, linting, and manual review to ensure correctness and maintainability.
