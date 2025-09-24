<template>
        <header>
            <h1 class="welcome">Welcome, {{ users2 }}</h1>
            <div class="btn-group">
                <button @click="NewBlog" class="btn primary">Make a new blog</button>
                <button @click="LoggingOut" class="btn danger">Log out</button>
                <button @click="ChngPass" class="btn secondary">Change your password</button>
                <button @click="Account" class="btn secondary">Account</button>
            </div>
        </header>
        <modal v-if="modals.log" @click="modals.log= false">
            <p>You need to wait for 10 seconds after logging in in order to log out! There is {{ seconds }} second/s left!</p>
        </modal>
</template>

<script setup>
import axios from 'axios';
import { onMounted,ref,reactive } from 'vue';
import modal from "./Modal.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users2 = ref('');
const csrfToken = ref("");
const modals = reactive({
  log:false
})
const seconds = ref("");
const users = ref([]);

onMounted(async()=>{
    try{
        const res = await axios.get("/api/auth/home",{ withCredentials: true });
        users2.value = res.data.user.name;

        const res2 = await axios.get("/api/auth/csrf-token",{ withCredentials: true });
        csrfToken.value = res2.data.code;

        try {
        const res3 = await axios.get("/api/admin/users",{withCredentials:true});
        users.value = res3.data.users;
        } catch (e) {

        if (e.response?.status === 403) {
            console.log("Not an admin → skipping user list");
        }
        }
    }catch(e){
        console.error("Header fetch failed:", err);
    }
    
})

const NewBlog = () => {
  router.push("/NewPost");
};

const LoggingOut = async () => {
  try {
    const res = await axios.post("/api/auth/LogOut",{csrfT:csrfToken.value},{ withCredentials:true });
    if (res.status === 200) {
      router.push("/login");
    }
  } catch (e) {
    if(e.response.status === 403){
      seconds.value = e.response.data.secLeft;
      modals.log = true
    }
    console.log(e);
  }
};

const ChngPass = () => {
  router.push("/Pwd");
};

const Account = ()=>{
  router.push("/account");
}



</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;   /* only inner padding */
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e5e7eb;
  margin: 0;   /* no outer margin */
}

/* Welcome text */
.welcome {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0;   /* remove default h1 margin */
}

/* Button group aligned horizontally */
.btn-group {
  display: flex;
  gap: 1rem;
  margin: 0;   /* no extra space */
}

.btn {
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
}

.btn.primary {
  background-color: #3b82f6;
  color: white;
}
.btn.primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn.secondary {
  background-color: #10b981;
  color: white;
}
.btn.secondary:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.btn.danger {
  background-color: #ef4444;
  color: white;
}
.btn.danger:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
}
</style>