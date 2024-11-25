// Import express, path, mongoose, the User model and dotenv
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const db_name = 'checkpoint_RestAPI';
const User = require("./models/User")
require("dotenv").config({path:path.resolve(__dirname,'./config/.env')})
const PORT = 3001;
//Create an express app
const app = express()
const uri = process.env.MONGO_URI;

//Use mongoose to connect to the database 
mongoose.connect(uri).then(()=>{
    console.log("Successfully conected to "+db_name+" database");
}).catch(error=>{
    console.error(error);
})

//Create users

// User.create(
//     [
//         {name:"Karim",email:"RimKa@gmail.com",phone:"780409038"},
//         {name:"Thierno Ba",email:"Thier2pac@gmail.com",phone:"709116742"}
//     ]
// ).then((users)=>{
//     users.forEach(user => {
//     console.log(user.name+" successfully added");
//     });
// }).catch(error=>{
//     console.log(error)
// })


//Middleware to parse the http requests
app.use(express.json());

//Function to return the list of users in my db
const usersList = async () => {
    try {
        let users = await User.find();
        return users;
    } catch (error) {
        console.log(error);
    }
}

//Function to add a user
const adduser = async (userData) => {
    try {
        const user = await User.create(userData)
        return user
    } catch (error) {
        console.log(error)
    }
}

//Function to find a user by his ID and delete it
const findAndDeleteUserByID = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id)
        return user;
    } catch (error) {
        return error;
    }
}

//Function to find a user by his ID and modify it
const modifyByID = async (id,userData) => {
    try {
        const user = User.findByIdAndUpdate(id,userData);
        return user;
    } catch (error) {
        return error;
    }
}

//Request to get all the users in the db and return them
app.get('/users',async (request, response)=>{
    const users = await usersList();
    response.send(users)
})

//Request to add a user with a body
app.post('/adduser',async (req,res) => {
    const userData = req.body;
    const user = await adduser(userData);
    if(user){
        res.send("User "+user.name+" created successfully")
    }else{
        res.send("Error")
    }
})


//Request to modify the user found by ID
app.put("/updateuser/:id",async (req,res) => {
    const userID = req.params.id;
    const userData = req.body;
    const user = await modifyByID(userID,userData);

    if(user){
        res.send("User successfully updated");
    }else{
        res.send("user not found");
    }
})

//Request to find a user by ID and delete it
app.delete('/deleteuser/:id',async (req, res) => {
    const userID = req.params.id;
    const user = await findAndDeleteUserByID(userID)
    if(user){
        res.send("User successfully deleted")
    }else{
        res.send("User not found")
    }
})

app.listen(3001)