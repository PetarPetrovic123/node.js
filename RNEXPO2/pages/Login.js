import { useState } from "react";
import {View, Text, Button, TextInput} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function LogIn({navigation}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async()=>{
        try{
            const res = await axios.post("http://10.225.197.90:5000/auth/login",{
                username,
                password
            })

            const token = res.data.token;
            await SecureStore.setItemAsync("jwt", token);

            console.log("Logging in successfull!");
            navigation.navigate("Home");
        }catch(e){
            console.log(e);
            setError("Server error!");
        }
    }
    return (
        <View>
            <Text>Log In</Text>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername}/>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword}/>
            <Button title="Log In" onPress={handleLogin}/>
            <Text>{error}</Text>
            <Button title="Go to Signup" onPress={()=>navigation.navigate("SignUp")}/>

        </View>
    )
}