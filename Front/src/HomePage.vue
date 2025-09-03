<template>
  <div class="dashboard">
    <header>
    <h1 class="welcome">Welcome, {{ user }}</h1>
    <div class="btn-group">
      <button @click="NewBlog" class="btn primary">Make a new blog</button>
      <button @click="LoggingOut" class="btn danger">Log out</button>
      <button @click="ChngPass" class="btn secondary">Change your password</button>
    </div>
    </header>
    <ul>
      <li v-for="user in users" :key="user.id" class="mb-2">
        <p>ID: {{ user.id }} </p>
        <p>Name: {{ user.name }}</p> 
        <input type="text" name="role"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref('');
const users = ref([]);
const csrfToken = ref("");

onMounted(async () => {
  try {
    const res = await axios.get("/api/home");
    user.value = res.data.users;

    const res2 = await axios.get("/api/csrf-token",{ withCredentials: true });
    csrfToken.value = res2.data.code;

    const res3 = await axios.get("/api/admin",{withCredentials:true});
    users.value = res3.data.users;
  } catch (e) {
    if (e.response.status === 411) {
      router.push("/login");
    }
  }
});

const NewBlog = () => {
  router.push("/NewBlog");
};

const LoggingOut = async () => {
  try {
    const res = await axios.post("/api/LogOut",{csrfT:csrfToken.value},{ withCredentials:true });
    if (res.status === 201) {
      router.push("/login");
    }else if(res.status === 400){
        res.json({message});
    }
  } catch (e) {
    console.log(e);
  }
};

const ChngPass = () => {
  router.push("/Pwd");
};
</script>

<style scoped>
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

