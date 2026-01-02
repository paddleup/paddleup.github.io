# League Format & Mobile UI Specification

This document replaces the **Calculator Page** entirely. It defines league logic, ranking rules, court placement, and a **mobile‑first UI structure**.

---

## 1. Seeding & Rankings Overview

### Initial Seeding (Round 1)

Seeds for Round 1 are determined by **one of the following**:

* Random assignment, **or**
* Total points accumulated from previous matches

---

### Ranking Priority (Used After Every Round)

These rules determine:

1. **End‑of‑round rankings**, and
2. **Seeds for the next round**

Ranking is resolved in this strict order:

1. **Higher Division**
   *Division A > B > C > D*
2. **Court Placement Within Division**
   *Example: 2nd on Court 1 (Div A) > 3rd on Court 2 (Div A)*
3. **Game Wins**
   *Example: 3 wins > 2 wins*
4. **Point Differential**
   *Example: +5 > −3*
5. **Previous Seed** (tiebreaker of last resort)

---

## 2. Court Assignment Logic (Between Rounds)

When advancing players to the next round:

1. Players are **grouped by division**
2. Within each division, a **snake draw** is applied across courts
3. Seeds are always based on **results from the immediately previous round**

This ensures:

* Competitive balance
* Fair distribution of stronger players
* Minimal rematches

---

## 3. Format Examples

### A. 16 Players

#### Round 1 – 1 Division

* Court 1 | Division A | Seeds: 1, 8, 9, 16
* Court 2 | Division A | Seeds: 2, 7, 10, 15
* Court 3 | Division A | Seeds: 3, 6, 11, 14
* Court 4 | Division A | Seeds: 4, 5, 12, 13

---

#### Round 2 – 2 Divisions

* Court 1 | Division A | Seeds: 1, 4, 5, 8
* Court 2 | Division A | Seeds: 2, 3, 6, 7
* Court 3 | Division B | Seeds: 9, 12, 13, 16
* Court 4 | Division B | Seeds: 10, 11, 14, 15

---

#### Round 3 – 4 Divisions

* Court 1 | Division A | Seeds: 1, 2, 3, 4
* Court 2 | Division B | Seeds: 5, 6, 7, 8
* Court 3 | Division C | Seeds: 9, 10, 11, 12
* Court 4 | Division D | Seeds: 13, 14, 15, 16

---

### B. 12 Players

#### Round 1 – 1 Division

* Court 1 | Division A | Seeds: 1, 6, 7, 12
* Court 2 | Division A | Seeds: 2, 5, 8, 11
* Court 3 | Division A | Seeds: 3, 4, 9, 10

---

#### Round 2 – 1 Division

*(Same structure as Round 1; reseeded based on results)*

---

#### Round 3 – 3 Divisions

* Court 1 | Division A | Seeds: 1, 2, 3, 4
* Court 2 | Division B | Seeds: 5, 6, 7, 8
* Court 3 | Division C | Seeds: 9, 10, 11, 12
---

**This structure is the single source of truth for league logic and UI behavior.**
