import { useState } from "react";
import {View, Text, Button, TextInput} from "react-native";
import axios from "axios";

export default function SignUp({navigation}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");


    const handleSignup = async()=>{
        try{
            await axios.post("http://10.225.197.90:5000/auth/signup",{
                username,
                password,
                email
            });
            console.log(`Signed up successfully!`);
            navigation.navigate("Login");
        }catch(e){
            console.log(e);
            setError("Server error!");
        }
    }
    return (
        <View>
            <Text>Sign Up</Text>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername}/>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword}/>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail}/>
            <Button title="Sign Up" onPress={handleSignup}/>
            <Text>{error}</Text>
            <Text>If you are already signed up, <Button title="Log In" onPress={()=>navigation.navigate("Login")}/></Text>
        </View>
    )
}