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
        <v-toolbar-title>Weekly Report</v-toolbar-title>
      </v-toolbar>
      <div v-if="!!report.length && !isLoading">
        <v-data-table
          :headers="headers"
          :items="report"
          hide-actions
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ getStartDate(props.item.year, props.item.week) }}</td>
            <td>{{ getEndDate(props.item.year, props.item.week) }}</td>
            <td>{{ props.item.totalDistance }}</td>
            <td>{{ props.item.totalDuration }}</td>
            <td>
              {{
                fixedPrecision(
                  props.item.totalDistance / props.item.totalDuration
                )
              }}
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_WEEKLY_REPORT } from '@/store/actions'

export default {
  name: 'Report',

  data: function() {
    return {
      isLoading: true,
      headers: [
        { text: 'Start Date', value: 'start_date' },
        { text: 'End Date', value: 'end_date' },
        { text: 'Total Distance (metre)', value: 'total_distance' },
        { text: 'Total Duration (second)', value: 'total_duration' },
        { text: 'Avg Speed (m/s)', value: 'avg_speed' }
      ],
      pagination: {}
    }
  },

  created() {
    this.$store.dispatch(GET_WEEKLY_REPORT).then(() => {
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
    ...mapGetters(['report'])
  },

  methods: {
    fixedPrecision: function(input) {
      return Math.round(input * 1000) / 1000
    },

    getStartDate(year, week) {
      return new Date(year, 0, week * 7).toISOString().substr(0, 10)
    },

    getEndDate(year, week) {
      return new Date(year, 0, week * 7 + 6).toISOString().substr(0, 10)
    }
  }
}
</script>

<style></style>
