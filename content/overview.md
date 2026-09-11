Reasoning about aquatic environments requires tracking variables that trade off
against each other over long horizons — energy expenditure, prey density, water
temperature, predator risk — in ways that are hard to separate from raw perception.
Prior benchmarks either test perception (identify the fish) or planning (choose a
route) in isolation. We ask whether one *latent* representation, trained without
task-specific supervision, already supports both, or whether the two remain
entangled in ways that break naive probing.

## Why a benchmark, not just a model

A single model claiming to "reason about aquatic environments" is not falsifiable on
its own — the claim only becomes testable against a fixed, public benchmark that
other approaches can be measured against too. We release the full benchmark suite,
evaluation harness, and baseline results at
[github.com/example/penguin-embeddings](https://github.com/example/penguin-embeddings),
alongside the dataset itself.

We find that latent-space probes recover foraging-route quality well, but
thermoregulation trade-offs are consistently underestimated — see Results below.
