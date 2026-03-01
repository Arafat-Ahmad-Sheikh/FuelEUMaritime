# AI Agent Workflow Log

## Agents Used
- GitHub Copilot (inline coding assistance)
- Local LLM (used for planning and prompt refinement in drafts)

## Prompts & Outputs
- Example 1: Prompt used to generate computeCB formula

```
Write a TypeScript function computeCB(route) that returns (target - actual) * energyInScope where energyInScope = fuelConsumption * 41000
```

- Generated snippet: (see `backend/src/core/application/computeCB.ts`)

## Validation / Corrections
- Verified units (gCO2e, MJ) manually and added constants `TARGET_INTENSITY` and `MJ_PER_TONNE`.

## Observations
- Agents saved boilerplate and suggested idiomatic TypeScript.
- Had to correct small unit assumptions and add strict typing.

## Best Practices Followed
- Used agent for scaffolding and iterative prompts; validated outputs with unit tests later.
