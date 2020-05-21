<template>
  <v-app>
    <v-container class="conteudo" fluid>
      <v-row>
        <v-col cols="12">
          <div class="header">
            <h1 class="titulo" color="#3e243e">
              Em qual endereço você deseja receber seu pedido {{ firstName }}?
            </h1>
            <v-spacer></v-spacer>
            <v-btn class="btnImg" :to="{ name: 'perfil' }" color="#ffc529"
              ><img
                v-show="user.user.url_image"
                class="img-perfil"
                width="auto"
                height="48"
                :src="user.user.url_image"/>
              <img
                v-show="!user.user.url_image"
                class="img-perfil"
                width="auto"
                height="30"
                src="../assets/avatar.png"
            /></v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-show="!user.user._id">
        <v-col class="address-user-off" cols="12">
          <h1>Para adicionar endereço de entrega, por favor cadastre-se!</h1>
        </v-col>
      </v-row>

      <v-row v-show="user.user._id">
        <v-col cols="12">
          <div class="header">
            <v-text-field
              class="search"
              append-icon="mdi-magnify"
              flat
              hide-details
              v-model="cep"
              placeholder="Buscar CEP"
              solo-inverted
              color="#fff"
              @keyup="searchCep()"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="cep != ''">
        <v-col cols="12">
          <v-card class="card-form">
            <v-card-title class="title-form">
              <span>Adicionar Endereço</span>
            </v-card-title>
            <v-card-text>
              <v-container class="container-form">
                <v-row>
                  <v-col class="col-form" cols="12">
                    <v-text-field
                      label="Logradouro"
                      color="#A6A6A6"
                      disabled
                      :error-messages="validatorLogradouro"
                      @focus="clearError('logradouro')"
                      hint="Ex.: Rua Carlos Natrodt"
                      required
                      append-icon="mdi-check"
                      v-model="newAddress.street"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="8" sm="8" md="8">
                    <v-text-field
                      label="Bairro"
                      color="#A6A6A6"
                      disabled
                      :error-messages="validatorBairro"
                      @focus="clearError('bairro')"
                      hint="Ex.: Liberdade"
                      append-icon="mdi-check"
                      v-model="newAddress.district"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="4" sm="4" md="4">
                    <v-text-field
                      label="Número"
                      color="#A6A6A6"
                      :error-messages="validatorNumero"
                      @focus="clearError('numero')"
                      required
                      v-model="newAddress.number"
                      append-icon="mdi-check"
                    ></v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="8" sm="8" md="8">
                    <v-text-field
                      label="Cidade"
                      disabled
                      color="#A6A6A6"
                      @focus="clearError('localidade')"
                      :error-messages="validatorLocalidade"
                      append-icon="mdi-check"
                      v-model="newAddress.city"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="4" sm="4" md="4">
                    <v-text-field
                      label="UF"
                      color="#A6A6A6"
                      required
                      disabled
                      :error-messages="validatorUf"
                      v-model="newAddress.region"
                      @focus="clearError('uf')"
                      append-icon="mdi-check"
                      hint="Ex.: SP, PE, ..."
                    ></v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="12">
                    <v-text-field
                      color="#A6A6A6"
                      label="Complemento (Opcional)"
                      append-icon="mdi-check"
                      v-model="newAddress.complement"
                    ></v-text-field>
                  </v-col>
                  <v-col class="col-form" cols="12">
                    <v-text-field
                      label="Identificação do Endereço"
                      required
                      :error-messages="validatorIdentificacao"
                      color="#A6A6A6"
                      hint="Ex.: Casa, Trabalho, Hotel..."
                      @focus="clearError('identificacao')"
                      append-icon="mdi-check"
                      v-model="newAddress.identification"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn class="btn-form" @click="cancelNewAddress">Cancelar</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="btn-form" @click="addAddress('add')">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="cep == '' && user.user._id">
        <v-col cols="12">
          <h1 class="subtitulo" color="#3e243e">
            Endereços cadastrados
          </h1>
        </v-col>
      </v-row>

      <v-row v-show="user.user._id && address.addresses.length == 0">
        <v-col class="address-user-off" cols="12">
          <h1>
            Nenhum endereço cadastrado, por favor busque seu endereço no campo
            acima!
          </h1>
        </v-col>
      </v-row>

      <v-row v-if="cep == '' && user.user._id">
        <v-col
          cols="12"
          xs="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          v-for="(address2, index) in address.addresses"
          :key="index"
        >
          <v-card
            :class="address2.active ? 'card-endereco-select' : 'card-endereco'"
            @click="selecionarEndereco(address2, index)"
          >
            <v-row justify="space-between">
              <v-col class="col-icon-map" cols="3">
                <v-icon>mdi-map</v-icon>
              </v-col>
              <v-col class="col-info-endereco" cols="7">
                <h1 class="subtitulo-itens" color="#3e243e">
                  {{ address2.identification }}
                </h1>
                <p class="paragrafo-itens">
                  {{ address2.street }}, {{ address2.number }} -
                  {{ address2.district }}, {{ address2.city }} -
                  {{ address2.region }}
                </p>
              </v-col>
              <v-col class="col-btn" cols="2">
                <v-dialog
                  v-model="dialog"
                  :retain-focus="false"
                  hide-overlay
                  persistent
                  max-width="400px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="btn-edit"
                      @click="fillAddressEdit(address2)"
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <v-card class="card-form">
                    <v-card-title class="title-form">
                      <span>Editar Endereço</span>
                      <v-btn class="btn-close" @click="cancelEditAddress"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-container class="container-form">
                        <v-row>
                          <v-col class="col-form" cols="12">
                            <v-text-field
                              label="Logradouro"
                              color="#A6A6A6"
                              :error-messages="validatorLogradouro"
                              @focus="clearError('logradouro')"
                              hint="Ex.: Rua Carlos Natrodt"
                              disabled
                              append-icon="mdi-check"
                              v-model="newAddress.street"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="8" sm="8" md="8">
                            <v-text-field
                              label="Bairro"
                              color="#A6A6A6"
                              :error-messages="validatorBairro"
                              @focus="clearError('bairro')"
                              hint="Ex.: Liberdade"
                              append-icon="mdi-check"
                              disabled
                              v-model="newAddress.district"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="4" sm="4" md="4">
                            <v-text-field
                              label="Número"
                              color="#A6A6A6"
                              :error-messages="validatorNumero"
                              @focus="clearError('numero')"
                              required
                              v-model="newAddress.number"
                              append-icon="mdi-check"
                            ></v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="8" sm="8" md="8">
                            <v-text-field
                              label="Cidade"
                              color="#A6A6A6"
                              @focus="clearError('localidade')"
                              :error-messages="validatorLocalidade"
                              append-icon="mdi-check"
                              disabled
                              v-model="newAddress.city"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="4" sm="4" md="4">
                            <v-text-field
                              label="UF"
                              color="#A6A6A6"
                              disabled
                              :error-messages="validatorUf"
                              v-model="newAddress.region"
                              @focus="clearError('uf')"
                              append-icon="mdi-check"
                              hint="Ex.: SP, PE, ..."
                            ></v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="12">
                            <v-text-field
                              color="#A6A6A6"
                              label="Complemento (Opcional)"
                              append-icon="mdi-check"
                              v-model="newAddress.complement"
                            ></v-text-field>
                          </v-col>
                          <v-col class="col-form" cols="12">
                            <v-text-field
                              label="Identificação do Endereço"
                              required
                              :error-messages="validatorIdentificacao"
                              color="#A6A6A6"
                              hint="Ex.: Casa, Trabalho, Hotel..."
                              @focus="clearError('identificacao')"
                              append-icon="mdi-check"
                              v-model="newAddress.identification"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn class="btn-form" @click="deleteAddress"
                        >Excluir</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn class="btn-form" @click="addAddress('edit')"
                        >Salvar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-icon v-show="!process && address2.active">mdi-check</v-icon>
                <v-progress-circular
                  v-show="process && selectAddress == index"
                  indeterminate
                  :size="22"
                  color="#ffc529"
                >
                </v-progress-circular>
              </v-col>
            </v-row>
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
import axios from 'axios'

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

function getAddress(to, next) {
  if (localStorage.getItem('user-token')) {
    store.dispatch('address/fetchAddresses').then(() => {
      next()
    })
  } else {
    next()
  }
}

export default {
  data() {
    return {
      dialog: null,
      selectAddress: 0,
      cep: '',
      errorLogradouro: [],
      errorbairro: [],
      errorNumero: [],
      errorLocalidade: [],
      errorUf: [],
      errorIdentificacao: [],
      addressId: '',
      newAddress: this.fillAddress(),
      editAddress: {},
      process: false,
    }
  },
  methods: {
    fillAddress() {
      return {
        user: '',
        identification: '',
        street: '',
        number: '',
        district: '',
        city: '',
        region: '',
        zip: '',
        complement: '',
      }
    },
    selecionarEndereco(address, index) {
      if (!address.active) {
        this.selectAddress = index
        this.process = true
        address.active = true
        store.dispatch('address/updateAddressActive', address).then(() => {
          this.process = false
          this.selectAddress = 0
        })
        store.dispatch('shipping/fetchShippings', address.district)
      }
    },
    searchCep() {
      if (this.cep.length == 8) {
        axios
          .get(`https://viacep.com.br/ws/${this.cep}/json/`)
          .then(response => {
            this.newAddress.street = response.data.logradouro
            this.newAddress.district = response.data.bairro
            this.newAddress.city = response.data.localidade
            this.newAddress.region = response.data.uf
            this.newAddress.zip = response.data.cep
            this.cep = response.data.cep
          })
          .catch(error => console.log(error))
      }
      if (this.cep.length < 8) {
        this.newAddress.street = ''
        this.newAddress.complement = ''
        this.newAddress.district = ''
        this.newAddress.city = ''
        this.newAddress.region = ''
        this.newAddress.number = ''
        this.newAddress.identification = ''
        this.newAddress.zip = ''
        this.newAddress.user = ''
      }
    },
    cancelNewAddress() {
      this.cep = ''
    },
    fillAddressEdit(address) {
      this.newAddress.street = address.street
      this.newAddress.complement = address.complement
      this.newAddress.district = address.district
      this.newAddress.city = address.city
      this.newAddress.region = address.region
      this.newAddress.number = address.number
      this.newAddress.identification = address.identification
      this.editAddress = address
    },
    cancelEditAddress() {
      this.dialog = false
    },
    deleteAddress() {
      if (this.editAddress._id) {
        store.dispatch('address/deleteAddress', this.editAddress._id)
        this.dialog = false
      }
    },
    addAddress(operation) {
      if (!this.newAddress.street)
        this.errorLogradouro.push('Campo logradouro é obrigatório!')
      if (!this.newAddress.district)
        this.errorbairro.push('Campo bairro é obrigatório!')
      if (!this.newAddress.city)
        this.errorLocalidade.push('Campo cidade é obrigatório!')
      if (!this.newAddress.region) this.errorUf.push('Campo uf é obrigatório!')
      if (!this.newAddress.number)
        this.errorNumero.push('Campo número é obrigatório!')
      if (!this.newAddress.identification)
        this.errorIdentificacao.push('Campo de identificação é obrigatório!')

      if (
        this.newAddress.street &&
        this.newAddress.district &&
        this.newAddress.city &&
        this.newAddress.region &&
        this.newAddress.number &&
        this.newAddress.identification
      ) {
        this.newAddress.user = localStorage.getItem('user-id')
        this.newAddress.zip = this.newAddress.zip.replace('-', '')
        if (operation == 'add') {
          store.dispatch('address/createAddress', this.newAddress)
          this.cep = ''
        }
        if (operation == 'edit') {
          this.editAddress.number = this.newAddress.number
          this.editAddress.complement = this.newAddress.complement
          this.editAddress.identification = this.newAddress.identification
          store.dispatch('address/updateAddress', this.editAddress)
          this.dialog = false
        }
      }
    },
    clearError(field) {
      if (field == 'logradouro') this.errorLogradouro = []
      if (field == 'bairro') this.errorbairro = []
      if (field == 'localidade') this.errorLocalidade = []
      if (field == 'numero') this.errorNumero = []
      if (field == 'uf') this.errorUf = []
      if (field == 'identificacao') this.errorIdentificacao = []
    },
  },
  beforeRouteEnter(to, from, next) {
    getUser(to, next)
    getAddress(to, next)
  },
  computed: {
    ...mapState(['address', 'user', 'shipping']),
    firstName() {
      if (this.user.user.name != null) {
        var name = this.user.user.name.split(' ')
        return name[0]
      }
      return ''
    },
    validatorLogradouro() {
      const error = this.errorLogradouro
      return error
    },
    validatorBairro() {
      const error = this.errorbairro
      return error
    },
    validatorLocalidade() {
      const error = this.errorLocalidade
      return error
    },
    validatorUf() {
      const error = this.errorUf
      return error
    },
    validatorNumero() {
      const error = this.errorNumero
      return error
    },
    validatorIdentificacao() {
      const error = this.errorIdentificacao
      return error
    },
  },
}
</script>

<style>
.card-endereco {
  width: 100%;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f;
}

.address-user-off {
  text-align: center;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.address-user-off h1 {
  font-size: 22px;
}

.card-endereco-select {
  width: 100%;
  border: 1px solid #ffc529 !important;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f;
}

.card-endereco:focus:before {
  opacity: 0;
}

.col-icon-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 0px !important;
}

.col-icon-map .v-icon.v-icon {
  font-size: 60px !important;
}

.col-info-endereco {
  padding: 12px 0px !important;
}

.col-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-edit {
  min-width: 0px !important;
  width: 20px;
  height: 20px !important;
  background-color: #ffc529 !important;
  padding: 0 8px !important;
  box-shadow: 1px 1px 4px #ffc529b3;
}

.col-btn .btn-edit .v-icon.v-icon {
  font-size: 12px !important;
  color: #000;
}

.col-btn .v-icon.v-icon {
  font-size: 15px !important;
  color: #ffc529;
}

.card-form {
  padding: 5px;
}

.title-form {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px !important;
}

.btn-close {
  background-color: #ffc529 !important;
  border-radius: 100%;
  box-shadow: 1px 1px 4px #ffc529b3;
  padding: 0px !important;
  width: 37px;
  min-width: 10px !important;
  position: absolute;
  right: 10px;
  top: 5px;
}

.btn-close .v-icon.v-icon {
  font-size: 16px !important;
}

.container-form {
  padding-bottom: 0px;
}

.col-form {
  padding: 0px 12px;
}

.btn-form {
  background-color: #ffc529 !important;
  font-size: 12px !important;
  font-weight: 700;
  padding: 0px 30px !important;
  box-shadow: 1px 1px 4px #ffc529b3;
}
</style>
