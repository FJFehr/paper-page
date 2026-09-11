<!-- Qualitative example table -- rendered generically by template/js/tables.js,
     the same renderer used for any `table` block. Inline formatting below
     (**bold**, *italic*, ~~strikethrough~~) exercises tableInline(). -->
| Failure mode | Description | Example |
| --- | --- | --- |
| **Route shortcutting** | The probe finds a route that scores well on LAR-Forage but crosses a *predator-risk* zone the label ignored. | A "high-quality" route through a seal colony's hunting grounds. |
| **Thermo underestimation** | Latent state under-predicts energetic cost of prolonged dives in cold water. | ~~Predicted cost: low~~ — actual cost: high. |
| **Return-timing drift** | LAR-Return probes degrade on sequences longer than the pretraining window. | Colony return time off by *several hours* on 30-day sequences. |
| **Combined-task entanglement** | LAR-Combined score is lower than the average of its component tasks, not the max — evidence the tasks share representational capacity rather than composing cleanly. | See Results: LAR-Combined trails both LAR-Forage and LAR-Thermo individually. |
