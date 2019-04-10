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
        <v-spacer></v-spacer>
        <v-btn color="primary" dark> Add Record </v-btn>
      </v-toolbar>
      <div v-if="!!records.length && !isLoading">
        <v-data-table
          :headers="headers"
          :items="records"
          :search="search"
          hide-actions
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.date }}</td>
            <td>{{ props.item.distance }}</td>
            <td>{{ props.item.duration }}</td>
            <td>
              {{ fixedPrecision(props.item.distance / props.item.duration) }}
            </td>
            <td>
              <router-link
                :to="{ name: 'entry-detail', params: { id: props.item.id } }"
                >Update</router-link
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
    <v-snackbar v-model="showSnackBar" color="success" :timeout="1000">
      Delete Success!
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_RECORDS, DELETE_RECORD } from '@/store/actions'

export default {
  name: 'Record',
  data: function() {
    return {
      search: '',
      pagination: {},
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Distance (m)', value: 'distance' },
        { text: 'Duration (min)', value: 'duration' },
        { text: 'Avg Speed (m/min)', value: 'avg_speed' },
        { text: '#', value: 'update', sortable: false },
        { text: '', value: 'delete', sortable: false }
      ],
      isLoading: true,
      showSnackBar: false
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
    ...mapGetters(['records'])
  },
  methods: {
    handleDelete: function(id) {
      if (window.confirm('Are you sure to delete this user?')) {
        this.$store.dispatch(DELETE_RECORD, id).then(() => {
          this.showSnackBar = true
        })
      }
    },
    fixedPrecision: function(input) {
      return Math.round(input * 1000) / 1000
    }
  }
}
</script>