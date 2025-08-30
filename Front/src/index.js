import { createRouter, createWebHistory } from "vue-router"
import Signup from "./SignUpPage.vue"
import Login from "./LoginPage.vue"
import Home from "./HomePage.vue"
import Blog from "./NewBlogPage.vue"
import Pwd from "./Pwd.vue"

const routes = [
  { path: "/", component: Signup },
  { path: "/login", component: Login },
  { path: "/home", component: Home},
  { path: "/NewPost", component: Blog},
  { path: "/Pwd", component: Pwd}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
