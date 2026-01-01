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

## 4. Mobile‑First UI Structure

### Round Selector

* Segmented control or tabs: **Round 1 | Round 2 | Round 3**
* Defaults to the current round

---

### Court Card (Collapsible)

Each court appears as a **collapsible card** for vertical scrolling.

**Header:**

* Court Number
* Division Badge (A / B / C / D)
* Expand / Collapse toggle

---

### Player Assignment

Four stacked comboboxes:

* Placeholder text: `P1`, `P2`, `P3`, `P4`
* Searchable player list
* Prevent duplicate selections

---

### Matches Section

Each court contains **3 matches**.

For every score dropdown:

* Options: **0–11**

**Match Layout (stacked for mobile):**

* P1, P2 → Score Dropdown
* VS
* P3, P4 → Score Dropdown

Matches:

1. P1/P2 vs P3/P4
2. P1/P3 vs P2/P4
3. P1/P4 vs P2/P3

---

### Court Results (Auto‑Calculated)

UI control: add a prominent "Next Round" button (top or bottom of the calculator). When tapped the UI must:
- Recompute final rankings from the current round's inputs (use the Ranking Priority rules).
- Group players by division (based on the computed results).
- Apply a snake draw within each division to place players onto courts for the next round (seeds are derived from the immediately previous round).
- Advance the Round selector (e.g., Round 1 → Round 2) and render the new court assignments.
- Persist or snapshot the completed round so users can review previous-round results if needed.

Displayed after scores are entered.

| Place | Player | Wins-Losses | Point Diff. |
| ----- | ------ | ----------- | ----------- |
| 1st   | Name   | 3-0         | +15         |
| 2nd   | Name   | 1-2         | +5          |
| 3rd   | Name   | 1-2         | -5          |
| 4th   | Name   | 1-2         | -15         |

---

## 5. Round Rankings Output

After all courts are completed:

### Round Rankings Table

| Rank | Player | Next Assignment               |
| ---- | ------ | ----------------------------- |
| 1st  | Name   | Court 1 · Spot 1 · Division A |
| 2nd  | Name   | Court 1 · Spot 2 · Division A |
| …    | …      | …                             |

This table:

* Drives **next‑round seeding**
* Is fully derived from ranking priority rules

---

## 6. UX Notes

* No horizontal scrolling
* One court expanded at a time by default
* Sticky Round Selector
* All calculations happen automatically
* Manual overrides disabled to preserve integrity

---

**This structure is the single source of truth for league logic and UI behavior.**
