<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-card width="300" class="card mx-auto my-auto">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="12" xl="12">
            <v-card-title class="cardTitle">
              <h1 class="mx-auto" color="#3e243e">Delivery Food</h1>
              <img class="mx-auto" src="../assets/food_logo.png" />
            </v-card-title>
          </v-col>
          <v-col xs="12" sm="12" md="12" lg="12" xl="12">
            <v-tabs v-model="tab" color="#000" centered>
              <v-tabs-slider color="#ffc529"></v-tabs-slider>
              <v-tab class="tabs" href="#tab-1">
                Login
              </v-tab>
              <v-tab class="tabs" href="#tab-2">
                Cadastre-se
              </v-tab>
            </v-tabs>

            <v-tabs-items class="tabs" v-model="tab">
              <v-tab-item value="tab-1">
                <v-card-text>
                  <v-form novalidate="true">
                    <v-text-field
                      label="Email"
                      color="#3e243e"
                      type="email"
                      @focus="clearErrorEmail"
                      v-model="userLogin.email"
                      :error-messages="validatorEmail"
                      prepend-icon="mdi-email"
                      :append-icon="iconEmail"
                    />
                    <v-text-field
                      label="Senha"
                      color="#3e243e"
                      @focus="clearErrorPass"
                      :error-messages="validatorPassword"
                      v-model="userLogin.password"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-form>
                  <v-row justify="end">
                    <v-btn text class="linkDefault">Esqueceu a senha?</v-btn>
                  </v-row>
                </v-card-text>
                <v-card-actions class="actionBtn">
                  <v-btn class="btnDefault" @click="login" @keyup.enter="login">
                    <span v-show="!process">Entrar</span>
                    <v-progress-circular
                      v-show="process"
                      indeterminate
                      color="white"
                    >
                    </v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="Nome Completo"
                      color="#3e243e"
                      v-model="userPost.name"
                      prepend-icon="mdi-account-circle"
                      :append-icon="iconNamePost"
                      :error-messages="validatorNamePost"
                      @focus="clearErrorPost('name')"
                    />
                    <v-text-field
                      label="Email"
                      color="#3e243e"
                      v-model="userPost.email"
                      :error-messages="validatorEmailPost"
                      prepend-icon="mdi-email"
                      :append-icon="iconEmailPost"
                      @focus="clearErrorPost('email')"
                    />
                    <v-text-field
                      label="Telefone + DDD"
                      color="#8B8B8B"
                      v-model="userPost.phone"
                      v-mask="'(##) #####-####'"
                      prepend-icon="mdi-phone"
                      :append-icon="iconPhonePost"
                      :error-messages="validatorPhonePost"
                      @focus="clearErrorPost('phone')"
                    />
                    <v-text-field
                      label="Senha"
                      color="#3e243e"
                      v-model="userPost.password"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      :error-messages="validatorPasswordPost"
                      @focus="clearErrorPost('password')"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions class="actionBtn">
                  <v-btn class="btnDefault" @click="cadastrar">
                    <span v-show="!process2">Cadastar</span>
                    <v-progress-circular
                      v-show="process2"
                      indeterminate
                      color="white"
                    >
                    </v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import store from '@/store/index.js'

export default {
  data() {
    return {
      showPassword: false,
      tab: null,
      errorEmail: [],
      errorPassword: [],
      errorNamePost: [],
      errorEmailPost: [],
      errorPhonePost: [],
      errorPasswordPost: [],
      process: false,
      process2: false,
      userLogin: {
        email: '',
        password: '',
      },
      userPost: {
        name: null,
        email: null,
        phone: null,
        password: null,
      },
    }
  },
  methods: {
    login() {
      if (this.userLogin.email != '' && this.userLogin.password != '') {
        this.process = true
        store
          .dispatch('user/authUser', this.userLogin)
          .then(() => {
            this.process = false
            this.$router.replace({ path: 'home' })
          })
          .catch(error => {
            const message = error.response.data.message
            if (message.toLowerCase().includes('email')) {
              this.errorEmail.push(message)
            }
            if (message.toLowerCase().includes('senha')) {
              this.errorPassword.push(message)
            }
            this.process = false
          })
      } else {
        this.errorEmail.push('Campo obrigatório!')
        this.errorPassword.push('Campo obrigatório!')
      }
    },
    clearErrorEmail() {
      this.errorEmail = []
    },
    clearErrorPass() {
      this.errorPassword = []
    },
    clearErrorPost(field) {
      if (field == 'name') this.errorNamePost = []
      if (field == 'email') this.errorEmailPost = []
      if (field == 'phone') this.errorPhonePost = []
      if (field == 'password') this.errorPasswordPost = []
    },
    validEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    cadastrar() {
      if (
        this.userPost.name &&
        this.userPost.email &&
        this.userPost.phone &&
        this.userPost.password
      ) {
        if (this.validEmail(this.userPost.email)) {
          this.process2 = true
          this.userPost.phone = parseInt(
            this.userPost.phone.replace(/[^\d]+/g, ''),
          )
          store
            .dispatch('user/createUser', this.userPost)
            .then(() => {
              this.process2 = false
              this.$router.replace({ path: 'home' })
            })
            .catch(error => {
              if (error.response.data.message.toLowerCase().includes('email')) {
                this.errorEmailPost.push(error.response.data.message)
              }
              this.process2 = false
            })
        } else {
          this.errorEmailPost.push('Email inválido!')
        }
      } else {
        if (!this.userPost.name) this.errorNamePost.push('Campo obrigatório!')
        if (!this.userPost.email) this.errorEmailPost.push('Campo obrigatório!')
        if (!this.userPost.phone) this.errorPhonePost.push('Campo obrigatório!')
        if (!this.userPost.password)
          this.errorPasswordPost.push('Campo obrigatório!')
      }
    },
  },
  computed: {
    validatorEmail() {
      const error = this.errorEmail
      return error
    },
    validatorPassword() {
      const error = this.errorPassword
      return error
    },
    validatorNamePost() {
      const error = this.errorNamePost
      return error
    },
    validatorEmailPost() {
      const error = this.errorEmailPost
      return error
    },
    validatorPhonePost() {
      const error = this.errorPhonePost
      return error
    },
    validatorPasswordPost() {
      const error = this.errorPasswordPost
      return error
    },
    iconEmail() {
      var icon = ''
      if (this.validEmail(this.userLogin.email)) {
        icon = 'mdi-check'
      }
      return icon
    },
    iconNamePost() {
      var icon = ''
      if (this.userPost.name) {
        if (this.userPost.name.length > 3) {
          icon = 'mdi-check'
        }
      }
      return icon
    },
    iconEmailPost() {
      var icon = ''
      if (this.validEmail(this.userPost.email)) {
        icon = 'mdi-check'
      }
      return icon
    },
    iconPhonePost() {
      var icon = ''
      if (this.userPost.phone) {
        if (this.userPost.phone.length > 10) {
          icon = 'mdi-check'
        }
      }
      return icon
    },
  },
}
</script>

<style>
.app {
  background-color: #3e243edb;
}

.card {
  box-shadow: 0px 0px !important;
  border-radius: 10px !important;
}

.cardTitle {
  display: flex;
  flex-direction: column;
}

.cardTitle h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.cardTitle img {
  width: 300px !important;
}

.tabs {
  margin-top: 10px;
  font-size: 12px !important;
}

.v-label {
  font-size: 12px !important;
}

.v-icon.v-icon {
  font-size: 14px !important;
}

.actionBtn {
  margin-left: 13px !important;
}

.btnDefault {
  color: #000 !important;
  background-color: #ffc529 !important;
  width: 100%;
  height: 44px !important;
  font-size: 14px !important;
  font-weight: bold !important;
  border-radius: 10px !important;
  box-shadow: 1px 1px 4px #ffc529b3 !important;
}

.linkDefault {
  color: #3e243e !important;
  text-transform: initial !important;
  letter-spacing: 0px !important;
}

.actionBtn button {
  font-size: 12px;
  color: #000;
}
</style>
