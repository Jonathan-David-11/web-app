
const express = require("express");
const app = express();
var passwordHash = require('password-hash');
app.use(express.static("public"));

app.set("view engine", "ejs");

const bodyParser = require('body-parser');  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }) )

const { initializeApp, cert} = require("firebase-admin/app");
 const { getFirestore } = require("firebase-admin/firestore"); 

var serviceAccount = require("./key.json");

initializeApp({

credential: cert (serviceAccount),

});

const db = getFirestore();
app.get("/", function (req, res) { 
    res.sendFile(__dirname + "/public"+"/home.html");

});
app.post("/signupSubmit",function(req,res){
    console.log(req.body);

    db.collection("demo")
    .where("email","==",req.body.email)
    .get()
    .then ((docs) => {
        if (docs.size > 0){
            res.send("This accout already exists");
        }
        else{
            db.collection("demo")
            .add({
                email:req.body.email,
                password:passwordHash.generate(req.body.password,)
            })
            .then(() =>{
                res.sendFile(__dirname + "/public"+"/login.html");
            })
            .catch(() =>
            {
                res.send("Problem");
            })
        }
    });


});

app.get("/loginSubmit",function(req,res){

    //passwordHash.verify(req.query.password, hashedPassword)

db.collection("demo")
    .where("email","==",req.query.email)
    .get()
    .then ((docs) => {
        var verified = false;
        docs.forEach(doc => {
            verified = passwordHash.verify(req.query.password,doc.data().password);
            
        });
        if (verified){
            res.sendFile(__dirname + "/public"+"/dashboard.html");
        }
        else{
            res.send("fail");
        }
        
        
            
        });
    });

app.listen("5500");