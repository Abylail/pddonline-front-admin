<template>
  <div class="page requests">
    <div class="page__head">
      <h1 class="page__title">Заявки</h1>
    </div>

    <div class="requests__list">
      <v-card
        class="requests__item"
        :class="{'requests__item--warn': isCreated(request)}"
        v-for="request in requests" :key="request.id"
        @click="goRequest(request)"
      >
        <v-card-title>
          <div>{{ statusDict[request.status] }} {{ request.createdAt | dateTimeFormat }}</div>
          <v-spacer/>
          <v-btn v-if="!request.executor || isCreated(request)" color="primary" @click.stop="acceptRequest(request)">Принять</v-btn>
          <v-btn v-if="!request.executor || isClientFinished(request)" color="primary" @click.stop="goFinishRequest(request)">Перейти к завершению</v-btn>
        </v-card-title>
        <v-card-subtitle>
          <div v-if="request.author_comment">Клиент: {{ request.author_comment }}</div>
          <div v-if="request.executor_comment">От исполнителя: {{ request.executor_comment }}</div>
        </v-card-subtitle>

        <v-card-text v-if="!isFinished(request)">
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
      CLIENT_CONFIRMED: "Клиент завершил",
      GBR_CONFIRMED: "Завершена",
      ADMIN_CONFIRMED: "Завершена",
      FINISHED: "Завершена",
    },

    interval: null,
  }),
  computed: {
    ...mapGetters({
      requests: "gbr/requests/getList",
    }),
  },
  methods: {
    ...mapActions({
      _fetchList: "gbr/requests/fetchList",
      _acceptRequest: "gbr/requests/acceptRequest",
    }),

    // Принять
    acceptRequest(request) {
      this.isLoading = true;
      this._acceptRequest({id: request.id});
      this.isLoading = false;
    },

    goFinishRequest(request) {
      this.$router.push(`/gbr/requests/edit/${request.id}?finish=true`)
    },

    isCreated(request) {
      return request.status === "CREATED";
    },

    isClientFinished(request) {
      return request.status === "CLIENT_CONFIRMED";
    },

    isFinished(request) {
      return ["GBR_CONFIRMED", "ADMIN_CONFIRMED", "FINISHED"].includes(request.status);
    },

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
    this.interval = setInterval(() => this.fetchList(), 10000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
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
