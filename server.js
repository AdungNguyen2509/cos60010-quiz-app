const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
//hashing library
const bcrypt = require("bcrypt")
const saltRounds = 10

const User = require("./model/User")

const PORT = process.env.PORT || 3000

//Connect to mongo atlas
mongoose.connect("mongodb+srv://adng2509:adung2509@cluster0.xi3nn.mongodb.net/UserDB?retryWrites=true&w=majority", { useNewUrlParser: true})


const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

//Api route
//Sign Up API
app.route("/")
.get((req ,res) => {
    res.sendFile(__dirname + "/index.html")
})

.post((req,res)=> {
    //Username and password data
    const username = req.body.username
    const password = req.body.password
    //hashing password function
    const hash = bcrypt.hashSync(password, saltRounds)
    //score to add from front end ?
    const score = req.body.score

    //New user is made and added to mongoDB
    const newUser = new User({
        username: username,
        //password is hash before adding to mongoDB
        password : hash,
        score: score,

    }) 
    newUser
    .save()
    .catch((err)=> console.log(err))
    //catch if user data isnt satisfied data model (model/User.js)
    console.log(newUser)

    if (res.statusCode === 200) {
        res.send("successfully added to database")
    }
    else {
        res.send("failed to added to database")
    }
})

//Login Api route
app.route("/login")
.get((req,res) => {
    res.sendFile(__dirname + "/login.html")
})

.post((req,res)=> {
    //Data from login
    const loginUsername = req.body.username
    const loginPassword = req.body.password
    const hash = bcrypt.hashSync(loginPassword, saltRounds)

    //Find username in MongoDB 
    User.findOne( {username: loginUsername}, function(err, foundUser) {
        if (err) {
            console.log(err)
        }
        else if (foundUser === null) {
            res.send("There is no user in database")
        }
        else {
            console.log(foundUser)
            //matching hashing password
            if (bcrypt.compareSync(loginPassword, foundUser.password))
            {
                res.send("Logged in")
            }
        }
    })


})

app.listen(PORT , (req,res)=> {
    console.log("server is running at port 3000")
})