import { useState } from "react";
import axios from "axios";

function Login() {
  const [Form, setForm] = useState({
    username:"",
    password:""
  });

  const [errorMessage, serErrorMessage] = useState("");

  const handleChange = (e)=>{
    setForm({...Form,[e.target.name]:e.target.value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
        const response = await axios.post("http://localhost:5000/auth/login",{
            username:Form.username,
            password:Form.password
        }, { withCredentials: true })
        console.log("Logged in successfully!");
        window.location.href = "/home";
    }catch(e){
        console.log(e);
        serErrorMessage("Server error!");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      <p style={{ color: "red" }}>{errorMessage}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: 20 }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
