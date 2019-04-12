<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'login' }">
              Have an account?
            </router-link>
          </p>
          <form v-on:submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="username"
                placeholder="Username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                v-model="password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SIGNUP } from '@/store/actions'

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch(SIGNUP, {
          username: this.username,
          password: this.password,
          email: this.email
        })
        .then(() => {
          this.$notify({
            group: 'alert',
            type: 'success',
            title: 'Success!',
            text: 'Signup Success!'
          })
          this.$router.push({ name: 'login' })
        })
        .catch(() => {
          this.$notify({
            group: 'alert',
            type: 'error',
            title: 'Error!',
            text: this.errors
          })
        })
    }
  }
}
</script>
