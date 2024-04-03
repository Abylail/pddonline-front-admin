<template>
  <div class="page">
    <div class="page__head">
      <div class="page__title">Вопросы</div>
      <v-btn color="primary" small outlined @click="$router.push(`/admin/questions/edit`)">Добавить вопрос +</v-btn>
    </div>

    <v-data-table
      class="elevation-1"
      :headers="tableHeaders"
      :items="list"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
      @click:row="goQuestion($event)"
    >
      <template  v-slot:item.title="{ item }">
        <span>{{ item?.title_ru?.substring(0, 30) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "questions",
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: 'Вопрос', value: 'title', sortable: false},
    ]
  }),
  computed: {
    ...mapGetters({
      list: "admin/questions/getList",
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/questions/fetchList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    goQuestion(question) {
      this.$router.push(`/admin/questions/edit/${question.id}`)
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped>

</style>
