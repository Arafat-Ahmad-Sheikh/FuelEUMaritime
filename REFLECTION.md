# Reflection

This short reflection summarizes what I learned while building the FuelEU Maritime minimal implementation and how I used AI-assisted tools during development.

What I learned

- Agents accelerate scaffolding: Using an AI assistant for repetitive tasks (file templates, basic handlers, and test skeletons) significantly reduced setup time and allowed me to focus on domain logic.
- Tests are the great equalizer: I relied on Vitest unit tests and small integration tests to validate algorithmic outputs (CB computation, pooling allocation). Tests caught subtle numeric and typing issues that the agent missed.
- Type safety matters: TypeScript's strictness surfaced assumptions from generated code; iterating with tests + type fixes improved overall reliability.

Efficiency gains vs manual coding

- Time saved: boilerplate and common patterns (Express route wiring, React component structure, test harnesses) were produced much faster with agent help.
- Effort needed: domain validation, numeric units, and deciding correct data shapes still required human domain knowledge and checking.

What I'd improve next time

- Narrow prompts earlier: provide the agent with more domain context and unit specifications in the initial prompt to reduce iteration.
- More test-driven generation: ask the agent to produce tests first, then generate code to satisfy them.
- CI automation: add a CI workflow to run tests and lint automatically on push (left out by user preference in this task).

Overall

The project demonstrates a practical pairing: AI agents speed up routine work while human oversight (tests, linting, and review) ensures correctness for domain-critical parts.