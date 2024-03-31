<template>
  <div class="page">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="$router.push(`/gbr/requests`)">Назад</v-btn>
      <h1 class="page__title">Заявка <span v-if="info">({{ statusDict[info.status] }})</span></h1>
    </div>

    <div v-if="info">
      <div class="relative-columns-2">
      <v-text-field
        v-if="info.author_comment"
        label="От клиента"
        :value="info.author_comment"
        outlined dense disabled
      />
      <v-text-field
        v-if="info.executor_comment"
        label="Комментарий"
        :value="info.executor_comment"
        outlined dense disabled
      />
      </div>
      <base-yandex-map
        :value="info.current_location"
        :editable="false"
        :search="false"
      />
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import BaseYandexMap from "@/components/base/BaseYandexMap";

export default {
  components: {BaseYandexMap},
  data: () => ({
    info: null,

    isLoading: false,

    interval: null,

    statusDict: {
      CREATED: "Примите заявку",
      IN_PROGRESS: "Выполняется",
      FINISHED: "Завершена",
    },
  }),
  computed: {
    requestId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions({
      _fetchInfo: "gbr/requests/fetchSingle",
    }),

    async fetchInfo() {
      this.isLoading = true;
      this.info = await this._fetchInfo(this.requestId);
      this.isLoading = false;
    }
  },
  mounted() {
    this.fetchInfo()
    this.interval = setInterval(() => this.fetchInfo(), 10000)
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.interval = null;
  }
}
</script>

<style scoped>

</style>
