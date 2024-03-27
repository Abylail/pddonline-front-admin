<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title">Личная информация</h1>
      <v-spacer/>
      <v-btn color="primary" :loading="isLoading" :disabled="!canSave" small @click="updateInfo()">Сохранить</v-btn>
    </div>

    <div class="relative-columns-2">
      <v-text-field
        label="Имя"
        v-model="info.user.first_name"
        outlined dense
      />
      <v-text-field
        label="Фамилия"
        v-model="info.user.last_name"
        outlined dense
      />
    </div>

    <div class="relative-columns-2">
      <base-phone-input
        label="Телефон"
        :value="info.user.phone_number"
        outlined dense
        disabled
      />
      <v-text-field
        label="Департамент"
        :value="`${info.department_full.name} (${info.department_full.address})`"
        outlined dense disabled
      />
    </div>

    <h2 class="page__subtitle">Адрес департамента - {{info.department_full.name}}</h2>

    <base-yandex-map
      v-if="info.department_full.location"
      :value="info.department_full.location"
      :editable="false"
    />
  </div>
</template>

<script>
import {mapActions} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";
import BaseYandexMap from "@/components/base/BaseYandexMap";

export default {
  name: "index",
  components: {BaseYandexMap, BasePhoneInput},
  data: () => ({
    isLoading: false,
    info: {user: {}, department_full: {}},
  }),
  computed: {
    canSave() {
      return !!this.info.user.first_name && !!this.info.user.last_name
    }
  },
  methods: {
    ...mapActions({
      _fetchInfo: "gbr/profile/fetchInfo",
      _updateInfo: "gbr/profile/updateInfo",
    }),

    async fetchInfo() {
      this.isLoading = true;
      this.info =  await this._fetchInfo()
      this.isLoading = false;
    },

    async updateInfo() {
      this.isLoading = true;
      this.info =  await this._updateInfo(this.info);
      this.isLoading = false;
    },
  },
  mounted() {
    this.fetchInfo();
  }
}
</script>

<style scoped>

</style>
