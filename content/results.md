PenguinNet-M reaches the best LAR-Forage score (0.78) but is not the best on either
other metric — PenguinNet-L has the lowest (best) LAR-Thermo error, and PenguinNet-S
has the highest LAR-Combined score despite being the smallest model in the family.
No single model dominates across all three metrics, which is itself evidence for the
entanglement failure mode described in the Method section's taxonomy table above:
LAR-Combined does not simply track the average of its component tasks.

Both baselines trail every PenguinNet variant on every metric, confirming the
benchmark isn't trivially solved by a generic encoder — but the gap narrows
substantially on LAR-Thermo specifically, suggesting thermoregulation reasoning is
the harder capability to specialize for.
