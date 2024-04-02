<template>
  <div class="page departments">
    <div class="page__head">
      <h1 class="page__title">Список департаментов</h1>
      <v-btn color="primary" small outlined @click="$router.push(`/admin/departments/edit`)">Добавить департамент +</v-btn>
    </div>

    <v-data-table
      class="toys__table elevation-1"
      :headers="tableHeaders"
      :items="list"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
      @click:row="goDepart($event)"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "index",
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: 'Название', value: 'name', sortable: false},
      { text: 'Адрес', value: 'location.address', sortable: false},
    ]
  }),
  computed: {
    ...mapGetters({
      list: "admin/departments/getList",
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/departments/fetchList",
    }),

    // Получить список
    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    goDepart(dep) {
      this.$router.push(`/admin/departments/edit/${dep.id}`)
    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.departments {}
</style>
