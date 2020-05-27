<template>
  <v-app-bar color="#ffc529" class="topNav" fixed dark>
    <img
      class="img-perfil"
      width="auto"
      height="48"
      src="../assets/food_logo2.png"
    />
    <v-toolbar-title class="title-navbar">Delivery Food</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn :to="{ name: 'home' }" text class="btnTop">
      <v-icon :class="selectMenu == 0 ? 'icon-active' : 'icon-normal'"
        >mdi-home</v-icon
      >
      <span :class="selectMenu == 0 ? 'text-active' : 'text-normal'"
        >Inicio</span
      >
    </v-btn>

    <v-btn :to="{ name: 'endereco' }" text class="btnTop">
      <v-icon :class="selectMenu == 1 ? 'icon-active' : 'icon-normal'"
        >mdi-map-marker</v-icon
      >
      <span :class="selectMenu == 1 ? 'text-active' : 'text-normal'"
        >Endereço</span
      >
    </v-btn>

    <v-btn :to="{ name: 'acompanhar' }" text class="btnTop">
      <v-icon :class="selectMenu == 3 ? 'icon-active' : 'icon-normal'"
        >mdi-view-list</v-icon
      >
      <span :class="selectMenu == 3 ? 'text-active' : 'text-normal'"
        >Pedidos</span
      >
    </v-btn>

    <v-btn :to="{ name: 'pedido' }" text class="btnTop">
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
        <v-icon :class="selectMenu == 2 ? 'icon-active' : 'icon-normal'"
          >mdi-basket</v-icon
        >
      </v-badge>
      <span :class="selectMenu == 2 ? 'text-active' : 'text-normal'"
        >Carrinho</span
      >
    </v-btn>

    <v-btn class="btnImg" :to="{ name: 'perfil' }" color="#ffc529"
      ><img
        v-show="user.user.url_image"
        class="img-perfil"
        width="auto"
        height="40"
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
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
    selectMenu() {
      if (this.$route.name == 'home') return 0
      if (this.$route.name == 'endereco') return 1
      if (this.$route.name == 'pedido') return 2
      if (this.$route.name == 'acompanhar') return 3
      if (this.$route.name == 'perfil') return 4
      return 0
    },
  },
}
</script>

<style>
.topNav {
  padding: 0 235px;
  box-shadow: 0px 2px 5px #00000033 !important;
}

.topNav .v-btn__content {
  flex-direction: column;
}

.topNav .v-btn__content .icon-normal {
  font-size: 20px !important;
  text-shadow: 3px 3px 10px #00000059;
}

.topNav .v-btn__content .text-normal {
  text-transform: initial;
  text-shadow: 3px 3px 10px #00000059;
}

.topNav .v-btn__content .icon-active {
  font-size: 20px !important;
  color: #000 !important;
}

.topNav .v-btn__content .text-active {
  text-transform: initial;
  font-weight: bold;
  color: #000;
}

.title-navbar {
  margin-left: 10px;
  font-weight: bold;
  color: #000;
}

.theme--dark.v-btn--active:hover::before,
.theme--dark.v-btn--active::before {
  opacity: 0 !important;
}

.theme--dark.v-btn:hover::before {
  opacity: 0;
}

@media (max-width: 991px) {
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
