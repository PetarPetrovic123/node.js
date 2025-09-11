<template>
  <div class="wrapper">
    <div class="container">
      <h1>Create Post</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="form.title" type="text" placeholder="Title" required />
        <textarea v-model="form.content" placeholder="Content" required></textarea>
        <div class="buttons">
          <button type="submit" class="make-btn">Make</button>
          <button type="button" class="back-btn" @click="goBack">Go Back</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive,onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const form = reactive({
  title: "",
  content: ""
});

const handleSubmit = async() => {
  const res = await axios.post("/api/blog/NewPost",{
    title: form.title,
    content: form.content
  })
  // You can add your API call here
};

const goBack = () => {
  router.push("/home") // simple go back
};
</script>

<style scoped>
/* Center wrapper */
.wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

/* Form container */
.container {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;
}

/* Form elements */
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

input, textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Buttons layout */
.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

/* Make button */
.make-btn {
  background-color: #007bff;
  color: white;
}

.make-btn:hover {
  background-color: #0056b3;
}

/* Go back button */
.back-btn {
  background-color: #6c757d;
  color: white;
}

.back-btn:hover {
  background-color: #495057;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .container {
    padding: 20px;
  }

  .buttons {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
