import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import Home from "./pages/Home";
import Account from "./pages/Account";




export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="LogIn" component={LogIn}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Account" component={Account}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}