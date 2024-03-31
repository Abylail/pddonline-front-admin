<template>
  <div class="page requests">
    <div class="page__head">
      <h1 class="page__title">Заявки</h1>
      <v-btn color="primary" small outlined @click="$router.push(`/gbr/requests/edit`)">Добавить пользователя +</v-btn>
    </div>

    <div class="requests__list">
      <v-card
        class="requests__item"
        :class="{'requests__item--warn': request.status === 'CREATED'}"
        v-for="request in requests" :key="request.id"
        @click="goRequest(request)"
      >
        <v-card-title>{{ statusDict[request.status] }} {{ request.createdAt | dateTimeFormat }}</v-card-title>
        <v-card-subtitle>
          <div v-if="request.author_comment">Клиент: {{ request.author_comment }}</div>
          <div v-if="request.executor_comment">От исполнителя: {{ request.executor_comment }}</div>
        </v-card-subtitle>

        <v-card-text v-if="request.status === 'CREATED'">
          <base-yandex-map
            :value="request.current_location"
            :editable="false"
            :search="false"
          />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BaseYandexMap from "@/components/base/BaseYandexMap";

export default {
  name: "index",
  components: {BaseYandexMap},
  data: () => ({
    isLoading: false,

    statusDict: {
      CREATED: "Примите заявку",
      IN_PROGRESS: "Выполняется",
      FINISHED: "Завершена",
    },
  }),
  computed: {
    ...mapGetters({
      requests: "gbr/requests/getList",
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "gbr/requests/fetchList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    goRequest(request) {
      this.$router.push(`/gbr/requests/edit/${request.id}`)
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.requests {

  &__item {
    margin: 12px 0;

    &--warn {
      background-color: #380808;
    }
  }

}
</style>
