const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
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
    const username = req.body.username
    const password = req.body.password

    const newUser = new User({
        username: username,
        password : password
    }) 
    newUser
    .save()
    .catch((err)=> console.log(err))
    console.log(newUser)

    if (res.statusCode === 200) {
        res.send("successfully added to database")
    }
    else {
        res.send("failed to added to database")
    }
})

app.listen(PORT , (req,res)=> {
    console.log("server is running at port 3000")
})