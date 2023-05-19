const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const mongoose = require('mongoose');
let mongo = require('mongodb');
const { render } = require('pug');
let MongoClient = mongo.MongoClient;
const app = express();
const PORT = process.env.PORT || 3000;

// Setting session store
const store = new MongoDBStore({
    mongoUrl: 'mongodb://localhost/a4',
    collection: 'users'
});
store.on('error', (error) => { console.log(error) });

const url = require('url');
const path = require('path');
const fs = require("fs");
const { query } = require('express');
// setting middleware
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// declaring and initializing session and session properties
app.use(session({
    name : 'a4-session',
    secret: 'secret',
    store: store,
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 100000
    }
}));

// logs requests received
app.use(function(req,res,next){
    console.log(`${req.method} for ${req.url}`);
    next();
});

app.use(exposeSession); // middleware to expose current local session so it keeps track of the session in different instances
// all routes and route handlers
app.get('/register', (req,res) => res.render('register'));
app.get('/login', (req,res) => res.render('login'));
app.get('/logout', logout);
// home route handler
app.get(['/', '/home'], (req, res) => {
    res.status(200);
    res.render("home", {session:req.session.loggedin, id:req.session.userId});
});
// orderform route 
app.get('/order', (req,res) =>{
    res.status(200);
    res.render('order', {session:req.session.loggedin, id:req.session.userId});
});

app.route('orders')
.post((req,res)=>{

    // add req to database
    db.collection('orders').insertOne(orders, function(err, result){
        if(err){
            throw err;
        }
    });
    
    res.status(200);
    res.render('orderSummary', {orderDetails:req.info})
    
});

app.route('/orders/:orderID')
.get((req,res) =>{
    res.status(200);
    res.render('orderSummary');
});

// login route
app.route("/login")
.post((req, res) => {
    console.log(req.body);
    // filter for uname
    db.collection("users").find().toArray(function(err, results){ 
        console.log(results)
        let userFinder = false;
        // how to query usernames from db
        for (let i of results){
            console.log("if state");
            console.log(i.username);
            if (i.username === req.body.username && i.password === req.body.password){
                userFinder = true;
                req.session.loggedin = true;
                req.session.username = req.body.username;
                req.session.password = req.body.password;
                req.session.userId = i._id;
                res.locals.session = req.session;
                console.log("rs\n");
                console.log(req.session);
                console.log("logged in");
            }
        }
        if (userFinder){
            res.status(201);
	        res.json();
        }
        else{
            console.log("Unauthorized");
            res.sendStatus(401);
        }
        
     });
});

app.route("/register")
.post((req,res) => {
    console.log(req.body);

    db.collection("users").find().toArray(function(err, results){
        for (let i of results){
            if (i.username === req.body.username){
                console.log("duplicate username");
                res.status(400);
                res.send();
                return;
            }
        }
        let newUser = {"username":req.body.username, "password": req.body.password, "privacy":false};
        db.collection("users").insertOne(newUser, function(err, results){
            console.log("new user:\n"+ JSON.stringify(results));
            res.status(201);
            res.send(results.insertedId);
        });
        
    });
    
    db.collection("users").find().toArray(function(err, results){ 
        console.log(results)
    });
    
});


// get route for each users unique profile
app.route("/users/:userId")
.get((req, res,) => {
    let id = req.params.userId;
    db.collection("users").find().toArray(function(err, results){ 
        // match user with logged in user id/name&pass then send only results of that user as an object when rendering profile pug page
        for (let i of results){
            console.log(req.params.userId);
            if (i._id.toString() === req.params.userId){
                console.log("user found\n")
                res.status(200);
                res.render('profile', {id:i._id.toString(), session:req.session, user:i});
                return;
            }
            // check if private profile and return status 403/404 if not logged in as same user
            // if (i.session.privacy){

            // }
        }
    });
});

app.route("/users/:userId")
.put((req,res)=>{

})

app.route("/home")
.post((req, res) => {
    console.log(req.body);
    // filter for uname
    db.collection("users").find().toArray(function(err, results){ 
        console.log(results)
        // how to query usernames from db
        for (let i of results){
            if (i.username === req.body.username && i.password === req.body.password){
                req.session.loggedin = true;
                req.session.username = req.body.username;
                req.session.password = req.body.password;
                req.session.userId = results._id;
                res.locals.session = req.session;
                console.log("logged in!\n");
            }
            else{
                console.log("Unauthorized");
                return res.sendStatus(401);
            }
        }
        res.status(201);
	    res.json();
     });
});

app.route('/users')
.get((req,res) =>{
    db.collection("users").find().toArray(function(err, results){ 
        for (let i of results){
            i.id = i._id.toString();
        }
        res.status(200);
        res.render('users', {users: results, id:req.session.userId});
    });
})

// Order summary page
app.route('/orders/:orderID')
.get((req,res) =>{
    let id = req.params.orderID;
    res.render('order');
    
});

// exposes template engine with the session
function exposeSession(req,res,next){
    if (req.session) res.locals.session = req.session;
    next();
}

// helper function used for logout button functionality, this function destroys the current session
function logout(req,res){
    req.session.destroy();
    delete res.locals.session;
    res.status(200);
    res.send();
}


// Initialize database connection
MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  //Get the t8 database
  db = client.db('a4');

  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});