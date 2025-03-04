# Source Code
All the source code for this project is contained within the repo on Github. 

# Directory Layout
All of the code is contained within Backend Files. In Backend Files there are three JS files that make up the server of the program. Additionally there are two folders public and views. The public folder contains four other folders. A CSS folder that holds the CSS style sheet. A font folder that holds the different font files. An image folder that holds the various images and a Javascript folder that holds the front end JS files. The views folder contains a layout folder and the different page handlebars files. The layout folder holds the main handlebar file.

# Building the System
Requirements: Have nodejs installed  
Once the repo has been cloned, open a terminal and cd into the repo. Then run these commands:  
>cd Backend Files  
>npm install  
>npm run start  
  
These commands will install the node modules required for server and start a local instance of the server. You can then visit the server via a web browser and searching for 'localhost:4000/'. To stop the server type CRTL + C in the terminal where the server is running.

# Testing
Majority of the functionality can be tested by accessing and using the website. For API requests user can use a tool like ReqBin to send HTTP requests to the server to check their functionality. Since the database is private users wishing to test a database will have to create their own and connect it to the server. After that sending HTTPS requests and checking the contents of the database are the best testing method. Any unit test can be added to the __ test__ file and can be run with the command npm run test.

# Building release
To build a release you will first want to find a platform to host the server. Once you have found a service follow the Building the System steps to set up the server. Our release will use Heroku Dynos and has a built in web address. If you plan to use another service understand the process to make it available to the web. Building a release on Heroku is simple. First you will want to create a Dyno. After that you will need to connect it to a repo. First connect it to the Beav Guessers repo. Then under branch to deploy select Heroku_Deploy_Beta option. From there enable wait for GitHub checks and automatic deploys. After that click the deploy branch button. Wait for the process to complete then click visit site. You have successfully created and built a release. 
