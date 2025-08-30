<style scoped>
/* Base layout */
body {
  font-family: "Inter", sans-serif;
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

/* Form container */
form {
  background: #fff;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 420px;
  margin: 10% auto;
}

/* Input fields */
form input {
  padding: 0.9rem 1.1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: all 0.25s ease;
}

form input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

/* Disabled input */
form input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Buttons */
form button {
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.25s ease, transform 0.15s ease;
}

/* Primary button (submit) */
form button[type="submit"] {
  background: #2563eb;
  color: white;
}

form button[type="submit"]:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

form button[type="submit"]:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* Secondary button */
form button[type="button"] {
  background: #f3f4f6;
  color: #374151;
}

form button[type="button"]:hover {
  background: #e5e7eb;
}

/* -------- Modal Styles -------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(31, 41, 55, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 360px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.modal p {
  font-size: 1.05rem;
  color: #374151;
  margin-bottom: 1rem;
}

/* Smooth modal animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      type="password"
      v-model="form.OPass"
      placeholder="Type in the old password"
      @input="debouncedValidate"
    />

    <input
      type="password"
      v-model="form.NPass"
      placeholder="New password"
      :disabled="!oldOk"
    />
    <input type="text" v-model = "form.Code" placeholder="Code" @input="debouncedValidate2" v-show="show.Code"/>
    <button type="submit" :disabled="!oldOk">Change password</button>
    <button type="button" @click="sendEmail">Send me the code through email</button>
    
  </form>
  

  <modal v-if="modals.chngPwd" @close="modals.chngPwd = false">
        <p>Successfully changed password!</p>
    </modal>
    <modal v-if="modals.NochngPwd" @close="modals.NochngPwd = false">
        <p>You have to input something!</p>
    </modal>
</template>

<script setup>
import axios from "axios";
import { reactive, ref } from "vue";
import Modal from './Modal.vue';


const form = reactive({ OPass: "", NPass: "", Code:"" });
const oldOk = ref(false);   // controls enabled state
const modals = reactive({
  chngPwd:false,
  NochngPwd:false
})

const show = reactive({
  Code:false
})

let timer = null;
const debouncedValidate = () => {
  clearTimeout(timer);
  if (!form.OPass) { 
    oldOk.value = false; 
    return;
  }
  timer = setTimeout(validateOld, 400); // wait 400ms after typing
};

let timer2 = null;
const debouncedValidate2 = () => {
  clearTimeout(timer2);
  if (!form.Code) { 
    oldOk.value = false; 
    return;
  }
  timer2 = setTimeout(validateOld2, 400); // wait 400ms after typing
};

async function validateOld() {
  try {
    const { data } = await axios.post(
      "/api/Pass",
      { oldPassword: form.OPass },
      { withCredentials: true }
    );
    oldOk.value = data.valid;
  } catch {
    oldOk.value = false;
  }
}

async function validateOld2() {
  try {
    const { data } = await axios.post(
      "/api/ChngPwdCode",
      { Code: form.Code },
      { withCredentials: true }
    );
    oldOk.value = data.valid;
  } catch {
    oldOk.value = false;
  }
}


async function handleSubmit() {
  try{
    const res = await axios.post("/api/ChPwd",{
    password: form.NPass
    })
    if(res.status === 201){
      modals.chngPwd = true
    }
  }catch(e){
    console.log(e);
    if(e.response?.status === 400){
      modals.NochngPwd = true
    }
  }
  
}

const sendEmail = async()=>{
  try{
    show.Code = true;
    const res = await axios.post("/api/Email",{ withCredentials: true });
  }catch(e){
    console.log(e);
    alert("Failed to send code!")
  }
}
</script>
