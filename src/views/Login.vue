<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Log In</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'signup' }"> Create new? </router-link>
          </p>
          <form v-on:submit.prevent="onSubmit(username, password)">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="username"
                placeholder="username"
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
            <button class="btn btn-lg btn-primary pull-xs-right">Log in</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LOGIN } from '@/store/actions'

export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    onSubmit(username, password) {
      this.$store
        .dispatch(LOGIN, { username, password })
        .then(() => {
          this.$notify({
            group: 'alert',
            type: 'success',
            title: 'Success!',
            text: 'Login Success!'
          })
          this.$router.push({ name: 'home' })
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
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
}
</script>
