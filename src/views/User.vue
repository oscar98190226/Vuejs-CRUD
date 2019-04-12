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
        <v-toolbar-title>User Table</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="handleAdd"> Add User </v-btn>
      </v-toolbar>
      <div v-if="!!users.length && !isLoading">
        <v-data-table :headers="headers" :items="users" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.profile.role }}</td>
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
      </div>
      <div v-else-if="isLoading"><h3>Loading...</h3></div>
      <div v-else><h3>No available data</h3></div>
    </div>

    <v-layout>
      <v-dialog v-model="dialog" max-width="350">
        <v-card>
          <v-card-title class="headline"> {{ `${method} User` }} </v-card-title>

          <v-card-text>
            <form v-on:submit.prevent="handleSubmit">
              <fieldset class="form-group col-md-12">
                <label>User Name:</label>
                <input
                  class="form-control form-control-md"
                  type="text"
                  v-model="user.username"
                  placeholder="User Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group col-md-12">
                <label>Email:</label>
                <input
                  class="form-control form-control-md"
                  type="email"
                  v-model="user.email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group col-md-12">
                <label>Password:</label>
                <input
                  class="form-control form-control-md"
                  type="password"
                  v-model="user.password"
                  placeholder="Password"
                />
              </fieldset>
              <fieldset class="form-group col-md-12">
                <label>Role:</label>
                <select v-model="user.profile.role">
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
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
import { mapGetters, mapState } from 'vuex'
import {
  GET_USERS,
  DELETE_USER,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  INIT_USER
} from '@/store/actions'

export default {
  name: 'User',
  data: function() {
    return {
      headers: [
        { text: 'UserName', value: 'username' },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Role', value: 'role' },
        { text: '#', value: 'update', sortable: false },
        { text: '', value: 'delete', sortable: false }
      ],
      isLoading: true,
      //Optional Flag
      dialog: false,

      method: ''
    }
  },
  created() {
    this.$store
      .dispatch(GET_USERS)
      .then(() => {
        this.isLoading = false
      })
      .catch(() => this.alertError())
  },
  computed: {
    ...mapGetters(['users', 'user']),
    ...mapState({
      errors: state => state.user.errors
    })
  },
  methods: {
    handleDelete: function(id) {
      if (window.confirm('Are you sure to delete this user?')) {
        this.$store.dispatch(DELETE_USER, id).then(() => {
          this.alertSuccess('Delete Success!')
        })
      }
    },

    handleUpdate: function(id) {
      this.method = 'Update'
      this.$store
        .dispatch(GET_USER, id)
        .then(() => {
          this.dialog = true
        })
        .catch(() => this.alertError())
    },

    handleAdd: function() {
      this.method = 'Add'
      this.$store.dispatch(INIT_USER).then(() => {
        this.dialog = true
      })
    },

    handleSubmit: function() {
      if (this.method === 'Update') {
        this.$store
          .dispatch(UPDATE_USER, this.user)
          .then(() => {
            this.dialog = false
            this.alertSuccess('Update Success!')
          })
          .catch(() => this.alertError())
      } else if (this.method === 'Add') {
        this.$store
          .dispatch(CREATE_USER, this.user)
          .then(() => {
            this.dialog = false
            this.alertSuccess('Add Success!')
          })
          .catch(() => this.alertError())
      }
    },

    alertSuccess: function(text) {
      this.$notify({
        group: 'alert',
        type: 'success',
        title: 'Success!',
        text
      })
    },

    alertError: function() {
      this.$$notify({
        group: 'alert',
        type: 'error',
        title: 'Error!',
        text: this.errors
      })
    }
  }
}
</script>
