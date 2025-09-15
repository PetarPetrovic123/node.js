<template>
    <div class="dashboard">
        <Header/>

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
    </div>
</template>


<script setup>
    import { onMounted, ref,reactive } from 'vue';
    import axios from 'axios';
    import Header from "./Header.vue";
    
    const posts = ref([]);

    onMounted(async()=>{
        const res = await axios.get("/api/blog/MyPosts",{withCredentials:true});
        posts.value = res.data.result;
    })
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


</style>
