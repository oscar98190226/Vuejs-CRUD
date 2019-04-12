<template>
  <div>
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font">Welcome to Jogging Track</h1>
          <p>A place to save your records</p>
        </div>
      </div>
    </div>

    <div>
      <v-toolbar flat color="white">
        <v-toolbar-title>Record Table</v-toolbar-title>
        <div class="ml30">
          <v-menu
            v-model="fromPicker"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="200px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="from"
                label="From:"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="from"
              @input="fromPicker = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div class="ml30">
          <v-menu
            v-model="toPicker"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="200px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="to"
                label="To:"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="to"
              @input="toPicker = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="handleAdd"> Add Record </v-btn>
      </v-toolbar>
      <div v-if="!!records.length && !isLoading">
        <v-data-table
          :headers="headers"
          :items="records"
          hide-actions
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.user.username }}</td>
            <td>{{ props.item.date }}</td>
            <td>{{ props.item.distance }}</td>
            <td>{{ props.item.duration }}</td>
            <td>
              {{ fixedPrecision(props.item.distance / props.item.duration) }}
            </td>
            <td>
              <v-btn
                color="primary"
                small
                dark
                @click="handleUpdate(props.item.id)"
                >Update</v-btn
              >
            </td>
            <td>
              <v-btn color="error" small @click="handleDelete(props.item.id)"
                >Delete</v-btn
              >
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
          ></v-pagination>
        </div>
      </div>
      <div v-else-if="isLoading"><h3>Loading...</h3></div>
      <div v-else><h3>No available data</h3></div>
    </div>

    <v-layout>
      <v-dialog v-model="dialog" max-width="350">
        <v-card>
          <v-card-title class="headline">
            {{ `${method} Record` }}
          </v-card-title>

          <v-card-text>
            <form v-on:submit.prevent="handleSubmit">
              <fieldset class="form-group col-md-12">
                <label>Date:</label>
                <input
                  class="form-control form-control-md"
                  type="date"
                  v-model="record.date"
                />
              </fieldset>
              <fieldset class="form-group col-md-12">
                <label>Distance:</label>
                <input
                  class="form-control form-control-md"
                  type="number"
                  v-model="record.distance"
                  placeholder="Distance"
                />
              </fieldset>
              <fieldset class="form-group col-md-12">
                <label>Duration:</label>
                <input
                  class="form-control form-control-md"
                  type="number"
                  v-model="record.duration"
                  placeholder="Distance"
                />
              </fieldset>

              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click="dialog = false">
                Discard
              </v-btn>
              <v-btn color="primary pull-xs-right" type="submit">{{
                method
              }}</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GET_RECORDS,
  DELETE_RECORD,
  GET_RECORD,
  UPDATE_RECORD,
  CREATE_RECORD,
  INIT_RECORD,
  SET_FROM_DATE,
  SET_TO_DATE
} from '@/store/actions'
import _ from 'lodash'

export default {
  name: 'Record',
  data: function() {
    return {
      // Data Table Info
      pagination: {},
      headers: [
        { text: 'User', value: 'user' },
        { text: 'Date', value: 'date' },
        { text: 'Distance (metre)', value: 'distance' },
        { text: 'Duration (second)', value: 'duration' },
        { text: 'Avg Speed (m/s)', value: 'avg_speed' },
        { text: '#', value: 'update', sortable: false },
        { text: '', value: 'delete', sortable: false }
      ],
      isLoading: true,
      // Optional Flag
      dialog: false,
      fromPicker: false,
      toPicker: false,

      method: ''
    }
  },

  created() {
    this.$store.dispatch(GET_RECORDS).then(() => {
      this.isLoading = false
    })
  },

  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    from: {
      get: function() {
        return this.$store.getters.from
      },
      set: function(value) {
        this.$store.dispatch(SET_FROM_DATE, value).then(() => {
          this.isLoading = true
          this.$store.dispatch(GET_RECORDS).then(() => {
            this.isLoading = false
          })
        })
      }
    },
    to: {
      get: function() {
        return this.$store.getters.to
      },
      set: function(value) {
        this.$store.dispatch(SET_TO_DATE, value).then(() => {
          this.isLoading = true
          this.$store.dispatch(GET_RECORDS).then(() => {
            this.isLoading = false
          })
        })
      }
    },
    ...mapGetters(['records', 'record', 'currentUser'])
  },

  methods: {
    handleDelete: function(id) {
      if (window.confirm('Are you sure to delete this user?')) {
        this.method = 'Delete'
        this.$store.dispatch(DELETE_RECORD, id).then(() => {})
      }
    },

    handleUpdate: function(id) {
      this.method = 'Update'
      this.$store.dispatch(GET_RECORD, id).then(() => {
        this.dialog = true
      })
    },

    handleAdd: function() {
      this.method = 'Add'
      this.$store.dispatch(INIT_RECORD).then(() => {
        this.dialog = true
      })
    },

    handleSubmit: function() {
      if (this.method === 'Update') {
        let req_data = {
          ..._.omit(this.record, ['user']),
          user_id: this.currentUser.id
        }

        this.$store.dispatch(UPDATE_RECORD, req_data).then(() => {
          this.dialog = false
        })
      } else if (this.method === 'Add') {
        this.$store
          .dispatch(CREATE_RECORD, {
            ...this.record,
            user_id: this.currentUser.id
          })
          .then(() => {
            this.dialog = false
          })
      }
    },

    fixedPrecision: function(input) {
      return Math.round(input * 1000) / 1000
    }
  }
}
</script>

<style scoped>
[type='number'] {
  width: 100% !important;
}
.ml30 {
  margin-left: 30px;
}
</style>
