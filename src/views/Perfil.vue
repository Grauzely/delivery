<template>
  <v-app>
    <v-container v-show="!user.user._id" class="container-top" fluid
      ><img v-if="!picture" class="image-perfil" src="../assets/avatar.png" />
      <img v-if="picture" class="image-perfil" :src="picture" />
      <label text class="btn-alterar-image">
        <input type="file" @change="previewImage" accept="image/*" />
        Carregar foto
      </label>
    </v-container>
    <v-card
      width="600"
      v-show="!user.user._id"
      class="card card-sing-up mx-auto "
    >
      <v-row>
        <v-col cols="12">
          <v-card-text>
            <v-form>
              <v-text-field
                label="Nome Completo"
                color="#3e243e"
                prepend-icon="mdi-account-circle"
                append-icon="mdi-check"
              />
              <v-text-field
                label="Email"
                color="#3e243e"
                prepend-icon="mdi-email"
                append-icon="mdi-check"
              />
              <v-text-field
                label="Telefone"
                color="#8B8B8B"
                prepend-icon="mdi-phone"
                v-mask="'(##) #####-####'"
                append-icon="mdi-check"
              />
              <v-text-field
                label="Senha"
                color="#3e243e"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="actionBtn">
            <v-btn class="btnDefault">Cadastar</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
    <v-container v-show="user.user._id" class="container-top" fluid
      ><img
        v-show="user.user.url_image && !picture"
        class="image-perfil"
        :src="user.user.url_image"
      />
      <img
        v-if="!user.user.url_image && !picture"
        class="image-perfil"
        src="../assets/avatar.png"
      />

      <img v-if="picture" class="image-perfil" :src="picture" />

      <label text class="btn-alterar-image">
        <input type="file" @change="previewImage" accept="image/*" />
        Alterar foto
      </label>

      <h1 class="subtitulo" color="#3e243e">
        {{ user.user.name }}
      </h1>
      <v-btn text @click="logout" class="btn-logout"
        >Logout <v-icon>mdi-logout</v-icon></v-btn
      >
    </v-container>
    <v-container v-show="user.user._id" class="conteudo" fluid>
      <v-row>
        <v-col class="col-dados-pessoais" cols="12" md="6">
          <v-card class="card-dados-pessoais">
            <h1 class="subtitulo" color="#3e243e">
              Dados pessoais
            </h1>
            <v-card-text class="card-text-dados">
              <v-form>
                <v-row>
                  <v-text-field
                    label="Nome Completo"
                    color="#8B8B8B"
                    v-model="user.user.name"
                    :disabled="disabledName ? false : true"
                  />
                  <v-btn
                    class="btnDisabled"
                    @click="disabledName = !disabledName"
                    ><v-icon>{{
                      disabledName ? 'mdi-lock-open' : 'mdi-lock'
                    }}</v-icon></v-btn
                  >
                </v-row>
                <v-row>
                  <v-text-field
                    label="Email"
                    color="#8B8B8B"
                    v-model="user.user.email"
                    :disabled="disabledEmail ? false : true"
                  />
                  <v-btn
                    class="btnDisabled"
                    @click="disabledEmail = !disabledEmail"
                    ><v-icon>{{
                      disabledEmail ? 'mdi-lock-open' : 'mdi-lock'
                    }}</v-icon></v-btn
                  >
                </v-row>
                <v-row>
                  <v-text-field
                    label="Telefone"
                    color="#8B8B8B"
                    v-mask="'(##) #####-####'"
                    v-model="user.user.phone"
                    :disabled="disabledPhone ? false : true"
                  />
                  <v-btn
                    class="btnDisabled"
                    @click="disabledPhone = !disabledPhone"
                    ><v-icon>{{
                      disabledPhone ? 'mdi-lock-open' : 'mdi-lock'
                    }}</v-icon></v-btn
                  >
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="btn-alterar">
              <v-btn class="btnDefault" @click="updateUser">
                <span v-show="!process">Salvar</span>
                <v-progress-circular
                  v-show="process"
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </v-btn>
            </v-card-actions>
            <v-alert v-show="sucess" dismissible dense text type="success">
              {{ msgUpdate }}
            </v-alert>
            <v-alert v-show="error" dismissible dense text type="error">
              {{ msgUpdate }}
            </v-alert>
          </v-card>
        </v-col>
        <v-col class="col-dados-pessoais" cols="12" md="6">
          <v-card class="card-dados-pessoais">
            <v-card-text class="card-text-dados">
              <v-card class="card-pedido">
                <v-row justify="space-between">
                  <v-col class="col-icon-help" cols="3" md="2">
                    <v-icon color="#8B8B8B">mdi-help-circle</v-icon>
                  </v-col>
                  <v-col class="col-info-help" cols="6" md="8">
                    <h1 class="subtitulo-pedido" color="#3e243e">
                      Ajuda
                    </h1>
                    <p>Precisa de ajuda? fale consoco</p>
                  </v-col>
                  <v-col class="col-btn-pedido" cols="3" md="2">
                    <v-btn text class="btn-seguir">
                      <v-icon color="#ffc529">mdi-play</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-bottom-navigation
      class="bottomNav"
      :value="$store.activeBtn"
      color="#ffc529"
      fixed
    >
      <v-btn :to="{ name: 'home' }" class="btnHome">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn :to="{ name: 'endereco' }" class="btnEndereco">
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>

      <v-btn :to="{ name: 'pedido' }" class="btnFloat">
        <v-badge
          class="badge-basket"
          offset-x="8"
          offset-y="8"
          color="white"
          :content="
            $store.state.order.qtdTotalItems == 0
              ? '0'
              : $store.state.order.qtdTotalItems
          "
        >
          <v-icon>mdi-basket</v-icon>
        </v-badge>
      </v-btn>

      <v-btn :to="{ name: 'acompanhar' }" class="btnPedido">
        <v-icon>mdi-view-list</v-icon>
      </v-btn>

      <v-btn :to="{ name: 'perfil' }" class="btnConfig">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store/index.js'
import firebase from 'firebase/app'
import 'firebase/storage'

function getUser(to, next) {
  if (localStorage.getItem('user-token')) {
    store
      .dispatch('user/fetchUser', localStorage.getItem('user-id'))
      .then(() => {
        next()
      })
  } else {
    next()
  }
}

export default {
  data() {
    return {
      qtdPedido: 0,
      showPassword: false,
      imageData: null,
      picture: null,
      uploadValue: 0,
      process: false,
      sucess: false,
      error: false,
      msgUpdate: null,
      disabledName: false,
      disabledEmail: false,
      disabledPhone: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    getUser(to, next)
  },
  methods: {
    logout() {
      store.dispatch('user/authUserLogout').then(() => {
        this.$router.replace({ path: '/' })
      })
    },
    updateUser() {
      this.process = true
      if (this.imageData) {
        const storageRef = firebase
          .storage()
          .ref(`${this.imageData.name}`)
          .put(this.imageData)
        storageRef.on(
          `state_changed`,
          snapshot => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          error => {
            console.log(error.message)
          },
          () => {
            this.uploadValue = 100
            storageRef.snapshot.ref.getDownloadURL().then(url => {
              console.log(url)
              this.picture = url
              if (
                this.user.user.name &&
                this.user.user.email &&
                this.user.user.phone
              ) {
                this.user.user.phone = parseInt(
                  this.user.user.phone.replace(/[^\d]+/g, ''),
                )
                if (this.picture) this.user.user.url_image = this.picture
                store
                  .dispatch('user/updateUser', this.user.user)
                  .then(() => {
                    this.process = false
                    this.sucess = true
                    this.error = false
                    this.msgUpdate = 'Dados atualizados com sucesso!'
                  })
                  .catch(error => {
                    console.log('Error = ' + error)
                    this.sucess = false
                    this.error = true
                    this.msgUpdate =
                      'Ops, ocorreu um erro, por favor tente novamente!'
                  })
              }
            })
          },
        )
      } else if (
        this.user.user.name &&
        this.user.user.email &&
        this.user.user.phone
      ) {
        this.user.user.phone = parseInt(
          this.user.user.phone.replace(/[^\d]+/g, ''),
        )
        if (this.picture) this.user.user.url_image = this.picture
        store
          .dispatch('user/updateUser', this.user.user)
          .then(() => {
            this.process = false
            this.sucess = true
            this.error = false
            this.msgUpdate = 'Dados atualizados com sucesso!'
          })
          .catch(error => {
            console.log('Error = ' + error)
            this.sucess = false
            this.error = true
            this.msgUpdate = 'Ops, ocorreu um erro, por favor tente novamente!'
          })
      }
    },
    previewImage(event) {
      this.uploadValue = 0
      this.imageData = event.target.files[0]
      this.picture = URL.createObjectURL(this.imageData)
    },
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style>
.container-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  height: 280px;
  background-image: url(../assets/wave.svg);
  background-size: cover;
  background-position: center;
}

.input-file {
  margin: 10px;
}

input[type='file'] {
  display: none;
}

.card-sing-up .v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0 16px !important;
}

.card-sing-up .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.image-perfil {
  width: 120px;
  height: auto;
  border-radius: 70px;
}

.btn-logout {
  font-size: 14px !important;
  font-weight: 700 !important;
  text-transform: capitalize;
  background-color: transparent !important;
  position: absolute;
  top: 3%;
  right: 5%;
}

.btn-logout:before {
  background-color: transparent;
}

.btn-alterar-image {
  text-transform: capitalize;
  text-decoration: underline;
  font-weight: 700;
  margin: 10px 0;
}

.col-dados-pessoais {
  padding-top: 0px;
}

.card-dados-pessoais {
  box-shadow: 0px 0px !important;
}

.card-text-dados {
  padding: 16px 0px;
}

.btn-alterar {
  padding: 8px 0px;
}

.col-text-update-senha {
  padding-top: 0px;
  padding-bottom: 0px;
}

.col-btn-update-senha {
  padding-bottom: 21px;
  display: flex;
  flex-direction: column;
}

.btnDisabled {
  background-color: #ffc529 !important;
  box-shadow: 1px 1px 4px #ffc529b3;
  padding: 3px 0px !important;
  margin-top: 14px;
  min-width: 35px !important;
}

.btn-update-senha .v-icon.v-icon {
  font-size: 25px !important;
}

.col-icon-help {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 0px !important;
  padding-left: 0px !important;
}

.col-icon-help .v-icon.v-icon {
  font-size: 25px !important;
}

.col-info-help {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 0px !important;
  padding-left: 0px !important;
}

.col-info-help h1 {
  font-size: 14px !important;
}

.col-info-help p {
  font-size: 12px !important;
  margin-bottom: 0px !important;
}

.btn-seguir .v-icon.v-icon {
  font-size: 25px !important;
}

@media (max-width: 991px) {
  .container-top {
    background-image: url(../assets/wave2.svg);
  }
}
</style>
