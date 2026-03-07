const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "22ndregiment",
 database: "mythosss"
})

db.connect(err => {
 if(err){
  console.log(err)
 } else{
  console.log("Connected to MySQL")
 }
})

app.post("/register",(req,res)=>{
 const {username,password}=req.body
 db.query(
  "INSERT INTO users (username,password) VALUES (?,?)",
  [username,password],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send("registered")
   }
  }
 )
})

app.post("/login",(req,res)=>{
 const {username,password}=req.body
 db.query(
  "SELECT * FROM users WHERE username=? AND password=?",
  [username,password],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send(result)
   }
  }
 )
})

app.post("/profile",(req,res)=>{
 const {username,name,bio}=req.body
 db.query(
  "INSERT INTO profiles (username,name,bio) VALUES (?,?,?)",
  [username,name,bio],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send("profile saved")
   }
  }
 )
})

app.get("/profile/:username",(req,res)=>{
 const username=req.params.username
 db.query(
  "SELECT * FROM profiles WHERE username=?",
  [username],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send(result)
   }
  }
 )
})

app.post("/favourite",(req,res)=>{
 const {username,title,poster,type}=req.body
 db.query(
  "INSERT INTO favourites (username,title,poster,type) VALUES (?,?,?,?)",
  [username,title,poster,type],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send("added")
   }
  }
 )
})

app.get("/favourites/:username",(req,res)=>{
 const username=req.params.username
 db.query(
  "SELECT * FROM favourites WHERE username=?",
  [username],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send(result)
   }
  }
 )
})

app.post("/follow",(req,res)=>{
 const {user,follower}=req.body
 db.query(
  "INSERT INTO followers (user,follower) VALUES (?,?)",
  [user,follower],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send("followed")
   }
  }
 )
})

app.get("/followers/:user",(req,res)=>{
 const user=req.params.user
 db.query(
  "SELECT * FROM followers WHERE user=?",
  [user],
  (err,result)=>{
   if(err){
    res.send(err)
   }else{
    res.send(result)
   }
  }
 )
})

app.listen(5000,()=>{
 console.log("Server running on port 5000")
})
