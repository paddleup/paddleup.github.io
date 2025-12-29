# Updating Weekly Results

After a league night (Sunday), follow these steps to update the standings:

1.  **Gather Data:** Get the final rankings (1-16) and match scores from the night.
2.  **Edit Data File:** Open `src/data/leagueData.js`.
3.  **Locate Week:** Find the corresponding week object in `seasonData.weeks`.
4.  **Update Status:** Change `isCompleted` to `true`.
5.  **Enter Rankings:** Update the `rankings` array with player IDs in order of finish (1st to 16th).
    *   *Note: Ensure player IDs match exactly with `src/data/players.json`.*
6.  **Enter Matches:** Update the `matches` array.
    *   Format: `{ team1: ["id1", "id2"], team2: ["id3", "id4"], score1: 11, score2: 9 }`
7.  **Verify:** Run `npm run dev` to check the Standings page locally. The points and stats will calculate automatically.
