# League Format & Mobile UI Specification

This document replaces the **Calculator Page** entirely. It defines league logic, ranking rules, and court placement.

---

## 1. Seeding & Rankings Overview

### Initial Seeding (Round 1)

Seeds for Round 1 are determined by **one of the following**:

- Random assignment, **or**
- Total points accumulated from previous matches

---

### Ranking Priority (Used After Every Round)

These rules determine:

1. **End‑of‑round rankings**, and
2. **Seeds for the next round**

Ranking is resolved in this strict order:

1. **Higher Tier**
   _Tier A > B > C > D_
2. **Court Placement Within Tier**
   _Example: 2nd on Court 1 (Tier A) > 3rd on Court 2 (Tier A)_
3. **Game Wins**
   _Example: 3 wins > 2 wins_
4. **Point Differential**
   _Example: +5 > −3_
5. **Previous Seed** (tiebreaker of last resort)

---

## 2. Court Assignment Logic (Between Rounds)

When advancing players to the next round:

1. Players are **grouped by tier**
2. Within each tier, a **snake draw** is applied across courts
3. Seeds are always based on **results from the immediately previous round**

This ensures:

- Competitive balance
- Fair distribution of stronger players
- Minimal rematches

---

## 3. Format Examples

### A. 16 Players

#### Round 1 – Tier A–D

- Court 1 | Tier A | Seeds: 1, 8, 9, 16
- Court 2 | Tier B | Seeds: 2, 7, 10, 15
- Court 3 | Tier C | Seeds: 3, 6, 11, 14
- Court 4 | Tier D | Seeds: 4, 5, 12, 13

---

#### Round 2 – Tier A–B, Tier C–D

- Court 1 | Tier A | Seeds: 1, 4, 5, 8
- Court 2 | Tier A | Seeds: 2, 3, 6, 7
- Court 3 | Tier B | Seeds: 9, 12, 13, 16
- Court 4 | Tier B | Seeds: 10, 11, 14, 15

---

#### Round 3 – Tier A, Tier B, Tier C, Tier D

- Court 1 | Tier A | Seeds: 1, 2, 3, 4
- Court 2 | Tier B | Seeds: 5, 6, 7, 8
- Court 3 | Tier C | Seeds: 9, 10, 11, 12
- Court 4 | Tier D | Seeds: 13, 14, 15, 16

---

### B. 12 Players

#### Round 1 – Tier A–C

- Court 1 | Tier A | Seeds: 1, 6, 7, 12
- Court 2 | Tier B | Seeds: 2, 5, 8, 11
- Court 3 | Tier C | Seeds: 3, 4, 9, 10

---

#### Round 2 – Tier A–C

_(Same structure as Round 1; reseeded based on results)_

---

#### Round 3 – Tier A, Tier B, Tier C

- Court 1 | Tier A | Seeds: 1, 2, 3, 4
- Court 2 | Tier B | Seeds: 5, 6, 7, 8
- Court 3 | Tier C | Seeds: 9, 10, 11, 12

---

## Tier mapping by court count

Below are the recommended tier groupings for each court count. This defines which tiers are active each round.

- 2 Courts

  - Round 1 — Tier A–B
  - Round 2 — Tier A–B
  - Round 3 — Tier A, Tier B

- 3 Courts

  - Round 1 — Tier A–C
  - Round 2 — Tier A–C
  - Round 3 — Tier A, Tier B, Tier C

- 4 Courts

  - Round 1 — Tier A–D
  - Round 2 — Tier A–B, Tier C–D
  - Round 3 — Tier A, Tier B, Tier C, Tier D

- 5 Courts

  - Round 1 — Tier A–E
  - Round 2 — Tier A–B, Tier C–E
  - Round 3 — Tier A, Tier B, Tier C, Tier D, Tier E

- 6 Courts
  - Round 1 — Tier A–F
  - Round 2 — Tier A–C, Tier D–F
  - Round 3 — Tier A, Tier B, Tier C, Tier D, Tier E, Tier F

**This structure is the single source of truth for league logic and UI behavior.**
