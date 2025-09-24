<template>
  <div class="container">
    <h1>Log In</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="form.username" type="text" placeholder="Username"/>
      <input v-model="form.password" type="password" placeholder="Password"/>
      <button type="submit">Log In</button>
    </form>

    <p class="signup-link">
      Don't have an account? <router-link to="/">Sign Up</router-link>
    </p>
    <modal v-if="modals.noUsername" @close="modals.noUsername = false">
        <p>Wrong password or username!</p>
    </modal>
    <modal v-if="modals.limit" @close="modals.limit = false">
        <p>You entered the wrong inputs too many times.</p>
    </modal>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import Modal from './Modal.vue';
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();



const form = reactive({
    username :'',
    password:''
})
const modals = reactive({
    noUsername:false,
    noPassword:false,
    limit:false
})

const handleLogin =  async()=>{
    try{
        const res = await axios.post("/api/auth/login",{
            username:form.username,
            password:form.password,
        },{withCredentials: true})
        if(res.status === 200){
            router.push("/home");
        }
        if(res.status === 205){
          router.push("/admin");
        }
    }catch(e){
        if(e.response.status === 401){
            modals.noUsername = true
        }else if(e.response.status === 429){
          modals.limit = true
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
