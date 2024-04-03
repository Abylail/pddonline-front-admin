<template>
  <div class="page">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="$router.push(`/admin/questions`)">К вопросам</v-btn>
      <div class="page__title" v-if="isNew">Создание вопроса</div>
      <div class="page__title" v-else>Редактирование вопроса</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isNew() {
      return !this.$route.params.id;
    }
  }
}
</script>

<style scoped>

</style>
