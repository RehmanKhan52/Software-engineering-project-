import {useState} from "react"

function App(){

const [user,setUser]=useState(null)
const [username,setUsername]=useState("")
const [password,setPassword]=useState("")

const [tab,setTab]=useState("search")

const [query,setQuery]=useState("")
const [type,setType]=useState("tv")

const [results,setResults]=useState([])
const [favs,setFavs]=useState([])
const [users,setUsers]=useState([])
const [following,setFollowing]=useState([])
const [recommended,setRecommended]=useState([])

const [viewUser,setViewUser]=useState(null)
const [viewFavs,setViewFavs]=useState([])

function register(){

fetch("http://localhost:5000/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})

}

function login(){

fetch("http://localhost:5000/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})
.then(res=>res.json())
.then(data=>{
if(data.length>0){
setUser(username)
loadFavs(username)
}
})

}

function loadFavs(u){

fetch("http://localhost:5000/favourites/"+u)
.then(res=>res.json())
.then(data=>setFavs(data))

}

function loadUsers(){

fetch("http://localhost:5000/users")
.then(res=>res.json())
.then(data=>setUsers(data.filter(u=>u!==user)))

}

function loadRecommendations(){

fetch("http://localhost:5000/recommendations/"+user)
.then(res=>res.json())
.then(data=>setRecommended(data))

}

function openProfile(u){

setViewUser(u)

fetch("http://localhost:5000/favourites/"+u)
.then(res=>res.json())
.then(data=>{
setViewFavs(data)
setTab("profile")
})

}

function addFav(item){

fetch("http://localhost:5000/favourite",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
username:user,
title:item.title,
poster:item.poster,
type:item.type
})
}).then(()=>loadFavs(user))

}

function follow(target){

fetch("http://localhost:5000/follow",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({follower:user,target})
})

setFollowing(prev=>{
if(prev.includes(target)) return prev
return [...prev,target]
})

}

function search(){

if(type==="tv"){

fetch("https://api.tvmaze.com/search/shows?q="+query)
.then(res=>res.json())
.then(data=>{

const formatted=data.map(x=>({
title:x.show.name,
poster:x.show.image?x.show.image.medium:"",
type:"tv"
}))

setResults(formatted)

})

}

if(type==="music"){

fetch("https://itunes.apple.com/search?term="+query+"&media=music")
.then(res=>res.json())
.then(data=>{

const formatted=data.results.map(x=>({
title:x.trackName,
poster:x.artworkUrl100,
type:"music"
}))

setResults(formatted)

})

}

}

return(

<div className="app">

{!user &&(

<div className="auth">

<h2>Login</h2>

<input
placeholder="username"
value={username}
onChange={e=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<button onClick={register}>Register</button>
<button onClick={login}>Login</button>

</div>

)}

{user &&(

<div>

<div className="nav">

<button onClick={()=>setTab("search")}>
Search
</button>

<button onClick={()=>{
setTab("account")
loadFavs(user)
}}>
Account
</button>

<button onClick={()=>{
setTab("users")
loadUsers()
}}>
All Users
</button>

<button onClick={()=>setTab("following")}>
Following
</button>

<button onClick={()=>{
setTab("recommend")
loadRecommendations()
}}>
Recommendations
</button>

</div>

{tab==="search" &&(

<div>

<select value={type} onChange={e=>setType(e.target.value)}>
<option value="tv">Movies / TV Shows</option>
<option value="music">Music</option>
</select>

<input
value={query}
onChange={e=>setQuery(e.target.value)}
placeholder="search"
/>

<button onClick={search}>
Search
</button>

<div className="results">

{results.map((r,i)=>(

<div key={i} className="card">

{r.poster && <img src={r.poster} alt=""/>}

<h4>{r.title}</h4>

<button onClick={()=>addFav(r)}>
Add Favourite
</button>

</div>

))}

</div>

</div>

)}

{tab==="account" &&(

<div>

<h2>Your Favourites</h2>

<div className="results">

{favs.map((f,i)=>(

<div key={i} className="card">

{f.poster && <img src={f.poster} alt=""/>}

<h4>{f.title}</h4>

</div>

))}

</div>

</div>

)}

{tab==="users" &&(

<div>

<h2>All Users</h2>

{users.map((u,i)=>(

<div key={i} className="userRow">

<span
className="userName"
onClick={()=>openProfile(u)}
>
{u}
</span>

<button onClick={()=>follow(u)}>
Follow
</button>

</div>

))}

</div>

)}

{tab==="following" &&(

<div>

<h2>Following</h2>

{following.map((u,i)=>(
<p key={i}>{u}</p>
))}

</div>

)}

{tab==="recommend" &&(

<div>

<h2>Recommended Users</h2>

{recommended.length===0 && <p>No recommendations yet</p>}

{recommended.map((u,i)=>(

<div key={i} className="userRow">

<span
className="userName"
onClick={()=>openProfile(u)}
>
{u}
</span>

<button onClick={()=>follow(u)}>
Follow
</button>

</div>

))}

</div>

)}

{tab==="profile" &&(

<div>

<h2>{viewUser}'s Favourites</h2>

<div className="results">

{viewFavs.map((f,i)=>(

<div key={i} className="card">

{f.poster && <img src={f.poster} alt=""/>}

<h4>{f.title}</h4>

</div>

))}

</div>

</div>

)}

</div>

)}

</div>

)

}

export default App
