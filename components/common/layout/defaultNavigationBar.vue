<template>
  <v-navigation-drawer app :value="open" :permanent="$device.isDesktop" @input="$emit('input:open', $event)">

    <!-- USER CARD -->
    <v-sheet class="pa-4">
      <div class="navigation-bar__avatar">
      <v-avatar class="mr-2" color="primary" size="48">
        <span class="white--text">{{ userFullName[0] }}</span>
      </v-avatar>
        <div>
          <div class="navigation-bar__name">{{ userFullName }}</div>
          <div class="navigation-bar__role">Админ</div>
        </div>
      </div>
    </v-sheet>

    <!-- LINKS -->
    <v-list>
      <v-list-item
        v-for="({icon, name, route}, index) in links"
        :key="index"
        :to="route"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "defaultNavigationBar",
  props: {
    open: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "auth/getUserInfo",
    }),

    userFullName() {
      if (this.userInfo?.first_name || this.userInfo?.last_name) return `${this.userInfo.first_name} ${this.userInfo.last_name}`
      return "Неизвестный"
    },

    links() {
      return [
        { icon: "mdi-account-circle", name: "Вопросы", route: "/admin/questions"},
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.navigation-bar {

  &__avatar {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-column-gap: 10px;
  }

  &__name {
    padding-top: 10px;
  }

  &__role {
    font-size: 14px;
    color: $color--gray;
  }

}
</style>
