<template>
  <v-app>
    <v-container class="conteudo" fluid>
      <v-row>
        <v-col class="col-text-call" cols="12" md="6" lg="6" xl="6">
          <div class="header">
            <h1 class="titulo" color="#3e243e">
              Vamos comer uma deliciosa comida {{ firstName }}?
            </h1>
            <v-spacer></v-spacer>
            <v-btn class="btnImgMob" :to="{ name: 'perfil' }" color="#ffc529"
              ><img
                v-show="user.user.url_image"
                class="img-perfil"
                width="auto"
                height="48"
                :src="user.user.url_image"
              />
              <img
                v-show="!user.user.url_image"
                class="img-perfil"
                width="auto"
                height="30"
                src="../assets/avatar.png"
              />
            </v-btn>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          v-if="!item.itemsPromo.length == 0"
        >
          <div class="header">
            <v-text-field
              class="search"
              append-icon="mdi-magnify"
              flat
              v-model="search"
              hide-details
              placeholder="O que você deseja?"
              solo-inverted
              color="#fff"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="search == '' && !item.itemsPromo.length == 0">
        <v-col cols="12">
          <h1 class="subtitulo" color="#3e243e">
            Promoções
            <p class="line-promo"></p>
          </h1>
        </v-col>
      </v-row>

      <v-row v-if="search == ''">
        <v-col cols="12">
          <v-sheet class="mx-auto">
            <v-slide-group
              class="slideGroupCardPromo"
              v-model="selectPromo"
              show-arrows
            >
              <v-slide-item
                v-for="(promocao, index) in item.itemsPromo"
                :key="index"
              >
                <v-dialog
                  v-model="dialog"
                  :retain-focus="false"
                  persistent
                  hide-overlay
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-card
                      @click="fillItem(promocao)"
                      v-on="on"
                      class="card_promo"
                      height="150"
                      width="120"
                    >
                      <v-row align="center" justify="center">
                        <img
                          class="mx-auto"
                          width="auto"
                          height="70"
                          src="../assets/burguer.png"
                        />
                      </v-row>
                      <v-row align="center" justify="center">
                        <h1 class="subtitulo-promo" color="#3e243e">
                          {{ promocao.name }}
                        </h1>
                      </v-row>
                      <v-row justify="center">
                        <p class="paragrafo">
                          {{ promocao.description }}
                        </p>
                      </v-row>
                      <v-row justify="center">
                        <p class="old-price">R$ {{ promocao.price }}</p>
                        <p class="new-price">R$ {{ promocao.price_promo }}</p>
                      </v-row>
                    </v-card>
                  </template>
                  <v-card class="add-item">
                    <v-card-title class="add-item-title">
                      <h1 color="#3e243e">
                        {{ itemToAdd.name }}
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
                      <div class="header-card-add">
                        <v-btn
                          class="add-item-btn"
                          color="#FFC529"
                          @click="dialog = false"
                        >
                          Cancelar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          class="add-item-btn"
                          color="#FFC529"
                          @click="addItemPedido"
                          >Adicionar
                        </v-btn>
                      </div>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="search == ''">
        <v-col cols="12">
          <v-sheet class="mx-auto">
            <v-slide-group
              class="slideGroupCardMenu"
              v-model="selectMenu"
              show-arrows
            >
              <v-slide-item
                v-for="(category, index) in category.categories"
                :key="index"
              >
                <v-card
                  :class="
                    $store.state.item.selectCategoryId == category._id
                      ? 'card-menu-select'
                      : 'card-menu'
                  "
                  height="40"
                  width="120"
                  @click="selectCategory(category._id)"
                >
                  <img
                    class="image-menu"
                    width="30"
                    height="auto"
                    src="../assets/burguer.png"
                  />
                  <h1 class="subtitulo-menu" color="#3e243e">
                    {{ category.name }}
                  </h1>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="search == ''">
        <v-col
          cols="12"
          xs="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          v-for="(item, index) in item.itemsCategory"
          :key="index"
        >
          <v-card class="card-itens d-inline-block mx-auto">
            <v-row justify="space-between">
              <v-col class="col-image-itens" cols="4">
                <v-img class="image-itens" src="../assets/burguer2.png"></v-img>
              </v-col>
              <v-col class="col-info-itens" cols="8">
                <h1 class="subtitulo-itens" color="#3e243e">
                  {{ item.name }}
                </h1>
                <p class="paragrafo-itens">
                  {{ item.description }}
                </p>
                <v-spacer></v-spacer>
                <div class="price-item-add">
                  <p class="price-item-promo" v-show="item.price_promo">
                    R$ {{ item.price_promo }}
                  </p>
                  <p
                    :class="item.price_promo ? 'price-item-old' : 'price-item'"
                  >
                    R$ {{ item.price }}
                  </p>
                  <v-spacer></v-spacer>
                  <v-dialog
                    v-model="dialog"
                    :retain-focus="false"
                    persistent
                    hide-overlay
                    max-width="290"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn @click="fillItem(item)" class="btn-add" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-card class="add-item">
                      <v-card-title class="add-item-title">
                        <h1 color="#3e243e">
                          {{ itemToAdd.name }}
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
                        <div class="header-card-add">
                          <v-btn
                            class="add-item-btn"
                            color="#FFC529"
                            @click="dialog = false"
                          >
                            Cancelar
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            class="add-item-btn"
                            color="#FFC529"
                            @click="addItemPedido"
                            >Adicionar
                          </v-btn>
                        </div>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="search != ''">
        <v-col
          cols="12"
          xs="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          v-for="(item, index) in filteredItems"
          :key="index"
        >
          <v-card class="card-itens d-inline-block mx-auto">
            <v-row justify="space-between">
              <v-col class="col-image-itens" cols="4">
                <v-img class="image-itens" src="../assets/burguer2.png"></v-img>
              </v-col>
              <v-col class="col-info-itens" cols="8">
                <h1 class="subtitulo-itens" color="#3e243e">
                  {{ item.name }}
                </h1>
                <p class="paragrafo-itens">
                  {{ item.description }}
                </p>
                <v-spacer></v-spacer>
                <div class="price-item-add">
                  <p class="price-item">R$ {{ item.price }}</p>
                  <v-spacer></v-spacer>
                  <v-dialog
                    v-model="dialog"
                    :retain-focus="false"
                    persistent
                    hide-overlay
                    max-width="290"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn @click="fillItem(item)" class="btn-add" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-card class="add-item">
                      <v-card-title class="add-item-title">
                        <h1 color="#3e243e">
                          {{ itemToAdd.name }}
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
                        <div class="header-card-add">
                          <v-btn
                            class="add-item-btn"
                            color="#FFC529"
                            @click="dialog = false"
                          >
                            Cancelar
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            class="add-item-btn"
                            color="#FFC529"
                            @click="addItemPedido"
                            >Adicionar
                          </v-btn>
                        </div>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
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

function getItems(to, next) {
  store.dispatch('item/fetchItems').then(() => {
    next()
  })
}

function getUser(to, next) {
  if (localStorage.getItem('user-token')) {
    store
      .dispatch('user/fetchUser', localStorage.getItem('user-id'))
      .then(() => {
        next()
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  } else {
    next()
  }
}

function getCategories(to, next) {
  store.dispatch('category/fetchCategories').then(() => {
    next()
  })
}

export default {
  data() {
    return {
      selectPromo: null,
      selectMenu: 0,
      dialog: null,
      search: '',
      qtd: 1,
      qtdTotalItems: 0,
      selectinCategoryId: 0,
      itemToAdd: {
        id: null,
        name: null,
        price: null,
        price_promo: null,
        qtd_item: null,
        price_shipping: 0.0,
      },
    }
  },
  methods: {
    fillItem(item) {
      this.itemToAdd.id = item._id
      this.itemToAdd.name = item.name
      this.itemToAdd.price = item.price
      this.itemToAdd.price_promo = item.price_promo
    },
    selectCategory(id) {
      store.state.item.selectCategoryId = id
      store.dispatch('item/fetchItemsCategory', id)
    },
    removeQtd() {
      if (this.qtd > 1) {
        this.qtd--
      }
    },
    addQtd() {
      this.qtd++
    },
    addItemPedido() {
      this.dialog = false
      this.itemToAdd.qtd_item = this.qtd
      if (this.shipping.shipping.price != null) {
        this.itemToAdd.price_shipping = this.shipping.shipping.price
      }
      store.dispatch('order/addItemOrders', this.itemToAdd)
      this.qtd = 1
    },
  },
  beforeRouteEnter(to, from, next) {
    getUser(to, next)
    getItems(to, next)
    getCategories(to, next)
  },
  computed: {
    ...mapState(['item', 'user', 'category', 'order', 'shipping']),
    firstName() {
      if (this.user.user.name != null) {
        var name = this.user.user.name.split(' ')
        return name[0]
      }
      return ''
    },
    filteredItems() {
      return this.item.items.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
  },
}
</script>

<style>
.conteudo {
  padding: 70px 250px 70px 250px;
}

.header {
  display: flex;
  flex-direction: row;
}

.titulo {
  font-size: 18px !important;
}

.col-text-call {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.subtitulo {
  font-size: 16px !important;
  display: flex;
  flex-direction: row;
}

.line-promo {
  width: 100%;
  border-bottom: 2px solid #e2e2e2;
  margin-bottom: 10px !important;
  margin-left: 10px;
}

.subtitulo-promo {
  font-size: 10px !important;
}

.subtitulo-menu {
  font-size: 10px !important;
  margin-left: 2px !important;
}

.subtitulo-itens {
  font-size: 14px !important;
}

.image-menu {
  margin-right: 2px !important;
}

.col-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.paragrafo {
  font-size: 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 110px;
  margin-bottom: 0px !important;
}

.paragrafo-itens {
  font-size: 12px !important;
  padding-right: 10px;
  margin-top: 4px;
  color: #8b8b8b;
  margin-bottom: 0px !important;
}

.price-item-add {
  display: flex;
  flex-direction: row;
  margin-right: 14px;
  align-items: flex-end;
}

.price-item-promo {
  margin-bottom: -6px !important;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #b50202;
}

.price-item-old {
  margin-bottom: -5px !important;
  font-size: 12px;
  font-weight: 400;
  text-decoration: line-through;
  color: #8b8b8b;
}

.price-item {
  margin-bottom: -6px !important;
  font-size: 14px;
  font-weight: 700;
}

.btn-add {
  min-width: 0px !important;
  width: 20px;
  height: 20px !important;
  background-color: #ffc529 !important;
  padding: 0 8px !important;
  box-shadow: 1px 1px 4px #ffc529b3;
}

.old-price {
  font-size: 10px !important;
  margin-bottom: 0px !important;
  margin-right: 3px;
  text-decoration: line-through;
  color: #8b8b8b;
}

.new-price {
  font-size: 12px !important;
  margin-bottom: 0px !important;
  margin-left: 3px;
  font-weight: 700;
  color: #b50202;
}

.image {
  width: 48px;
  height: 50px;
  border-radius: 10px;
}
.coluna {
  text-align: center;
}

.search {
  border-radius: 10px;
  width: 90%;
  font-size: 14px !important;
}

.btnImg {
  border-radius: 10px;
  height: 48px !important;
  box-shadow: 0px 0px !important;
  min-width: 48px !important;
  padding: 0px !important;
}

.btnImgMob {
  border-radius: 10px;
  height: 48px !important;
  box-shadow: 0px 0px !important;
  min-width: 48px !important;
  padding: 0px !important;
  display: none;
}

.img-perfil {
  border-radius: 10px;
}

.btnFiltro {
  border-radius: 10px;
  height: 48px !important;
  box-shadow: 0px 0px !important;
  min-width: 48px !important;
}

.btnFiltro .v-icon.v-icon {
  font-size: 18px !important;
}

.btnFloat {
  position: absolute !important;
  bottom: 22px;
  background-color: #ffc529 !important;
  color: #000 !important;
  min-width: 0px !important;
  width: 54px !important;
  border-radius: 30px !important;
  z-index: 1;
}

.btnFloat .v-icon.v-icon {
  font-size: 22px !important;
}

.btnHome .v-icon.v-icon {
  font-size: 22px !important;
}

.btnEndereco {
  margin-right: 20px;
}

.btnEndereco .v-icon.v-icon {
  font-size: 22px !important;
}

.btnPedido {
  margin-left: 20px;
}

.btnPedido .v-icon.v-icon {
  font-size: 22px !important;
}

.btnConfig .v-icon.v-icon {
  font-size: 22px !important;
}

.card_promo {
  margin-right: 12px;
  box-shadow: 3px 3px 10px #0000001f;
  text-align: center;
  padding: 5px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.card_menu {
  margin-right: 12px;
  box-shadow: 0px 0px;
  border: solid 1px;
  border-color: #c4c4c48c !important;
  border-radius: 10px !important;
  display: flex;
  flex-direction: row;
  padding: 5px;
  align-items: center;
  justify-content: center;
}

.card-menu {
  margin-right: 12px;
  box-shadow: 0px 0px;
  border: solid 1px;
  border-color: #c4c4c48c !important;
  border-radius: 10px !important;
  display: flex;
  flex-direction: row;
  padding: 5px;
  align-items: center;
  justify-content: center;
}

.card-menu-select {
  margin-right: 12px;
  box-shadow: 0px 0px;
  border: solid 1px;
  border-radius: 10px !important;
  display: flex;
  flex-direction: row;
  padding: 5px;
  align-items: center;
  justify-content: center;
  background-color: #ffc529 !important;
  border-color: #ffc529 !important;
}

.card_menu:focus:before {
  opacity: 0;
}

.slideGroupCardPromo {
  height: 160px;
}

.slideGroupCardMenu {
  height: 40px;
}

.v-slide-group__next {
  justify-content: flex-end;
}

.v-slide-group__prev {
  justify-content: start;
}

.v-slide-group__next,
.v-slide-group__prev {
  min-width: 0px;
}

.theme--light.v-icon.v-icon.v-icon--disabled {
  color: rgba(0, 0, 0, 0.14) !important;
}

.card-itens {
  width: 100%;
  border-radius: 0px 10px 10px 10px !important;
  box-shadow: 3px 3px 10px #0000001f;
}

.col-image-itens {
  padding: 0px;
}

.col-info-itens {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

.image-itens {
  width: 200px;
  height: auto;
  border-radius: 0px 10px 10px 10px;
  margin-left: 12px;
}

.badge-basket .v-badge__badge {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #fff !important;
  border-radius: 10px;
  font-size: 9px;
  height: 13px;
  width: 13px;
  min-width: 0px;
  font-weight: 700;
  padding: 3px 3px;
}

.v-dialog {
  border-radius: 10px !important;
  border: 1px solid #e5e5e5;
  box-shadow: 2px 2px 2px #0000000d !important;
  margin-bottom: 100px !important;
}

.add-item {
  box-shadow: 0px 0px;
  border-radius: 10px;
}

.add-item-title {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding: 0px !important;
}

.header-card-add {
  display: flex;
  flex-direction: row;
}

.add-item-image {
  max-width: 248px !important;
}

.add-item-title h1 {
  font-size: 16px;
}

.add-item-text {
  font-size: 12px;
  text-align: center;
}

.add-item-actions {
  display: flex;
  flex-direction: column;
}

.add-item-btn {
  font-size: 12px !important;
  font-weight: 700;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  box-shadow: 3px 3px 10px #ffc52933;
}

.add-item-qtd {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.add-item-qtd-btn {
  background-color: #ffc529 !important;
  border-radius: 40px;
  padding: 0px !important;
  width: 10px;
  height: 18px !important;
  margin: 0px 10px;
  min-width: 18px !important;
  box-shadow: 1px 1px 4px #ffc529b3;
}

.v-dialog > .v-card > .v-card__text {
  padding: 0px !important;
}

.bottomNav {
  bottom: -1px !important;
  display: none !important;
}

/*--------------------------------------------------------------
# Responsive Media Queries
--------------------------------------------------------------*/
@media (max-width: 991px) {
  .conteudo {
    padding: 25px;
    padding-bottom: 70px;
  }
  .search {
    width: 80%;
  }
  .v-slide-group__next,
  .v-slide-group__prev {
    display: none;
  }
  .image-itens {
    width: 110px;
    border-radius: 0px 10px 10px 10px;
  }
  .paragrafo-itens {
    font-size: 10px !important;
    padding-right: 10px;
    margin-top: 2px;
    margin-bottom: 0px !important;
  }
  .col-info-itens {
    padding-left: 15px;
  }
  .topNav {
    display: none !important;
  }
  .bottomNav {
    bottom: -1px !important;
    display: flex !important;
  }
  .btnImgMob {
    display: block;
  }
}
</style>
