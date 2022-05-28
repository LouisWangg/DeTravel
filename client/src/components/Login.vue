<template>
  <v-container>
    <v-row no-gutters>
      <v-col align="center">
        <div class="elevation-2 panel">
          <v-toolbar dense color="#C2FFD1">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <div class="mt-5 mb-2">
            <v-text-field label="Email" v-model="email"></v-text-field>
            <br />

            <v-text-field label="Password" type="password" v-model="password"></v-text-field>
            <br />
          </div>

          <div>
            <v-btn class="mb-4 mr-8" color="#49C179"
              @click="login" outlined rounded large>Masuk
            </v-btn>
            <v-btn class="mb-4 ml-8" color="#49C179"
              @click="registerDialog = true, error=null" outlined rounded large>Daftar
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="registerDialog" width="500">
      <v-card class="dialog">
        <v-card-title>Register</v-card-title>
        <v-card-text class="detailPlaceText">
          <v-text-field label="Nama" v-model="name" />
          <v-text-field label="Email" v-model="email" />
          <v-text-field label="Password" type="password" v-model="password" />
          
          <div class="error mt-3" v-html="error" />
          <br />
        </v-card-text>
        
        <v-card-actions>
          <v-btn @click="register" class="closeBtn mr-8" 
            color="green lighten-1" outlined rounded>Daftar</v-btn>
          <v-btn @click="registerDialog=false, error=null, email=null, name=null, password=null" 
            class="closeBtn" color="red lighten-1" outlined rounded>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="successSnackbar" :timeout="timeout">
      {{ success }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="successSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="errorSnackbar" :timeout="timeout">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="errorSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      valid: false,
      name: '',
      email: '',
      password: '',
      error: null,
      errorSnackbar: false,
      timeout: 2000,
      registerDialog: false,
      success: null,
      successSnackbar: false,
    }
  },
  methods: {
    async login () {
      try {
        this.error = null
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        
        if (response.data.user.name.toLowerCase().includes("admin")) {
          this.$router.push('admin')
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        this.error = error.response.data.error
        this.errorSnackbar = true
      }
    },
    async register () {
      try {
        this.error = null
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
          name: this.name
        })
        this.registerDialog = false
        this.success = "Proses registrasi berhasil!"
        this.successSnackbar = true
        this.email = null, this.password = null, this.name = null
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    navigateTo (route) {
      this.$router.push(route)
    },
  },
}
</script>

<style scoped>
.v-text-field {
  width: 500px;
}

.detailPlaceText {
  width: 100%;
}

.panel {
  width: 700px;
  margin-top: 140px;
  background: linear-gradient(5deg, #EFFFEB, #FFFFFF);
}

.toolbarColor {
  background-color: #CEFFC2;
  color: #CEFFC2;
}

.closeBtn {
  margin-left: 145px;
  margin-bottom: 15px;
}

.dialog {
  background: linear-gradient(340deg, #EFFFEB, #FFFFFF);
}

.v-btn:hover {
  background-color: #ffffff;
}

</style>
