<template>
  <div class="page">
    <div class="page__head">
      <v-btn color="primary" small outlined @click="$router.push(`/gbr/requests`)">Назад</v-btn>
      <h1 class="page__title">Заявка <span v-if="info">({{ statusDict[info.status] }})</span></h1>
      <v-spacer/>
      <v-btn v-if="canFinish" color="primary" small @click.stop="startFinishRequest()">Перейти к завершению</v-btn>
    </div>

    <v-card :loading="isClientLoading">
      <v-card-title>Клиент</v-card-title>
      <v-card-text>
        <div>{{ client.first_name }} {{ client.last_name }}</div>
        <div>{{ client.phone_number }}</div>
      </v-card-text>
    </v-card>

    <div v-if="info" class="mt-5">
      <div class="relative-columns-2">
      <v-text-field
        v-if="info.author_comment"
        label="От клиента"
        :value="info.author_comment"
        outlined dense disabled
      />
      <v-text-field
        v-if="info.executor_comment"
        label="Комментарий от исполнителя"
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

    <!-- Модалка для завершения -->
    <v-dialog v-model="finishing" width="400">
      <v-card>
        <v-card-title>Завершение</v-card-title>
        <v-card-text>
          <v-textarea
            label="Комментарий"
            v-model="finishComment"
            outlined
            no-resize
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" outlined>Отмена</v-btn>
          <v-btn color="primary" :disabled="!finishComment" @click="finishRequest()">Завершить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    isClientLoading: false,

    interval: null,

    client: {},

    finishComment: null,

    statusDict: {
      CREATED: "Примите заявку",
      IN_PROGRESS: "Выполняется",
      CLIENT_CONFIRMED: "Клиент завершил",
      GBR_CONFIRMED: "Завершена",
      ADMIN_CONFIRMED: "Завершена",
      FINISHED: "Завершена",
    },
  }),
  computed: {
    requestId() {
      return this.$route.params.id;
    },

    finishing: {
      get() {
        return this.$route.query.finish === "true";
      },
      set(val) {
        if (val) this.$router.replace({query: {...this.$route.query, finish: "true"}})
        else {
          this.finishComment = null;
          this.$router.replace({query: {...this.$route.query, finish: undefined}});
        }
      }
    },

    // Можно завершить
    canFinish() {
      return this.info?.status === "CLIENT_CONFIRMED";
    },
  },
  methods: {
    ...mapActions({
      _fetchInfo: "gbr/requests/fetchSingle",
      _getClient: "gbr/requests/getClient",
      _finishRequest: "gbr/requests/finishRequest",
    }),

    // Перейти к закрытию
    startFinishRequest() {
      this.finishing = true;
    },

    // Закрыть запрос
    async finishRequest() {
      this.isLoading = true;
      await this._finishRequest({id: this.requestId, comment: this.finishComment})
      await this.fetchInfo();
      this.finishing = false;
      this.isLoading = false;
    },

    async fetchInfo() {
      this.isLoading = true;
      this.info = await this._fetchInfo(this.requestId);
      this.isLoading = false;
    },

    async getClient(authorId = this.info.author) {
      this.isClientLoading = true;
      this.client = await this._getClient(authorId);
      this.isClientLoading = false;
    }
  },
  async mounted() {
    await this.fetchInfo();
    this.getClient()
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
