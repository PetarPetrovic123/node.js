import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);
    const [error, seterror] = useState("");

    useEffect(()=>{
        const fetchPosts = async()=>{
            try{
                const response = await axios.get("http://localhost:5000/blog/MyPosts",{ withCredentials: true });
                setPosts(response.data.result);
            }catch(e){
                console.log(e);
                seterror("Server error!")
            }
        }
        fetchPosts();
    },[]);

    const LogOut = async()=>{
        try{
            await axios.post("http://localhost:5000/auth/LogOut",{},{withCredentials:true});
            window.location.href = "/login";
        }catch(e){
            console.log(e);
        }
        
    }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
        <p>{error}</p>
      <ul>
        {posts.map((post) => (
            <li key={post.id}>
                <h3>{post.id}</h3>
                <h3>{post.content}</h3>
            </li>
        ))}
      </ul>
      <button onClick={LogOut}>Log Out</button>
    </div>
  );
}

export default Home;
