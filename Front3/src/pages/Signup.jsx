import { useState } from "react";
import axios from "axios";

function Signup() {
    const [form, SetForm] = useState({
        username:"",
        password:"",
        email:""
    })

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e)=>{
        SetForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        setErrorMessage("");

        try{
            const response = await axios.post("http://localhost:5000/auth/signup",{
                username:form.username,
                password:form.password,
                email:form.email
            })
            console.log("Account created!");
            window.location.href = "/login";
        }catch(error){
            console.log(error);
            setErrorMessage("Server error!");
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Sign Up</h2>

            <p style={{color:"red"}}>{errorMessage}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} required/>
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required/>
                </div>
                
                <div>
                    <label>Email:</label>
                    <input type="text" name="email" value={form.email} onChange={handleChange} required/>
                </div>

                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default Signup;