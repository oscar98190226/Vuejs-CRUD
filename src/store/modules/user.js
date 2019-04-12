import Vue from 'vue'
import ApiService from '@/common/api.service'
import {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  INIT_USER
} from '../actions'
import {
  SET_USERS,
  SET_USER,
  ADD_USER_IN_LIST,
  UPDATE_USER_IN_LIST,
  DELETE_USER_IN_LIST,
  SET_USER_ERROR,
  SET_USER_INIT
} from '../mutations'
import _ from 'lodash'

const initialState = {
  errors: null,
  users: [],
  user: {
    id: '',
    username: '',
    email: '',
    password: '',
    profile: {
      role: ''
    }
  }
}

const state = {
  ...initialState
}

const getters = {
  user: state => {
    return state.user
  },
  users: state => {
    return state.users
  }
}

const actions = {
  [GET_USERS](context) {
    ApiService.get('user/')
      .then(({ data }) => {
        context.commit(SET_USERS, data)
      })
      .catch(({ response }) => {
        context.commit(SET_USER_ERROR, response.data.errors)
      })
  },

  [GET_USER](context, param) {
    ApiService.get(`user/${param}/`)
      .then(({ data }) => context.commit(SET_USER, data))
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [CREATE_USER](context, info) {
    ApiService.post('user/', info)
      .then(({ data }) => {
        context.commit(ADD_USER_IN_LIST, data)
      })
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [UPDATE_USER](context, info) {
    ApiService.put(`user/${info.id}/`, info)
      .then(({ data }) => context.commit(UPDATE_USER_IN_LIST, data))
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [DELETE_USER](context, param) {
    ApiService.delete(`user/${param}`)
      .then(() => context.commit(DELETE_USER_IN_LIST, param))
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [INIT_USER](context) {
    context.commit(SET_USER_INIT)
  }
}

const mutations = {
  [SET_USERS](state, users) {
    state.users = users
  },

  [SET_USER](state, user) {
    7
    state.user = Object.assign({}, user)
  },

  [ADD_USER_IN_LIST](state, user) {
    state.users.push(user)
  },

  [UPDATE_USER_IN_LIST](state, user) {
    let index = _.findIndex(state.users, { id: user.id })
    let tmpUsers = state.users
    tmpUsers[index] = user
    Vue.set(state, 'users', [...tmpUsers])
    state.user = Object.assign({}, user)
  },

  [DELETE_USER_IN_LIST](state, id) {
    let tmpUsers = state.users
    tmpUsers = _.reject(tmpUsers, { id })
    state.users = tmpUsers
  },

  [SET_USER_ERROR](state, error) {
    state.error = error
  },

  [SET_USER_INIT](state) {
    state.user = initialState.user
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
