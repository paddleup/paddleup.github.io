# Starting a New Season

When a season ends:

1.  **Archive Current Season:**
    *   Move the current `seasonData` object into the `pastSeasons` array in `src/data/leagueData.js`.
    *   You may need to manually calculate the final standings snapshot for the `standings` property in `pastSeasons`.
2.  **Create New Season:**
    *   Reset `seasonData` with a new `season` name (e.g., "Season 3").
    *   Reset `weeks` array with empty templates.
    *   Update `lastUpdated` date.
