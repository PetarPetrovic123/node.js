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
            <div class="comments-section">
              <h3>Comments</h3>
              <ul class="comment-list">
                <li v-for="c in p.Comments" :key="c.id" class="comment-card">
                  <div class="comment-header">
                    <span class="comment-author">{{ c.Signup.name }}</span>
                  </div>
                  <div class="comment-body">{{ c.content }}</div>
                </li>
              </ul>

              <form class="comment-form" @submit.prevent="createComment">
                <input
                  v-model="content"
                  type="text"
                  class="comment-input"
                  placeholder="Write a comment..."
                />
                <button type="submit" class="comment-btn">Post</button>
              </form>
            </div>
</li>
</ul>
        
    </div>
</template>


<script setup>
    import { onMounted, ref,reactive } from 'vue';
    import axios from 'axios';
    import Header from "./Header.vue";
    import { useRouter, useRoute } from 'vue-router';
    import {io} from "socket.io-client";

    const socket = io(import.meta.env.VITE_SOCKET_URL2,{
        withCredentials:true
    });
    const posts = ref([]);
    const route = useRoute();
    const router = useRouter();
    const content = ref("");

    onMounted(async()=>{
        try{

            socket.on("comment",(data)=>{
              const id = route.query.id;
              if(parseInt(data.postId) === parseInt(id)){
                posts.value[0].Comments.push(data);
              }
            })
            const id = route.query.id;

            const res = await axios.get(`/api/blog/post/${id}`,{withCredentials:true});
            posts.value = [res.data.post];

            
        }catch(e){
            console.log(e);
        }
        
    })

    async function edit(user) {
        router.push({path:"/edit",query:{id:user.id}})
    }

    const createComment = async()=>{
      const id = route.query.id;
      try{
        await axios.post("/api/blog/createComment",{content:content.value,id:id},{withCredentials:true});
        content.value='';
      }catch(e){
        console.log("Nije sacuvan komentar!")
      }
    }

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

.comments-section {
  margin-top: 1.5rem;
  border-top: 1px solid #e3e3e3;
  padding-top: 1rem;
}

.comments-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.comment-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.8rem 1rem;
}

.comment-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.4rem;
}

.comment-author {
  color: #2563eb; /* blue highlight for names */
}

.comment-body {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.4;
}

.comment-form {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.2rem;
}

.comment-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
}

.comment-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.comment-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.comment-btn:hover {
  background-color: #1d4ed8;
}

</style>
