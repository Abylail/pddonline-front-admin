<template>
  <div class="page department">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="goList()">К списку</v-btn>
      <h1 class="page__title" v-if="isNew">Создание департамента</h1>
      <h1 class="page__title" v-else>Департамент</h1>
      <v-spacer/>
      <v-btn color="primary" :loading="isLoading" :disabled="!canSave" small @click="saveHandle()">Сохранить</v-btn>
    </div>

    <div class="relative-columns-2">
      <v-text-field
        label="Название"
        v-model="department.name"
        outlined dense
      />
      <v-text-field
        label="Адрес"
        v-model="department.address"
        outlined dense
      />
    </div>

    <base-yandex-map
      v-model="department.location"
    />
  </div>
</template>

<script>
import {mapActions} from "vuex";
import BaseYandexMap from "~/components/base/BaseYandexMap";

export default {
  name: "index",
  components: {BaseYandexMap},
  data: () => ({
    department: {},
    isLoading: false
  }),
  computed: {
    // Новый ли департамент ?
    isNew() {
      return !this.$route.params.id;
    },

    departmentId() {
      return this.$route.params.id;
    },

    // Можно ли сохранять (валидвция)
    canSave() {
      return this.department?.location && this.department?.name &&  this.department?.address;
    }
  },
  methods: {
    ...mapActions({
      _fetch: "admin/departments/fetchSingle",
      _createDepartment: "admin/departments/createDepartment",
      _updateDepartment: "admin/departments/updateDepartment",
    }),

    goList() {
      this.$router.push(`/admin/departments`)
    },

    // Сохранить (кнопка)
    async saveHandle() {
      this.isLoading = true;
      let success = false;
      if (!this.isNew) success = this._updateDepartment({department: this.department, id: this.departmentId})
      else success = this._createDepartment({department: this.department})

      if (success) {
        this.$toast.success("Департамент сохранен");
        this.goList();
      }
      else {
        this.$toast.error("Департамент не сохранен");
      }

      this.isLoading = false;
    },

    async fetchInfo() {
      this.isLoading = true;
      if (this.isNew) this.department = {};
      else this.department = await this._fetch(this.departmentId);
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
