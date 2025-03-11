# Manual Testing for the Beav-Guesser website


## 1 - Page Direct Connection Tests

**Default Home page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/" into your browser's search bar  
*Expected Output:* The Beav-Guesser Home page should be displayed

**About page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/about" into your browser's search bar  
*Expected Output:* The Beav-Guesser About page should be displayed

**Leaderboard page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/leaderboard" into your browser's search bar  
*Expected Output:* The Beav-Guesser Leaderboard page should be displayed

**Login page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/login" into a web browser's search bar  
*Expected Output:* The Beav-Guesser Login page should be displayed. If already signed in, should redirect to Profile page

**Signup page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/signup" into a web browser's search bar  
*Expected Output:* The Beav-Guesser Signup page should be displayed. If already signed in, should redirect to Profile page

**Profile page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/profile" into a web browser's search bar  
*Expected Output:* The Beav-Guesser Profile page should be displayed. If already signed in, should redirect to Login page

**Game page connection test**  
*Input:* "https://beavguesser-095f2d551c81.herokuapp.com/guesser" into a web browser's search bar  
*Expected Output:* The Beav-Guesser Game page should be displayed and start a new game whether signed in or not

## 2 - Login page Tests

**Valid Login test**  
*Input:* On the Login page, enter "Gavin" into the username field and "Fifer" into the password field. Then press the Login button
*Expected Output:* You should now be on the home page and signed in as the account "Gavin". The Login and Signup buttons should be replaced with a Profile button

**Invalid Password Login test**  
*Input:* On the Login page, enter "Gavin" into the username field and "Gavin" into the password field. Then press the Login button
*Expected Output:* A message should be displayed stating "Username or Password is incorrect!" and nothing should be changed.

**Invalid  Username Login test**  
*Input:* On the Login page, enter "Fifer" into the username field and "Fifer" into the password field. Then press the Login button
*Expected Output:* A message should be displayed stating "Username or Password is incorrect!" and nothing on the page should be changed.

## 3 - Signup page Tests

**Valid Signup test**  
*Input:* On the Signup page, enter "Gavin2" into the username field and "Fifer2" into the password and confirm password field. Then press the Signup button.  
*Expected Output:* You should now be on the Login page. (If successful, delete this profile before moving to the next test.)

**Invalid Signup test**  
*Input:* On the Signup page, enter "Gavin" into the username field and "Fifer2" into the password and confirm password field. Then press the Signup button.  
*Expected Output:* A message should be displayed stating "That username is taken! Please try another" and nothing on the page should be changed.

## 4 - Profile page Tests

**Valid Logout test**  
*Input:* On the Profile page, press the Logout button.  
*Expected Output:* You should now be on the Home page and no longer signed in. The Profile button should now be replaced by the Login and Signup buttons.

**Valid Delete Profile test**  
*Input:* On the Profile page, press the Delete Profile button, then press the Delete button, then the OK button.  
*Expected Output:* You should now be on the Home page and no longer signed in. The Profile button should now be replaced by the Login and Signup buttons. When attempting to login to the account again, it should fail stating incorrect username or password. The account should not be present on the Leaderboard page.

## 5 - About page Tests

**User Manual link test**  
*Input:* On the About page, click on the "User Manual" text embeded hyperlink.  
*Expected Output:* You should now be at the User_Manual.md github page linked here: https://github.com/blakethomas12/Beav-Guesser/blob/main/User_Manual.md.

## 6 - Home page Tests

**Play Game test**  
*Input:* On the Home page, click on the "Play Game" button.  
*Expected Output:* You should now be on the guesser page liked here: https://beavguesser-095f2d551c81.herokuapp.com/guesser.

**Bug Reports link test**  
*Input:* On the Home page, click on the "Bug Reports Here" text embeded hyperlink.  
*Expected Output:* You should now be at the Issues github page liked here: https://github.com/blakethomas12/Beav-Guesser/issues.

## 7 - Guesser page Tests

**Show Map button test**  
*Input:* On the Guesser page, click on the "Show Map" button.  
*Expected Output:* The Guesser map should now be displayed for the user.

**Hide Map button test**  
*Input:* On the Guesser page after clicking the "Show Map button", click on the "Hide Map" button.  
*Expected Output:* The Guesser map should now be hidden from the user.

**Guess with map test**  
*Input:* On the Guesser page with the map open, click on a location on the map.  
*Expected Output:* If the map has not been clicked on yet, a pin should be placed where you clicked and another pin should be placed at the correct location on the map with a line drawn between the two. The score at the bottom of the screen should also be updated to the current score.

**Next Round button test**  
*Input:* On the Guesser page after showing the map and clicking on a location on the map, press the "Next Round" button.  
*Expected Output:* If there are more rounds to be played then the round should be updated, the score should remain from the previous round, the location should be different, and the map should be reset to not have any pins or lines on it. If it was the last round, it should display the Game Over screen with your accumulated score displayed, and the leaderboard should now be updated to include the new score in that user's total score if they were signed in.