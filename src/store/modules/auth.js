import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
import {
    LOGIN, 
    SIGNUP, 
    LOGOUT,
    CHECK_AUTH
} from '../actions'
import { SET_AUTH, REMOVE_AUTH, SET_ERROR } from '../mutations'

const state = {
    errors: null, 
    user: {}, 
    isAuthenticated: !!JwtService.getToken()
}

const getters = {
    currentUser: (state) => {
      return state.user
    },
    isAuthenticated: (state) => {
      return state.isAuthenticated
    }
}

const actions = {
    [LOGIN](context, credentials) {
        return new Promise(resolve => {
            ApiService.post("auth/login/", { ...credentials })
                .then(({ data }) => {
                    context.commit(SET_AUTH, data)
                    resolve(data)
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors)
                })
        })
    },
    [LOGOUT](context) {
        context.commit(REMOVE_AUTH)
    },
    [SIGNUP](context, credentials) {
        ApiService.post("auth/signup/", { ...credentials })
            .catch(({ response }) => {
                context.commit(SET_ERROR, response.data.errors)
            })        
    },
    [CHECK_AUTH](context) {
      if (JwtService.getToken()) {
        ApiService.setHeader()
      } else {
        context.commit(REMOVE_AUTH)
      }
    },
}

const mutations = {
    [SET_AUTH](state, user) {
        state.isAuthenticated = true
        state.user = user
        state.errors = {}
        JwtService.saveToken(state.user.token)
    },
    [REMOVE_AUTH](state) {
        state.isAuthenticated = false
        state.user = {}
        state.errors = {}
        JwtService.destroyToken()
    },
    [SET_ERROR](state, error) {
        state.errors = error
    }
}

export default {
    state, 
    actions,
    mutations, 
    getters
}