<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title">Список пользователей</h1>
      <v-btn color="primary" small outlined @click="$router.push(`/admin/users/edit`)">Добавить пользователя +</v-btn>
    </div>

    <v-data-table
      class="toys__table elevation-1"
      :headers="tableHeaders"
      :items="list"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
      @click:row="goUser($event)"
    >
      <template  v-slot:item.fio="{ item }">
        <span v-if="item.user">{{ item.user?.last_name }} {{ item.user?.first_name }}</span>
      </template>
      <template  v-slot:item.department="{ item }">
        <span v-if="item.department">{{ item.department_full?.name }} ({{ item.department_full?.location?.address }})</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "index",
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: 'ФИО', value: 'fio', sortable: false},
      { text: 'Номер', value: 'user.phone_number', sortable: false},
      { text: 'Департамент', value: 'department', sortable: false},
    ]
  }),
  computed: {
    ...mapGetters({
      list: "admin/users/getList"
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/users/fetchList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    goUser(user) {
      this.$router.push(`/admin/users/edit/${user.pk}`)
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped>

</style>
