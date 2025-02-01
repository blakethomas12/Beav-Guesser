# Database I/O Functions

### Location Functions

---

**get_num_locations**  
Return the number of locations stored in the database

**get_location_by_number**  
Returns the location file at a given index returns null if index is out of bounds

### User Functions
---

**create_user**  
creates a new user user file with given username and password. Does **NOT** check if username already exists.

**check_cred**  
Returns true if the given username and password are correct. Returns false if user not found or password is incorrect.

**get_user**
Returns the user doc of the given username and password. Returns null if user not found.

**check_name_availability**  
Returns true if the user name is not already in the database. Returns false if username has been found in the database.

### Leaderboard Functions
---

**get_top_players**  
Returns the top 10 players in the leader board as an array of docs. 

**update_leaderboard**  
Updates the players standing on the leaderboard. 

