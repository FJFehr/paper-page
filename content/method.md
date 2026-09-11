We train a convolutional-recurrent encoder on unlabeled aerial and underwater
observation sequences, producing a 256-dimensional latent state at each timestep.
No task labels are used during pretraining — only a next-state prediction objective.

### Benchmark construction

Five tasks make up *Latent Aquatic Reasoning* (LAR): route quality (LAR-Forage),
thermoregulation cost (LAR-Thermo), predator-risk estimation (LAR-Risk), colony
return-timing (LAR-Return), and a held-out combined task (LAR-Combined). Each task
is scored by linear-probing the frozen latent space — the encoder itself is never
fine-tuned, so a task's score reflects only what the representation already makes
linearly accessible.

The table below summarizes failure modes we observed while building the benchmark,
separate from the quantitative results reported later.

### Validation

Every task's held-out labels were produced by independent domain-expert annotation,
not simulation — see the dataset card on
[Hugging Face](https://huggingface.co/datasets/example/penguin-embeddings) for the
full annotation protocol.
