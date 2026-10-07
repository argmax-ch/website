+++
title = "Security levels and saddle points"
description = "What a payoff matrix guarantees before anyone moves, with a few lines of Rust to compute it."
date = 2026-10-02
draft = true

[extra]
category = "Research"
math = true
+++

A two-player zero-sum game is just a matrix. Rows are our actions, columns are the adversary's, and the entry $a_{ij}$ is what we receive when we play row $i$ and they play column $j$. Before anyone moves, each side can compute what it can *guarantee*.

## Two security levels

If we commit to a row and assume the worst, row $i$ is worth $\min_j a_{ij}$. Choosing the best such row gives our **lower value**, $\underline{v} = \max_i \min_j a_{ij}$. The adversary reasons the same way from the other side, which gives the **upper value**, $\overline{v} = \min_j \max_i a_{ij}$. It is always true that $\underline{v} \le \overline{v}$: what we can force never exceeds what they can hold us to.

Take the matrix

{% math() %}
A = \begin{pmatrix}
3 & 1 & 4 \\
2 & 2 & 5 \\
0 & 1.5 & 6
\end{pmatrix}.
{% end %}

The row minima are $(1, 2, 0)$, so $\underline{v} = 2$ from the middle row. The column maxima are $(3, 2, 6)$, so $\overline{v} = 2$ from the middle column. The two values meet.

## Computing it

Both levels are a fold and a comparison. `f64` has no total order, so we use `total_cmp` to pick the best row and column without panicking:

```rust
/// Row player's pure-strategy security level: the best worst case.
fn maximin(a: &[Vec<f64>]) -> (usize, f64) {
    a.iter()
        .map(|row| row.iter().copied().fold(f64::INFINITY, f64::min))
        .enumerate()
        .max_by(|(_, x), (_, y)| x.total_cmp(y))
        .expect("payoff matrix needs at least one row")
}

/// Column player's pure-strategy security level: the smallest worst loss.
fn minimax(a: &[Vec<f64>]) -> (usize, f64) {
    (0..a[0].len())
        .map(|j| a.iter().map(|row| row[j]).fold(f64::NEG_INFINITY, f64::max))
        .enumerate()
        .min_by(|(_, x), (_, y)| x.total_cmp(y))
        .expect("payoff matrix needs at least one column")
}

fn main() {
    // Payoffs to the row player; the column player pays them.
    let a = vec![
        vec![3.0, 1.0, 4.0],
        vec![2.0, 2.0, 5.0],
        vec![0.0, 1.5, 6.0],
    ];

    let (i, lower) = maximin(&a);
    let (j, upper) = minimax(&a);
    println!("row {i} guarantees at least {lower}");
    println!("column {j} concedes at most {upper}");

    if lower == upper {
        println!("saddle point at ({i}, {j}) with value {lower}");
    }
}
```

Running it prints:

```text
row 1 guarantees at least 2
column 1 concedes at most 2
saddle point at (1, 1) with value 2
```

## When the values disagree

A saddle point is the lucky case. In matching pennies, $\underline{v} = -1$ and $\overline{v} = 1$, and no single row is safe. The fix is to randomize: choose a mixed strategy $x$ in the probability simplex $\Delta$ and maximize the worst expected payoff. That is a linear program:

{% math() %}
\begin{aligned}
\max_{x \in \mathbb{R}^m,\; v \in \mathbb{R}} \quad & v \\
\text{subject to} \quad & \textstyle\sum_{i} x_i \, a_{ij} \ge v \quad \forall j, \\
& \textstyle\sum_{i} x_i = 1, \;\; x \ge 0.
\end{aligned}
{% end %}

Von Neumann's minimax theorem says that with mixed strategies the gap always closes:

$$
\max_{x \in \Delta} \min_{y \in \Delta} x^\top A y = \min_{y \in \Delta} \max_{x \in \Delta} x^\top A y.
$$

That single equality is the reason a worst-case guarantee is something you can compute rather than merely hope for.
