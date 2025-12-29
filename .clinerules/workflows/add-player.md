# Adding a New Player

When a new player joins the league:

1.  **Prepare Image:** Add their profile photo to `public/images/players/`.
    *   Naming convention: `firstname-lastname.jpg` (lowercase).
2.  **Edit Roster:** Open `src/data/players.json`.
3.  **Add Entry:** Add a new object to the array:
    ```json
    {
      "id": "firstname lastname", // Unique ID, lowercase, no spaces
      "name": "First Last",
      "dupr": 4.5,
      "image": "/images/players/firstname-lastname.jpg",
      "url": "/images/players/firstname-lastname.jpg"
    }
    ```
4.  **Verify:** Check the Players page to see the new card.
