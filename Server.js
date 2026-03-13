const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"password",
database:"mythosss"
})

db.connect(err=>{
if(err) console.log(err)
else console.log("MySQL connected")
})

app.post("/register",(req,res)=>{

const {username,password}=req.body

db.query(
"INSERT INTO users(username,password) VALUES(?,?)",
[username,password],
()=>res.send("ok")
)

})

app.post("/login",(req,res)=>{

const {username,password}=req.body

db.query(
"SELECT * FROM users WHERE username=? AND password=?",
[username,password],
(err,result)=>res.json(result)
)

})

app.get("/users",(req,res)=>{

db.query(
"SELECT username FROM users",
(err,result)=>res.json(result.map(r=>r.username))
)

})

app.post("/follow",(req,res)=>{

const {follower,target}=req.body

db.query(
"INSERT INTO follows(follower,target) VALUES(?,?)",
[follower,target],
()=>res.send("ok")
)

})

app.post("/favourite",(req,res)=>{

const {username,title,poster,type}=req.body

db.query(
"INSERT INTO favourites(username,title,poster,type) VALUES(?,?,?,?)",
[username,title,poster,type],
()=>res.send("ok")
)

})

app.get("/favourites/:username",(req,res)=>{

db.query(
"SELECT * FROM favourites WHERE username=?",
[req.params.username],
(err,result)=>res.json(result)
)

})

app.get("/recommendations/:username",(req,res)=>{

const user=req.params.username

const sql=`
SELECT DISTINCT f2.username
FROM favourites f1
JOIN favourites f2
ON f1.title=f2.title
WHERE f1.username=? 
AND f2.username!=?
`

db.query(sql,[user,user],(err,result)=>{

if(err) res.json([])
else res.json(result.map(r=>r.username))

})

})

app.listen(5000,()=>console.log("Server running"))
