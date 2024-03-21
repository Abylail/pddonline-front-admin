<template>
  <div class="page user">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="goList()">К списку</v-btn>
      <h1 class="page__title" v-if="isNew">Создание пользователя</h1>
      <h1 class="page__title" v-else>Пользователь</h1>
      <v-spacer/>
      <v-btn color="primary" :loading="isLoading" small @click="saveHandle()">Сохранить</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "_id",
  data: () => ({
    isLoading: false,
  }),
  computed: {
    // Новый ли пользователь ?
    isNew() {
      return !this.$route.params.id;
    },

    userId() {
      return this.$route.params.id;
    }
  },
  methods: {
    goList() {
      this.$router.push("/admin/users")
    },

    saveHandle() {

    }
  }
}
</script>

<style scoped>

</style>
