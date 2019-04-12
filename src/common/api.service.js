import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/jwt.service'
import { API_URL } from '@/common/config'

const ApiService = {
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = API_URL
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${JwtService.getToken()}`
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },

  get(resource) {
    return Vue.axios.get(`${resource}`).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },

  post(resource, data) {
    return Vue.axios.post(`${resource}`, data)
  },

  update(resource, param, data) {
    return Vue.axios.put(`${resource}/${param}`, data)
  },

  put(resource, data) {
    return Vue.axios.put(`${resource}`, data)
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  }
}

export default ApiService
