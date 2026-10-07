+++
title = "Scheduling Under Uncertainty"
description = "How to assign schedules when the duration of a task is uncertain?"
date = 2026-10-02
draft = true

[extra]
category = "Case Study"
math = true
+++

Traditional scheduling problems assume the duration of task is known ahead of time. In some settings, this is perfectly reasonable such as a school's timetable where chemistry class lasts three hours. Occasionally, class may end early or go over by a couple of minutes, albeit, the duration is not too uncertain. However, in other settings, the duration of a task is more unknown and only a best guess given prior information can be provided. For example, when scheduling surgeries in a hospital's operating room (OR), we may know, a priori, how long a given surgery should take. Moreover, surgery times vary by type and patient leading to further uncertainty.

Traditional methods used for solving scheduling problems are deterministic and assume the duration of a task is known. Therefore, it can be complex and cumbersome to solve scheduling problems under uncertainty. `argmax`, on the other hand, is designed from the ground up to incorporate uncertainty into the decision making process.

## Narrative

Lets walk through a simplified example: a hospital has three ORs where patients are operated on, and four post-anesthesia care units (PACUs) where patients go to recover after surgery. If no PACU is available, the patient must remain in the OR until they have recovered or a PACU becomes available. ORs have a maximum of eight hours of operation time per day whereas PACUs do not have a time limit. An operation cannot be started if its average time would exceed the eight hours. Only if an operation (before it has started) is expected to go over on time, is rescheduled to the next day. Rescheduling surgeries is extremely costly as patients may need to stay in the hospital an extra night, re-sterilization of equipment, and so forth. On average, a rescheduled surgery costs $3,500.

The hospital already has a deterministic scheduling method in place that uses the average times per surgery type produce a schedule that minimizes the number of rescheduled surgeries. By incorporating uncertainty into the decision making problem, the goal is to produce a weekly schedule that, over time, results in less rescheduled surgeries.

The current deterministic method results in two bumped operations per week, resulting in over 300 bumped operations per year at a cost of almost one million dollars (annually).

```python
import jax.numpy as jnp

x = [0., 1., 2.]
print(x)
```

## Your assumptions are wrong

The
