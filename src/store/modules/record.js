import Vue from 'vue'
import ApiService from '@/common/api.service'
import {
  GET_RECORDS,
  GET_RECORD,
  CREATE_RECORD,
  UPDATE_RECORD,
  DELETE_RECORD,
  INIT_RECORD
} from '../actions'
import {
  SET_RECORDS,
  SET_RECORD,
  ADD_RECORD_IN_LIST,
  UPDATE_RECORD_IN_LIST,
  DELETE_RECORD_IN_LIST,
  SET_RECORD_ERROR,
  SET_RECORD_INIT
} from '../mutations'
import _ from 'lodash'

const state = {
  errors: null,
  records: [],
  record: {}
}

const getters = {
  record: state => {
    return state.record
  },
  records: state => {
    return state.records
  }
}

const actions = {
  [GET_RECORDS](context) {
    ApiService.get('entry')
      .then(({ data }) => {
        context.commit(SET_RECORDS, data)
      })
      .catch(({ response }) => {
        context.commit(SET_RECORD_ERROR, response.data.errors)
      })
  },

  [GET_RECORD](context, param) {
    ApiService.get(`entry/${param}`)
      .then(({ data }) => context.commit(SET_RECORD, data))
      .catch(({ response }) =>
        context.commit(SET_RECORD_ERROR, response.data.errors)
      )
  },

  [CREATE_RECORD](context, info) {
    ApiService.post('entry/', { ...info })
      .then(({ data }) => {
        context.commit(ADD_RECORD_IN_LIST, data)
      })
      .catch(({ response }) =>
        context.commit(SET_RECORD_ERROR, response.data.errors)
      )
  },

  [UPDATE_RECORD](context, info) {
    ApiService.put(`entry/${info.id}/`, { ...info }).then(({ data }) => {
      context.commit(UPDATE_RECORD_IN_LIST, data)
    })
  },

  [DELETE_RECORD](context, param) {
    ApiService.delete(`entry/${param}`)
      .then(() => context.commit(DELETE_RECORD_IN_LIST, param))
      .catch(({ response }) =>
        context.commit(SET_RECORD_ERROR, response.data.errors)
      )
  },

  [INIT_RECORD](context) {
    context.commit(SET_RECORD_INIT)
  }
}

const mutations = {
  [SET_RECORDS](state, records) {
    state.records = records
  },

  [SET_RECORD](state, record) {
    state.record = Object.assign({}, record)
  },

  [ADD_RECORD_IN_LIST](state, record) {
    state.records.push(record)
  },

  [UPDATE_RECORD_IN_LIST](state, record) {
    let index = _.findIndex(state.records, { id: record.id })
    let tmpRecords = state.records
    tmpRecords[index] = record
    Vue.set(state, 'records', [...tmpRecords])
    state.record = Object.assign({}, record)
  },

  [DELETE_RECORD_IN_LIST](state, id) {
    let tmpRecords = state.records
    tmpRecords = _.reject(tmpRecords, { id })
    state.records = tmpRecords
  },

  [SET_RECORD_ERROR](state, error) {
    state.error = error
  },

  [SET_RECORD_INIT](state) {
    state.record = {}
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
