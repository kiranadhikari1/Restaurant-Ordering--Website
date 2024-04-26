->> https://kiranadhikari1.github.io/Restaurant-Ordering--Website/

Author: Kiran Adhikari

Purpose: Uses MongoDB to store database collection data locally and allow end user(s) to register/login to the restaurant ordering website, place an order and track their orders.

How to run: To run, once the files are opened and you created a folder called 'a4' in the same directory to store the database (then in terminal type mongod --dbpath=a4), then after that is done, type npm install to install the depencencies and make sure mongo/mongodb etc is also installed.
Then type node .\database-initializer.js to start the db initializer and make sure to have the database folder called a4 in the same directory.
Then once that is done in the terminal type node .\server.js to run the server and test it on a webpage.


KNOWN ISSUES: Some features and MongoDB not loading with GitHub Pages. 
Missing/unloaded features: Login/register/logout
