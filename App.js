import { useState } from "react"

function App(){

const [user,setUser]=useState(null)

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")

const [tab,setTab]=useState("search")

const [query,setQuery]=useState("")
const [type,setType]=useState("movie")
const [results,setResults]=useState([])

const [favs,setFavs]=useState([])

const [name,setName]=useState("")
const [bio,setBio]=useState("")

function validatePassword(pw){

const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/

return regex.test(pw)

}

function register(){

if(!validatePassword(password)){
alert("Password must be at least 6 characters and include a number and special character")
return
}

fetch("http://localhost:5000/register",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({username,password})
})
.then(res=>res.text())
.then(()=>{
alert("Registered")
})

}

function login(){

fetch("http://localhost:5000/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({username,password})
})
.then(res=>res.json())
.then(data=>{
if(data.length>0){
setUser(username)
loadFavs(username)
}else{
alert("Invalid login")
}
})

}

function loadFavs(u){

fetch("http://localhost:5000/favourites/"+u)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setFavs(data)
}else{
setFavs([])
}
})

}

function saveProfile(){

fetch("http://localhost:5000/profile",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
username:user,
name,
bio
})
})

}

function addFav(title,poster,type){

fetch("http://localhost:5000/favourite",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
username:user,
title,
poster,
type
})
})
.then(()=>loadFavs(user))

}

function search(){

if(type==="music"){

fetch("https://itunes.apple.com/search?term="+query+"&entity=song")
.then(res=>res.json())
.then(data=>{

const formatted=data.results.map(item=>({
title:item.trackName,
poster:item.artworkUrl100,
type:"music"
}))

setResults(formatted)

})

}else{

fetch("https://api.tvmaze.com/search/shows?q="+query)
.then(res=>res.json())
.then(data=>{

const formatted=data.map(item=>({
title:item.show.name,
poster:item.show.image ? item.show.image.medium : "",
type:type
}))

setResults(formatted)

})

}

}

return(

<div className="app">

{user &&

<div className="nav">

<button onClick={()=>setTab("search")}>Search</button>
<button onClick={()=>setTab("account")}>Account</button>

</div>

}

{!user &&

<div className="auth">

<h2>Login / Register</h2>

<input
placeholder="Username"
value={username}
onChange={e=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<button onClick={register}>Register</button>
<button onClick={login}>Login</button>

</div>

}

{user && tab==="search" &&

<div>

<h2>Search</h2>

<select onChange={e=>setType(e.target.value)}>

<option value="movie">Movies</option>
<option value="tv">TV</option>
<option value="music">Music</option>

</select>

<input
placeholder="Search"
value={query}
onChange={e=>setQuery(e.target.value)}
/>

<button onClick={search}>Search</button>

<div className="results">

{results.map((r,i)=>(

<div key={i} className="card">

{r.poster && <img src={r.poster} alt="" />}

<h4>{r.title}</h4>

<button onClick={()=>addFav(r.title,r.poster,r.type)}>
Add to favourites
</button>

</div>

))}

</div>

</div>

}

{user && tab==="account" &&

<div>

<h2>Profile</h2>

<input
placeholder="Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<textarea
placeholder="Bio"
value={bio}
onChange={e=>setBio(e.target.value)}
/>

<button onClick={saveProfile}>Save Profile</button>

<h3>Favourites</h3>

<div className="results">

{favs.map((f,i)=>(

<div key={i} className="card">

{f.poster && <img src={f.poster} alt="" />}

<h4>{f.title}</h4>
<p>{f.type}</p>

</div>

))}

</div>

</div>

}

</div>

)

}

export default App
