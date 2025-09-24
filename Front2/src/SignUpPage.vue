

<template>
 <div class="container">
  <h1>Sign Up</h1>
  <form @submit.prevent = "handleSignup">
    <input v-model="form.username" type="text" placeholder="Username"/>
    <input v-model="form.password" type="password" placeholder="Password"/>
    <input v-model="form.email" type="text" placeholder="Email"/>
    <button type="submit">Sign Up</button>
    <p>If you already have an account<router-link to="/login">Log In</router-link></p>
  </form>
 </div>
<Modal v-if="modals.invalidPassword" @close="modals.invalidPassword = false">
    <p>Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long.</p>
</Modal>

<Modal v-if="modals.invalidUsername" @close="modals.invalidUsername=false">
    <p>Username is already in use.</p>
</Modal>
 
</template>
<script setup>
import {reactive} from "vue";
import Modal from './Modal.vue'; // simple modal component
import axios from "axios";
import { useRouter } from "vue-router";


const router = useRouter();
const form = reactive({
  username:"",
  password:"",
  email:""
})

const modals = reactive({
  invalidUsername:false,
  invalidPassword:false
})

const isStrongPassword = (pwd)=>{
  return pwd.length >=8 && 
          /[A-Z]/.test(pwd) &&
          /[a-z]/.test(pwd) &&
          /[0-9]/.test(pwd)
}

const handleSignup = async()=>{
  if(!isStrongPassword(form.password)){
    modals.invalidPassword = true
  }

  try{
    const res = await axios.post("/api/auth/signup", {
        username: form.username,
        password: form.password,
        email: form.email
    })
    if (res.status === 200 || res.status === 201) {
      router.push("/login")  // Navigate to login page
    }
  }catch(e){
    console.log(e);
    if(e.status === 409){
      modals.invalidUsername = true

    }
  }
}



</script>
<style scoped>
.container {
  background-color: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
  width: 300px;
  margin: 50px auto;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.login-link {
  margin-top: 15px;
  font-size: 14px;
}
</style>
