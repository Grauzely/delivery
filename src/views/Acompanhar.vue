<template>
  <v-app>
    <v-container class="conteudo" fluid>
      <v-row>
        <v-col cols="12">
          <div class="header">
            <h1 class="titulo" color="#3e243e">
              Aqui está seus últimos pedidos {{ firstName }}!
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
            Últimos Pedidos
          </div>
        </v-col>
      </v-row>

      <v-row v-show="!user.user._id">
        <v-col class="address-user-off" cols="12">
          <h1>Para visulizar seus últimos pedidos, por favor cadastre-se!</h1>
        </v-col>
      </v-row>

      <v-row v-show="user.user._id && order.orders.length == 0">
        <v-col class="address-user-off" cols="12">
          <h1>Nenhum pedido foi feito ainda!</h1>
        </v-col>
      </v-row>

      <v-row
        v-show="user.user._id && order.status != 4"
        cols="12"
        xs="12"
        sm="6"
        md="6"
        lg="6"
        xl="6"
        v-for="(order, index) in order.orders.slice().reverse()"
        :key="index + 'A'"
      >
        <v-col cols="12">
          <h1 class="subtitulo" color="#3e243e">
            Nº {{ order.number }} - {{ order.date | date }}
          </h1>

          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel class="expansion-acompanhar">
              <v-expansion-panel-header
                class="header-exp-acompanhar"
                expand-icon="mdi-menu-down"
              >
                <v-row class="row-pedido">
                  <v-col class="col-title-acompanhar" cols="12">
                    <p class="text-title-acompanhar">Em andamento</p>
                  </v-col>
                  <v-col
                    class="col-acompanhar-pedido"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    lg="6"
                    xl="6"
                    v-for="(itemOrder, index) in order.item_order"
                    :key="index + 'B'"
                  >
                    <v-card class="card-acompanhar-pedido">
                      <v-row justify="space-between">
                        <v-col class="col-qtd-pedido" cols="2">
                          <h1 class="subtitulo-pedido">
                            {{ itemOrder.qtd_item }} x
                          </h1>
                        </v-col>
                        <v-col class="col-image-pedido" cols="2">
                          <v-img
                            class="image-pedido"
                            src="../assets/burguer2.png"
                          ></v-img>
                        </v-col>
                        <v-col class="col-info-pedido" cols="8">
                          <h1 class="subtitulo-pedido" color="#3e243e">
                            {{ itemOrder.item.name }}
                          </h1>
                          <v-spacer></v-spacer>
                          <h1 class="subtitulo-pedido" color="#3e243e">
                            R$
                            {{
                              itemOrder.item.price_promo
                                ? decimalToReal(itemOrder.item.price_promo)
                                : decimalToReal(itemOrder.item.price)
                            }}
                          </h1>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content
                ><v-timeline dense>
                  <v-timeline-item
                    icon="mdi-monitor"
                    fill-dot
                    :color="order.status == 1 ? '#ffc529' : '#8B8B8B'"
                    :icon-color="order.status == 1 ? '#000' : '#fff'"
                    small
                  >
                    <v-row class="pt-1">
                      <v-col cols="12">
                        <p class="text-timeline">
                          Pedido foi recebido pelo estabelecimento!
                        </p>
                      </v-col>
                    </v-row>
                  </v-timeline-item>

                  <v-timeline-item
                    icon="mdi-stove"
                    fill-dot
                    :color="order.status == 2 ? '#ffc529' : '#8B8B8B'"
                    :icon-color="order.status == 2 ? '#000' : '#fff'"
                    small
                  >
                    <v-row class="pt-1">
                      <v-col cols="12">
                        <p class="text-timeline">
                          Pedido está sendo preparado!
                        </p>
                      </v-col>
                    </v-row>
                  </v-timeline-item>

                  <v-timeline-item
                    icon="mdi-motorbike"
                    fill-dot
                    :color="order.status == 3 ? '#ffc529' : '#8B8B8B'"
                    :icon-color="order.status == 3 ? '#000' : '#fff'"
                    small
                  >
                    <v-row class="pt-1">
                      <v-col cols="12">
                        <p class="text-timeline">
                          Pedido está pronto e a caminho!
                        </p>
                      </v-col>
                    </v-row>
                  </v-timeline-item>

                  <v-timeline-item
                    icon="mdi-food"
                    fill-dot
                    :color="order.status == 4 ? '#ffc529' : '#8B8B8B'"
                    :icon-color="order.status == 4 ? '#000' : '#fff'"
                    small
                  >
                    <v-row class="pt-1">
                      <v-col cols="12">
                        <p class="text-timeline">Pedido entregue!</p>
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-timeline>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row
        v-show="user.user._id && order.status == 4"
        cols="12"
        xs="12"
        sm="6"
        md="6"
        lg="6"
        xl="6"
        v-for="(order, index) in order.orders.slice().reverse()"
        :key="index + 'C'"
      >
        <v-col cols="12">
          <h1 class="subtitulo" color="#3e243e">
            Nº {{ order.number }} - {{ order.date | date }}
          </h1>

          <v-expansion-panels v-model="panel" disabled multiple>
            <v-expansion-panel class="expansion-acompanhar">
              <v-expansion-panel-header
                class="header-exp-acompanhar"
                expand-icon="mdi-menu-up"
              >
                <v-row class="row-pedido">
                  <v-col class="col-title-acompanhar" cols="12">
                    <p class="text-title-acompanhar">Pedido entregue!</p>
                  </v-col>
                  <v-col
                    class="col-acompanhar-pedido"
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    lg="6"
                    xl="6"
                    v-for="(itemOrder, index) in order.item_order"
                    :key="index + 'D'"
                  >
                    <v-card class="card-acompanhar-pedido">
                      <v-row justify="space-between">
                        <v-col class="col-qtd-pedido" cols="2">
                          <h1 class="subtitulo-pedido">
                            {{ itemOrder.qtd_item }} x
                          </h1>
                        </v-col>
                        <v-col class="col-image-pedido" cols="2">
                          <v-img
                            class="image-pedido"
                            src="../assets/burguer2.png"
                          ></v-img>
                        </v-col>
                        <v-col class="col-info-pedido" cols="8">
                          <h1 class="subtitulo-pedido" color="#3e243e">
                            {{ itemOrder.item.name }}
                          </h1>
                          <v-spacer></v-spacer>
                          <h1 class="subtitulo-pedido" color="#3e243e">
                            R$
                            {{
                              itemOrder.item.price_promo
                                ? decimalToReal(itemOrder.item.price_promo)
                                : decimalToReal(itemOrder.item.price)
                            }}
                          </h1>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
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

function getOrders(to, next) {
  if (localStorage.getItem('user-token')) {
    store.dispatch('order/fetchOrders').then(() => {
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
      panel: [0],
    }
  },
  beforeRouteEnter(to, from, next) {
    getUser(to, next)
    getOrders(to, next)
  },
  methods: {
    decimalToReal(priceItem) {
      if (priceItem) {
        return priceItem.toLocaleString('pt-br', {
          minimumFractionDigits: 2,
        })
      }
    },
  },
  computed: {
    ...mapState(['order', 'user']),
    errorCupom() {
      const errors = []
      if (!this.validarCupom) {
        errors.push('Cupom inválido!')
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
  },
}
</script>

<style>
.col-title-acompanhar {
  text-align: center;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.text-title-acompanhar {
  font-size: 14px !important;
  font-weight: 700;
  margin-bottom: 0px !important;
}

.col-acompanhar-pedido {
  padding-bottom: 0px;
  padding-top: 0px;
}

.card-acompanhar-pedido {
  width: 100%;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 0px 0px;
}

.v-application--is-ltr .v-expansion-panel-header__icon {
  position: absolute;
  left: 46%;
  bottom: 3%;
}

.v-application--is-ltr .v-expansion-panel-header__icon .v-icon.v-icon {
  font-size: 30px !important;
}

.expansion-acompanhar {
  padding: 15px;
}

.v-expansion-panel::before {
  box-shadow: 3px 3px 10px #0000001f !important;
}

.header-exp-acompanhar {
  box-shadow: 1px 1px 10px #ffc52933;
  border-radius: 10px;
}

.text-timeline {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 0px !important;
}

.v-timeline:before {
  height: 90% !important;
}

.v-timeline-item {
  padding-bottom: 0px !important;
}
</style>
