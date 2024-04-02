<template>
  <div class="page user">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="goList()">К списку</v-btn>
      <h1 class="page__title" v-if="isNew">Создание пользователя</h1>
      <h1 class="page__title" v-else>Пользователь</h1>
      <v-spacer/>
      <v-btn color="primary" :loading="isLoading" :disabled="!canSave" small @click="saveHandle()">Сохранить</v-btn>
    </div>

    <h2 class="page__subtitle">Данные пользователя</h2>

    <div class="relative-columns-2">
      <!-- phone -->
      <base-phone-input
        label="Телефон"
        v-model="rescuer.user.phone_number"
        outlined dense
      />
      <v-text-field
        label="Новый пароль"
        v-model="rescuer.user.password"
        outlined dense
      />
    </div>

    <div class="relative-columns-2">
      <v-text-field
        label="Имя"
        v-model="rescuer.user.first_name"
        outlined dense
      />
      <v-text-field
        label="Фамилия"
        v-model="rescuer.user.last_name"
        outlined dense
      />
    </div>

    <h2 class="page__subtitle">Департамент</h2>

    <v-autocomplete
      v-model="rescuer.department"
      :items="departments"
      :item-text="d => `${d.name} (${d.location?.address})`"
      item-value="id"
      dense outlined
      label="Департамент"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";

const defaultRescuer = {user: {}}
export default {
  components: {BasePhoneInput},
  data: () => ({
    isLoading: false,
    rescuer: JSON.parse(JSON.stringify(defaultRescuer)),
  }),
  computed: {
    ...mapGetters({
      departments: "admin/departments/getList"
    }),

    // Новый ли пользователь ?
    isNew() {
      return !this.$route.params.id;
    },

    userId() {
      return this.$route.params.id;
    },

    // Можно ли сохранять
    canSave() {
      if (!this.rescuer.user?.phone_number || this.rescuer.user?.phone_number.length !== 11) return false;
      if (this.isNew && !this.rescuer.user?.password) return false;
      if (!this.rescuer.department) return false;
      return true;
    },
  },
  methods: {
    ...mapActions({
      _fetch: "admin/users/fetchSingle",
      _updateRescuer: "admin/users/updateUser",
      _createRescuer: "admin/users/createUser",
      _fetchDepartments: "admin/departments/fetchList",
    }),

    goList() {
      this.$router.push("/admin/users")
    },

    saveHandle() {
      this.isLoading = true;
      let success = false;
      if (!this.isNew) success = this._updateRescuer({user: this.rescuer, id: this.userId})
      else success = this._createRescuer({user: this.rescuer})

      if (success) {
        this.$toast.success("Пользователь сохранен");
        setTimeout(() => this.goList(), 500)
      }
      else {
        this.$toast.error("Пользователь не сохранен");
      }

      this.isLoading = false;
    },

    async fetchInfo() {
      this.isLoading = true;
      if (this.isNew) this.rescuer = JSON.parse(JSON.stringify(defaultRescuer));
      else this.rescuer = await this._fetch(this.userId);
      await this._fetchDepartments();
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
