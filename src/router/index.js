import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/auth/Login.vue"
import Signup from "../views/auth/Signup.vue"
import Create from "../views/booklist/Create.vue"
import ListDetails from "../views/booklist/ListDetails.vue"
import UserLists from "../views/booklist/UserLists.vue"

// route guard
import { auth } from "@/firebase/config"

const requireAuth = (to, from, next) => {
  let user = auth.currentUser
  if (!user) {
    next({ name: "Login" })
  } else next()
}


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/user/:uid",
    name: "userLists",
    component: UserLists,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: "/lists/:lid",
    name: "listDetails",
    component: ListDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
