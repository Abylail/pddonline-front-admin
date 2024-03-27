<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title">Запросы</h1>
      <v-btn color="primary" small outlined @click="$router.push(`/admin/requests/edit`)">Добавить запрос +</v-btn>
    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data: () => ({
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      list: "admin/requests/getList",
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/requests/fetchList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    goUser(req) {
      this.$router.push(`/admin/requests/edit/${req.id}`)
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped>

</style>
