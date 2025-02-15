# Source Code
All the source code for this project is contained within the repo on Github. 

# Directory Layout
All of the code is contained within Backend Files. In Backend Files there are three JS files that make up the server of the program. Additionally there are two folders public and views. The public folder contains four other folders. A CSS folder that holds the CSS style sheet. A font folder that holds the different font files. An image folder that holds the various images and a Javascript folder that holds the front end JS files. The views folder contains a layout folder and the different page handlebars files. The layout folder holds the main handlebar file.

# Building the System
Once the repo has been cloned, open a terminal and cd into the repo. Then run these commands:  
>cd Backend Files  
>npm install  
>npm run start  
  
These commands will install the node modules required for server and start a local instance of the server. You can then visit the server via a web browser and searching for 'localhost:4000/'. To stop the server type CRTL + C in the terminal where the server is running.

# Testing
Majority of the functionality can be tested by accessing and using the website. For API requests user can use a tool like ReqBin to send HTTP requests to the server to check their functionality. Since the database is private users wishing to test a database will have to create their own and connect it to the server. After that sending HTTPS requests and checking the contents of the database are the best testing method.  

# Building release
Building a release is done in the exact same way as building the system. There are no extra things to do.