# Beav-Guesser
Our project is a take on the game Geoguesser adapted to the OSU campus. Our game will be a web-based application where users are shown a 360 image from around the Oregon State University Campus and asked to guess the location of the image taken. Our major developmental goals are, a user authentication system, user profile, leaderboard system, and integrated locational data.

**How to build and run tests:**
1. Within your terminal clone our GitHub Repository
2. Cd into the "Backend Files" directory
3. Use "npm install" to install node modules
4. Use "npm start" to build the application on the local host

**How to run the system:**

To run this system, go to the website https://beavguesser-095f2d551c81.herokuapp.com/ .

**Each team member’s role in the project:**

Blake - Database

Joy - API/data collection

Lukas - API/data collection

Kevin Tran - Backend

Kevin Nguyen - Backend

Sam - UI Designer/Frontend

Gavin - Frontend

**Links to project-relevant artifacts:**

Trello: https://trello.com/invite/b/6785b34faf152936f7a64481/ATTI04781f6d4e3950e8c2c6ecd52edaf43a00ED59BB/pt18-beav-guesser 

**Communication channels/tools and corresponding policies:**

Discord server link:
https://discord.gg/DcFygYKwqJ

**Policies:**

Communicate any changes to documents or code within a 24-hour period

Members report when they can’t be present 2 days in advance

Give everyone a chance to talk and main communication will be done on Discord

Ask for help when there’s an issue with their task within Discord or group meetups

**Use Cases:**
1. Title: Changing your username\
   Written by: Blake\
   Actors: User\
   Triggers: Change of Username\
   Preconditions: User exists, new name is different than old name, new name is not taken\
   Postconditions (success scenario): Username has been changed\
   List of steps (success scenario)\
       1. User requests change of username\
       2. User asked for new username\
       3. Check if old username = new username, reprompt if true\
       4. Check if new username is taken, reprompt if true\
       5. Username passes checks and is updated in database\
   Extensions/variations of the success scenario\
       1. User fails check if old name = new name, then corrects name\
       2. User fails check if name is taken, then enters a free name\
   Exceptions: failure conditions and scenarios\
       1. User does not exist\
       2. Database is unreachable(on update or checks)\

2. Title: Moving onto a new round\
   Written by: Lukas\
   Actors: User\
   Triggers: Start new round\
   Preconditions: \
   Postconditions (success scenario): User is served location\
   List of steps (success scenario)\
       1. User starts new round\
       2. Random location is pulled from database\
       3. Corresponding streetview is requested from API\
       4. Correct streetview is shown to user\
   Exceptions: failure conditions and scenarios\
       1. Database is unreachable\
       2. API is unreachable\
       3. Incorrect location\
       4. Incorrect streetview\

3. Title: Submitting your guess\
   Written by: Kevin Tran\
   Actors: User\
   Triggers: Submits Location\
   Preconditions: The round has started and user is presented with the location\
   Postconditions (success scenario): User guess is recorded and tallied\
   List of steps (success scenario)\
       1. User clicks a location on the map and submits a guess\
       2. Backend received the guess coordinates and the correct coordinates\
       3. Backend calculates the distance between two locations \
       4. Points are rewarded and the user’s score is stored in a database.\
   Extensions/Variations of the success scenario\
       1. User are shown two points on the map that correspond to their guess and the correct answer.\
   Exceptions: failure conditions and scenarios\
       1. Invalid Guess\
       2. API unreachable\
       3. Database Unreachable\

4. Title: Viewing the leaderboard\
   Written by: Joy Lim\
   Actors: User\
   Triggers: View Leaderboard  \
   Preconditions:\
       1. System has recorded scores for at least one player\
       2. Leaderboard data is up-to-date\
   Postconditions (success scenario):\
       1. Leaderboard option is displayed on the main page\
       2. Leaderboard will display the rank, username, and score\
   List of steps (success scenario)\
       1. User selects “Leaderboard” option from the main page\
       2. System will retrieve user scores from leaderboard data\
       3. Scores will be sorted in descending order\
   Extensions/Variations of the success scenario\
       1. User leaves before scores are recorded\
   Exceptions: failure conditions and scenarios\
       1. Leaderboard is empty meaning the database contains no scores\

5. Title: Logging in to game\
   Written by: Gavin Fifer\
   Actors: User\
   Triggers: Login \
   Preconditions: no account is currently logged in\
   Postconditions (success scenario): The user is logged into their account\
   List of steps (success scenario)\
       1. User clicks the Login button\
       2. System will display the Username and Password fields\
       3. User fills in Username and Password fields and clicks Submit button\
       4. System validates the Username and Password entered\
       5. System returns User to the main page now logged in\
   Extensions/Variations of the success scenario\
       1. The Login button is now replaced with the Logout button\
       2. The User can see their Username next to the Logout button\
   Exceptions: failure conditions and scenarios\
       1. Invalid Username/Password\
       2. The account is already logged into somewhere else\
       3. Database with Usernames/Passwords cannot be reached\

6. Title: Creating a new account\
   Written by: Sam\
   Actors: User\
   Triggers: New user registration\
   Preconditions:\
       1. User isn’t currently logged in\
       2. User provides valid registration details\
   Postconditions (success scenario):\
       1. User account is created and stored in the database\
   List of steps (success scenario)\
       1. User selects the “new account” button from the menu\
       2. System prompts user for username, email, and password\
       3. User enters details and submits\
       4. System checks if submitted details already exist in database\
       5. The check passes and the new account is created and stored\
       6. The user is automatically logged into their account\
   Extensions/Variations of the success scenario\
       1. User inputs an option profile picture\
       2. A “forgot password” routine is initiated\
   Exceptions: failure conditions and scenarios\
       1. Username/email already exists in database\
       2. Database is currently unavailable\

7. Title: Changing your password\
   Written by: Kevin Nguyen\
   Actors: User\
   Triggers: Updates password\
   Preconditions: \
       1. User account already exists\
       2. User provides the current password for the account \
   Postconditions (success scenario): User is able to update their password\
   List of steps (success scenario)\
       1. User clicks on “Update Profile” in the profile page \
       2. System asks for current password\
       3. User enters in the current password\
       4. User enters in a new password and clicks on “Confirm”\
       5. System verifies that current username and password exists in the database and updates the new password to the database\
       6. User is back in the profile page and clicks on “Log Out”\
       7. User enters username and new password and clicks “Log In”\
   Extensions/Variations of the success scenario\
       1. User enters an invalid current password and a message pops up saying to try again\
   Exceptions: failure conditions and scenarios\
       1. Database is down\
       2. Current password is not found\
