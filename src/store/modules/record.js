import Vue from 'vue'
import ApiService from '@/common/api.service'
import {
  GET_RECORDS,
  GET_RECORD,
  CREATE_RECORD,
  UPDATE_RECORD,
  DELETE_RECORD,
  INIT_RECORD,
  GET_WEEKLY_REPORT,
  SET_FROM_DATE,
  SET_TO_DATE
} from '../actions'
import {
  SET_RECORDS,
  SET_RECORD,
  ADD_RECORD_IN_LIST,
  UPDATE_RECORD_IN_LIST,
  DELETE_RECORD_IN_LIST,
  SET_RECORD_ERROR,
  SET_RECORD_INIT,
  SET_REPORT,
  SET_FROM,
  SET_TO
} from '../mutations'
import _ from 'lodash'

const state = {
  errors: null,
  records: [],
  record: {},
  report: [],
  from: new Date().toISOString().substr(0, 10),
  to: new Date().toISOString().substr(0, 10)
}

const getters = {
  record: state => {
    return state.record
  },
  records: state => {
    return state.records
  },
  report: state => {
    return state.report
  },
  from: state => {
    return state.from
  },
  to: state => {
    return state.to
  }
}

const actions = {
  [GET_RECORDS](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`entry?from=${context.state.from}&to=${context.state.to}`)
        .then(({ data }) => {
          context.commit(SET_RECORDS, data)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [GET_RECORD](context, param) {
    return new Promise((resolve, reject) => {
      ApiService.get(`entry/${param}/`)
        .then(({ data }) => {
          context.commit(SET_RECORD, data)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [CREATE_RECORD](context, info) {
    return new Promise((resolve, reject) => {
      ApiService.post('entry/', info)
        .then(({ data }) => {
          context.commit(ADD_RECORD_IN_LIST, data)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [UPDATE_RECORD](context, info) {
    return new Promise((resolve, reject) => {
      ApiService.put(`entry/${info.id}/`, info)
        .then(({ data }) => {
          context.commit(UPDATE_RECORD_IN_LIST, data)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [DELETE_RECORD](context, param) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`entry/${param}`)
        .then(() => {
          context.commit(DELETE_RECORD_IN_LIST, param)
          resolve()
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [INIT_RECORD](context) {
    context.commit(SET_RECORD_INIT)
  },

  [GET_WEEKLY_REPORT](context) {
    return new Promise((resolve, reject) => {
      ApiService.get('weeklyReport')
        .then(({ data }) => {
          context.commit(SET_REPORT, data)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(
            SET_RECORD_ERROR,
            `${response.status} Error: ${response.statusText}`
          )
          reject()
        })
    })
  },

  [SET_FROM_DATE](context, data) {
    context.commit(SET_FROM, data)
  },

  [SET_TO_DATE](context, data) {
    context.commit(SET_TO, data)
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
  },

  [SET_REPORT](state, report) {
    state.report = report
  },

  [SET_FROM](state, from) {
    state.from = from
  },

  [SET_TO](state, to) {
    state.to = to
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
