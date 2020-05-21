<template>
  <v-app>
    <v-container class="conteudo" fluid>
      <v-row>
        <v-col cols="12">
          <div class="header">
            <h1 class="titulo" color="#3e243e">
              Aqui está o resumo do seu pedido, {{ firstName }}!
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
      <v-row class="row-hearder">
        <v-col cols="12">
          <div class="header-pedido">
            Pedido
          </div>
        </v-col>
      </v-row>

      <v-row v-if="order.itemsOrder" class="row-pedido">
        <v-col
          class="col-pedido"
          cols="12"
          xs="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          v-for="(itemOrder, index) in order.itemsOrder"
          :key="index"
        >
          <v-card class="card-pedido">
            <v-row justify="space-between">
              <v-col class="col-qtd-pedido" cols="2">
                <h1 class="subtitulo-pedido">{{ itemOrder.qtd_item }} x</h1>
              </v-col>
              <v-col class="col-image-pedido" cols="2">
                <v-img
                  class="image-pedido"
                  src="../assets/burguer2.png"
                ></v-img>
              </v-col>
              <v-col class="col-info-pedido" cols="6">
                <h1 class="subtitulo-pedido" color="#3e243e">
                  {{ itemOrder.name }}
                </h1>
                <v-spacer></v-spacer>
                <h1 class="subtitulo-pedido" color="#3e243e">
                  {{
                    itemOrder.price_promo
                      ? itemOrder.price_promo
                      : itemOrder.price
                  }}
                </h1>
              </v-col>
              <v-col class="col-btn-pedido" cols="2">
                <v-dialog
                  v-model="dialogPedido"
                  :retain-focus="false"
                  hide-overlay
                  persistent
                  max-width="250px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="fillItem(itemOrder)"
                      class="btn-edit"
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <v-card class="add-item">
                    <v-card-title class="add-item-title">
                      <h1 color="#3e243e">
                        {{ itemUpdate.name }}
                      </h1>
                      <v-img
                        class="add-item-image"
                        src="../assets/burguer2.png"
                      ></v-img>
                    </v-card-title>
                    <v-card-actions class="add-item-actions">
                      <div class="add-item-qtd">
                        <v-btn class="add-item-qtd-btn" @click="removeQtd"
                          >-</v-btn
                        >
                        <p class="text-center">{{ qtd }}</p>
                        <v-btn class="add-item-qtd-btn" @click="addQtd"
                          >+</v-btn
                        >
                      </div>
                      <div class="add-item-qtd">
                        <v-btn class="btn-form-update" @click="deletePedido"
                          >Excluir</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          class="btn-form-update"
                          color="#FFC529"
                          @click="updateOrder"
                          >Atualizar</v-btn
                        >
                      </div>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-show="$store.state.order.qtdTotalItems == 0">
        <v-col class="col-qtd-pedido" cols="12">
          <h1 class="subtitulo-pedido">
            Ainda não existem nenhum item no pedido
            <v-icon>mdi-emoticon-sad</v-icon>
          </h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-obs-pedido" cols="12">
          <v-textarea
            class="text-obs-pedido"
            solo
            rows="2"
            name="observacoes"
            label="Observações..."
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-cupom-pedido" cols="7" md="3">
          <v-text-field
            color="#A6A6A6"
            prepend-icon="mdi-ticket"
            v-model="cupom"
            label="Cupom"
            :error-messages="errorCupom"
            :success-messages="sucessCupom"
            :append-icon="
              !cupomError && !cupomSucess
                ? 'mdi-plus-box'
                : !cupomError && cupomSucess
                ? 'mdi-check'
                : cupomError && !cupomSucess
                ? 'mdi-close'
                : ''
            "
            @keyup="clearCoupon()"
            @click:append="verificarCupom"
          ></v-text-field>
        </v-col>
        <v-col class="col-valor-pedido" cols="5" md="2">
          <p class="text-second">
            Subtotal: R$
            {{
              $store.state.order.valueSubTotalOrder == 0 ||
              !$store.state.order.valueSubTotalOrder
                ? '0,00'
                : $store.state.order.valueSubTotalOrder
            }}
          </p>
          <p class="text-second">
            Frete: R$
            {{
              shipping.shipping.price == null
                ? 'R$ 0,00'
                : shipping.shipping.price
            }}
          </p>
          <p v-show="coupon.coupon.desc_price" class="text-discount">
            Desconto: -R$
            {{ coupon.coupon.desc_price }}
          </p>
          <p class="text-primary">
            Total: R$
            {{
              $store.state.order.valueTotalOrder == 0
                ? '0,00'
                : $store.state.order.valueTotalOrder
            }}
          </p>
        </v-col>
        <v-col class="col-endereco-pedido" cols="12" md="7">
          <v-card class="card-endereco-select">
            <v-row justify="space-between">
              <v-col class="col-icon-map-pedido" cols="3">
                <v-icon>mdi-map</v-icon>
              </v-col>
              <v-col class="col-info-endereco-pedido" cols="7">
                <h1 class="subtitulo-pedido" color="#3e243e">
                  {{
                    address.address == undefined
                      ? 'Por favor, selecione um endereço para entrega!'
                      : address.address.identification
                  }}
                </h1>
                <p class="paragrafo-pedido">
                  {{
                    address.address == undefined
                      ? ''
                      : address.address.street +
                        ', ' +
                        address.address.number +
                        ' - ' +
                        address.address.district +
                        ', ' +
                        address.address.city +
                        ' - ' +
                        address.address.region
                  }}
                </p>
              </v-col>
              <v-col class="col-btn-enderenco-pedido" cols="2">
                <v-btn class="btn-edit" :to="{ name: 'endereco' }">
                  <v-icon>{{
                    address.address == undefined
                      ? 'mdi-arrow-right-bold'
                      : 'mdi-sync'
                  }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-text-pagamento" cols="12">
          <h1 class="subtitulo" color="#3e243e">
            Forma de pagamento
          </h1>
        </v-col>
        <v-col class="col-card-pagamento" cols="12">
          <v-radio-group v-model="payment" column>
            <v-row>
              <v-col class="col-card-pagamento" cols="12" md="4">
                <v-card class="card-pagamento">
                  <v-icon>mdi-credit-card</v-icon>
                  <p class="text-pagamento">Cartão - Crétido</p>
                  <v-spacer></v-spacer>
                  <v-radio color="#ffc529" value="1"></v-radio>
                </v-card>
              </v-col>
              <v-col class="col-card-pagamento" cols="12" md="4">
                <v-card class="card-pagamento">
                  <v-icon>mdi-credit-card</v-icon>
                  <p class="text-pagamento">Cartão - Débito</p>
                  <v-spacer></v-spacer>
                  <v-radio color="#ffc529" value="2"></v-radio>
                </v-card>
              </v-col>
              <v-col class="col-card-pagamento" cols="12" md="4">
                <v-card class="card-pagamento-money">
                  <v-icon>mdi-cash</v-icon>
                  <p class="text-pagamento">Dinheiro</p>
                  <v-spacer></v-spacer>
                  <v-radio color="#ffc529" value="3"></v-radio>
                </v-card>
              </v-col>
            </v-row>
          </v-radio-group>
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

      <v-btn class="btnFloat" @click="sendOrder">
        <p v-show="fullOrderValidator" class="text-pedido">Pedir</p>
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
          v-show="!fullOrderValidator"
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

function realToDecimal(priceItem) {
  if (priceItem) {
    return parseFloat(priceItem.replace(',', '.'))
  }
}

export default {
  data() {
    return {
      qtdPedido: 0,
      dialog: null,
      dialogPedido: null,
      payment: null,
      qtd: 1,
      qtd_old: null,
      cupom: null,
      cupomError: false,
      cupomSucess: false,
      itemUpdate: this.refreshItemUpdade(),
      orderPayload: [
        {
          address: null,
          user: null,
          shipping: null,
          item_order: [],
          number: null,
          coupon: null,
          sub_price: null,
          total_price: null,
          payment: null,
        },
      ],
    }
  },
  methods: {
    refreshItemUpdade() {
      return {
        _id: null,
        name: null,
        price: null,
        price_promo: null,
        qtd_item: null,
        price_shipping: 0.0,
      }
    },
    fillItem(itemOrder) {
      this.itemUpdate._id = itemOrder._id
      this.itemUpdate.name = itemOrder.name
      this.itemUpdate.price = itemOrder.price
      this.itemUpdate.price_promo = itemOrder.price_promo
      this.qtd = itemOrder.qtd_item
    },
    removeQtd() {
      if (this.qtd > 1) {
        this.qtd--
      }
    },
    addQtd() {
      this.qtd++
    },
    updateOrder() {
      this.dialogPedido = false
      this.itemUpdate.qtd_item = this.qtd
      if (this.shipping.shipping.price != null) {
        this.itemUpdate.price_shipping = this.shipping.shipping.price
      }
      store.dispatch('order/updateItemOrders', this.itemUpdate)
    },
    deletePedido() {
      this.dialogPedido = false
      if (this.shipping.shipping.valor != null) {
        this.itemUpdate.price_shipping = this.shipping.shipping.price
      }
      store.dispatch('order/deleteItemOrders', this.itemUpdate)
      this.refreshItemUpdade()
    },
    verificarCupom() {
      if (this.cupom) {
        store
          .dispatch('coupon/fetchCoupon', this.cupom)
          .then(() => {
            this.cupomError = false
            this.cupomSucess = true
          })
          .catch(error => {
            this.cupomSucess = false
            this.cupomError = true
            console.log('Error: ' + error)
          })
      } else {
        this.cupomSucess = false
        this.cupomError = true
      }
    },
    clearCoupon() {
      if (!this.cupom) {
        this.cupomError = false
        this.cupomSucess = false
      }
    },
    sendOrder() {
      if (
        this.order.itemsOrder.length > 0 &&
        this.address.address.identification &&
        this.payment
      ) {
        this.orderPayload[0].address = this.address.address._id
        this.orderPayload[0].user = this.user.user._id
        this.orderPayload[0].shipping = this.shipping.shipping._id
        if (this.coupon.coupon._id) {
          this.orderPayload[0].coupon = this.coupon.coupon._id
        }
        this.orderPayload[0].sub_price = realToDecimal(
          this.order.valueSubTotalOrder,
        )
        this.orderPayload[0].total_price = realToDecimal(
          this.order.valueTotalOrder,
        )
        if (this.payment == 1) {
          this.orderPayload[0].payment = 'Crédito'
        }
        if (this.payment == 2) {
          this.orderPayload[0].payment = 'Débito'
        }
        if (this.payment == 3) {
          this.orderPayload[0].payment = 'Dinheiro'
        }
        if (!this.order.itemsOrder.isEmpty) {
          this.orderPayload[1] = this.order.itemsOrder
        }
        store.dispatch('order/createOrder', this.orderPayload).then(() => {
          this.$router.push({ path: '/acompanhar' })
        })
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    getUser(to, next)
    getAddress(to, next)
  },
  computed: {
    ...mapState(['order', 'user', 'address', 'shipping', 'coupon']),
    errorCupom() {
      const errors = []
      if (this.cupomError) {
        errors.push('Cupom inválido!')
      }
      return errors
    },
    sucessCupom() {
      const errors = []
      if (this.cupomSucess) {
        errors.push('Cupom adicionado com sucesso!')
      }
      return errors
    },
    firstName() {
      if (this.user.user.name != null) {
        var name = this.user.user.name.split(' ')
        return name[0]
      }
      return ''
    },
    fullOrderValidator() {
      if (
        this.order.itemsOrder.length > 0 &&
        this.address.address.identification &&
        this.payment
      ) {
        return true
      }
      return false
    },
  },
}
</script>

<style>
.row-hearder {
  background-color: #ffc529;
  margin-left: 0px;
  margin-right: 0px;
}

.header-pedido {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.row-pedido {
  margin-top: 10px;
}

.col-qtd-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 0px !important;
}

.col-qtd-pedido p {
  margin-bottom: 0px !important;
}

.col-image-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 0px !important;
  padding-left: 0px !important;
}

.image-pedido {
  width: 35px;
  height: auto;
  border-radius: 10px;
}

.btn-form-update {
  background-color: #ffc529 !important;
  font-size: 12px !important;
  font-weight: 700;
  padding: 0px 10px !important;
  box-shadow: 1px 1px 4px #ffc529b3;
  width: 100px;
  margin: 0px 10px;
}

.col-info-pedido {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.subtitulo-pedido {
  font-size: 12px !important;
}

.paragrafo-pedido {
  font-size: 10px !important;
  margin-bottom: 0px !important;
}

.col-btn-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.col-pedido {
  padding-bottom: 0px;
}

.card-pedido {
  width: 100%;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f;
}

.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f !important;
}

.col-obs-pedido {
  padding-bottom: 0px;
}

.text-obs-pedido {
  font-size: 10px !important;
  line-height: 14px;
}

.col-cupom-pedido {
  display: flex;
  flex-direction: row;
  padding-top: 0px;
}

.col-valor-pedido {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding-left: 0px;
  padding-top: 0px;
}

.text-second {
  font-size: 12px;
  margin-bottom: 0px !important;
}

.text-discount {
  font-size: 12px;
  margin-bottom: 0px !important;
  color: green;
}

.text-primary {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 0px !important;
}

.col-endereco-pedido {
  padding-top: 0px;
}

.card-endereco-pedido {
  width: 100%;
  border: 1px solid #ffc529 !important;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f;
}

.col-icon-map-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 0px !important;
  padding-top: 8px;
  padding-bottom: 8px;
}

.col-icon-map-pedido .v-icon.v-icon {
  font-size: 30px !important;
}

.col-info-endereco-pedido {
  padding: 8px 0px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.col-btn-enderenco-pedido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0px !important;
}

.col-btn-enderenco-pedido .btn-edit .v-icon.v-icon {
  font-size: 12px !important;
  color: #000;
  margin-top: 0px;
}

.card-pagamento {
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 3px 3px 10px #0000001f;
}

.card-pagamento-money {
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 3px 3px 10px #0000001f;
}

.card-pagamento-money .v-icon.v-icon {
  font-size: 16px !important;
}

.text-pagamento {
  margin-bottom: 0px !important;
  font-size: 12px;
  font-weight: 700;
  margin-left: 10px;
}

.col-text-pagamento {
  padding-bottom: 0px;
}

.col-card-pagamento {
  padding-top: 0px;
}

.text-pedido {
  margin-bottom: 0px !important;
  font-size: 12px !important;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
