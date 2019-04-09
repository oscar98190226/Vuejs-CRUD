import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '@/views/Login'
import SignupPage from '@/views/Signup'
import HomePage from '@/views/Home'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginPage, name: 'login' },
    { path: '/signup', component: SignupPage, name: 'signup' },
    { path: '/home', component: HomePage, name: 'home' }
  ]
});
