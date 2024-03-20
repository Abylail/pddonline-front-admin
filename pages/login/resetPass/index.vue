<template>
  <div class="login-page" @keyup.enter="loginHandle()">

    <v-card class="login-page__card">
      <v-card-title>Введите номер</v-card-title>
      <div class="login-page__main">

        <!-- phone -->
        <base-phone-input
          label="Телефон"
          v-model="phone"
          ref="phoneInput"
          outlined
        />

        <v-btn color="primary" :loading="isLoading" block @click="loginHandle()">Отправить</v-btn>

        <div class="login-page__registration">
          <nuxt-link to="/login">Войти</nuxt-link>
        </div>

      </div>
    </v-card>

  </div>
</template>

<script>
import {mapActions} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";
export default {
  name: "index",
  components: {BasePhoneInput},
  layout: "empty",
  data: () => ({
    phone: "",
    password: "",
    showPassword: false,
    isLoading: false,

    authData: {
      phone: null,
      password: null,
    },

    errors: {
      phone: null,
      password: null,
    },
  }),
  methods: {
    ...mapActions({

    }),
    validate() {

    },
    async loginHandle() {

    }
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;

  &__card {
    margin: auto;
    padding: 20px;
    width: 90%;
    max-width: 350px;
  }

  &__registration {
    margin-top: 10px;
    text-align: center;
  }

}
</style>
