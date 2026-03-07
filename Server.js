const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")
const app=express()
app.use(cors())
app.use(express.json())

const db=mysql.createConnection({
host:"localhost",
user:"root",
password:"22ndregiment",
database:"mythosss"
})

db.connect(err=>{if(err)console.log(err);else console.log("Connected to MySQL")})

app.post("/register",(req,res)=>{
const {username,password}=req.body
db.query("INSERT INTO users(username,password) VALUES(?,?)",[username,password],(err,result)=>{
if(err)res.send("Error");else res.send("OK")
})
})

app.post("/login",(req,res)=>{
const {username,password}=req.body
db.query("SELECT * FROM users WHERE username=? AND password=?",[username,password],(err,result)=>{
if(err)res.send([]);else res.json(result)
})
})

app.get("/favourites/:username",(req,res)=>{
const u=req.params.username
db.query("SELECT * FROM favourites WHERE username=?",[u],(err,result)=>{if(err)res.json([]);else res.json(result)})
})

app.post("/favourite",(req,res)=>{
const {username,title,poster,type}=req.body
db.query("INSERT INTO favourites(username,title,poster,type) VALUES(?,?,?,?)",[username,title,poster,type],(err,result)=>{res.send("OK")})
})

app.post("/profile",(req,res)=>{
const {username,name,bio}=req.body
db.query("INSERT INTO profiles(username,name,bio) VALUES(?,?,?) ON DUPLICATE KEY UPDATE name=?,bio=?",[username,name,bio,name,bio],(err,result)=>res.send("OK"))
})

app.get("/followers/:username",(req,res)=>{
const u=req.params.username
db.query("SELECT follower FROM follows WHERE target=?",[u],(err,result)=>{if(err)res.json([]);else res.json(result.map(r=>r.follower))})
})

app.get("/following/:username",(req,res)=>{
const u=req.params.username
db.query("SELECT target FROM follows WHERE follower=?",[u],(err,result)=>{if(err)res.json([]);else res.json(result.map(r=>r.target))})
})

app.post("/follow",(req,res)=>{
const {follower,target}=req.body
db.query("INSERT INTO follows(follower,target) VALUES(?,?) ON DUPLICATE KEY UPDATE follower=follower",[follower,target],(err,result)=>res.send("OK"))
})

app.get("/recommendations/:username",(req,res)=>{
const u=req.params.username
db.query("SELECT DISTINCT f2.username FROM favourites f1 JOIN favourites f2 ON f1.title=f2.title AND f1.username<>f2.username WHERE f1.username=?",[u],(err,result)=>{if(err)res.json([]);else res.json(result.map(r=>r.username))})
})

app.listen(5000,()=>console.log("Server running on port 5000"))
