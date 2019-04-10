import ApiService from '@/common/api.service'
import {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
} from '../actions'
import {
  SET_USERS,
  SET_USER,
  ADD_USER_IN_LIST,
  UPDATE_USER_IN_LIST,
  DELETE_USER_IN_LIST,
  SET_USER_ERROR
} from '../mutations'
import _ from 'lodash'

const state = {
  errors: null,
  users: [],
  user: {}
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
    ApiService.get('user')
      .then(({ data }) => {
        context.commit(SET_USERS, data)
      })
      .catch(({ response }) => {
        context.commit(SET_USER_ERROR, response.data.errors)
      })
  },

  [GET_USER](context, param) {
    ApiService.get(`user/${param}`)
      .then(({ data }) => context.commit(SET_USER, data))
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [CREATE_USER](context, data) {
    ApiService.get('user', { body: data })
      .then(({ data }) => context.commit(ADD_USER_IN_LIST, data))
      .catch(({ response }) =>
        context.commit(SET_USER_ERROR, response.data.errors)
      )
  },

  [UPDATE_USER](context, param, data) {
    ApiService.update(`user/${param}`, { body: data })
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
  }
}

const mutations = {
  [SET_USERS](state, users) {
    state.users = users
  },

  [SET_USER](state, user) {
    state.user = user
  },

  [ADD_USER_IN_LIST](state, user) {
    state.users.push(user)
  },

  [UPDATE_USER_IN_LIST](state, user) {
    let index = _.findIndex(state.users, { id: user.id })
    state.users[index] = user
    state.user = user
  },

  [DELETE_USER_IN_LIST](state, id) {
    let tmpUsers = state.users
    tmpUsers = _.reject(tmpUsers, { id })
    state.users = tmpUsers
  },

  [SET_USER_ERROR](state, error) {
    state.error = error
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
