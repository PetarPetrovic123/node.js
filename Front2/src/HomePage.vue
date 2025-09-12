<template>
  <div class="dashboard">
    <header>
      <h1 class="welcome">Welcome, {{ users2 }}</h1>
      <div class="btn-group">
        <button @click="NewBlog" class="btn primary">Make a new blog</button>
        <button @click="LoggingOut" class="btn danger">Log out</button>
        <button @click="ChngPass" class="btn secondary">Change your password</button>
      </div>
    </header>
   <ul class="posts">
  <li v-for="p in posts" :key="p.id" class="post-card">
    <div class="post-header">{{ p.username }}</div>
    <div class="post-title">{{ p.title }}</div>
    <div class="post-content">{{ p.content }}</div>
    <div class="post-actions">
      <button class="btn edit" @click="edit(p)">Edit</button>
      <button class="btn delete">Delete</button>
    </div>
  </li>
</ul>
    <modal v-if="modals.log" @click="modals.log= false">
      <p>You need to wait for 10 seconds after logging in in order to log out! There is {{ seconds }} second/s left!</p>
    </modal>
    <ul>
      <li v-for="usr in users" :key="usr.id" class="mb-2">
        <p>ID: {{ usr.id }} </p>
        <p>Name: {{ usr.name }}</p> 

        <!-- Show role as plain text -->
        <p>Role: {{ usr.role }}</p> 

        <!-- Show opposite role as a button -->
        <button 
          v-if="usr.role === 'admin'" 
          @click="toggleRole(usr, 'user')" 
          class="btn secondary">
          Make User
        </button>
        <button 
          v-else 
          @click="toggleRole(usr, 'admin')" 
          class="btn primary">
          Make Admin
        </button>
      </li>
    </ul>
    <ul class="messages">
  <li v-if="users2 === 'admin'" v-for="msg in messages" :key="msg.text" class="msg-card">
    <div class="msg-header">{{ msg.username }}</div>
    <div class="msg-time">{{ msg.timestamp }}</div>
    <div class="msg-ip">IP: {{ msg.ipAddress }}</div>
    <div class="msg-status">{{ msg.status }}</div>
  </li>
</ul>

    
  </div>

  
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Modal from './Modal.vue';
import {io} from "socket.io-client";


const socket = io(import.meta.env.VITE_SOCKET_URL,{
  withCredentials:true
})

const posts = ref([]);
const messages = ref([]);
const router = useRouter();
const users2 = ref('');
const users = ref([]);
const csrfToken = ref("");
const modals = reactive({
  log:false
})
const seconds = ref("");
onMounted(async () => {
  try {
    
    socket.on("userStatusChange",(data)=>{
      messages.value.unshift(data);
    })
    socket.on("connect",()=>{
      console.log("✅ Connected to socket:");
    })
    
    const res = await axios.get("/api/auth/home",{ withCredentials: true });
    users2.value = res.data.user.name;
    messages.value = res.data.log;

    const res2 = await axios.get("/api/auth/csrf-token",{ withCredentials: true });
    csrfToken.value = res2.data.code;

    const res3 = await axios.get("/api/admin/users",{withCredentials:true});
    users.value = res3.data.users;

    const res4 = await axios.get("api/blog/Posts",{withCredentials:true});
    posts.value = res4.data.result;
  } catch (e) {
  if (e.response.status === 411) {
    router.push("/login");
  }
}
});

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

// Toggle role function
const toggleRole = async (usr, newRole) => {
  try {
    // Optimistically update UI
    usr.role = newRole;

    // Send to backend
    await axios.post(
      "/api/admin/update-role",
      { id: usr.id, role: newRole, csrfT: csrfToken.value },
      { withCredentials: true }
    );
  } catch (e) {
    console.error(e);
    alert("Failed to update role");
  }
};

async function edit(user) {
  router.push({path:"/edit",query:{id:user.id}})
}
</script>


<style scoped>

.messages {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.2rem;
}

.msg-card {
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.msg-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 16px rgba(0,0,0,0.1);
}

.msg-header {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.msg-time {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 0.6rem;
}

.msg-ip {
  font-size: 0.95rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 0.5rem;
}

.msg-status {
  font-size: 1rem;
  font-weight: 600;
  color: #2c6e49; /* greenish tone */
}


.posts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.2rem;
}

.post-card {
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 16px rgba(0,0,0,0.1);
}

.post-header {
  font-size: 0.9rem;
  font-weight: 500;
  color: #777;
  margin-bottom: 0.4rem;
}

.post-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.8rem;
}

.post-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 1.2rem;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.btn {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn.edit {
  background-color: #4caf50;
  color: white;
}

.btn.edit:hover {
  background-color: #43a047;
}

.btn.delete {
  background-color: #f44336;
  color: white;
}

.btn.delete:hover {
  background-color: #d32f2f;
}


.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;   /* remove any default margin */
  padding: 0;
}

/* Header container */
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

