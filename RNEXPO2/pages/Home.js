import { useEffect, useState } from "react";
import {View, Text, Button, FlatList} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function HomeScreen({navigation}){
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const init = async()=>{
            const token = await SecureStore.getItemAsync("jwt");
            setToken(token);
            
            if(!token){
                navigation.navigate("Login")
            }
            if(token){
                try{
                    const res = await axios.get("http://10.225.197.90:5000/blog/Posts",{
                        header:{authorization:`${token}`}
                    });
                    setItems(res.data.result);
                    console.log(token);
                }catch(e){
                    console.log(e);
                    setError("Server error!");
                }
            }
        }
        init();
    },[]);

    const handleLogOut = async()=>{
        await SecureStore.deleteItemAsync("jwt");
        navigation.navigate("Login");
    }
    return (
        <View>
            <Text>Home Screen</Text>
            <Text>{error}</Text>

            <FlatList data={items} keyExtractor={(item)=> item.id.toString()} renderItem={({item})=>(
                <View>
                    <Text>{item.username}</Text>
                    <Text>{item.content}</Text>
                    
                </View>
            )}/>
            <Button title="Log Out" onPress={handleLogOut}/>
        </View>
    )
}