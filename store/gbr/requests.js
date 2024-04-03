export const state = () => ({
  // Список запросов
  list: null,
})

export const getters = {
  getList: state => state.list || [],
}

export const mutations = {
  setList(state, value) {
    state.list = value;
  }
}

export const actions = {
  // Запросить список запросов
  async fetchList({ commit }) {
    await this.$api.$get("/emergency/calls/")
      .then((response) => {
        if (!response.err) {
          commit("setList", response.results);
        }
      })
  },

  // Запросить запрос по id
  fetchSingle({}, id) {
    return new Promise(resolve => {
      this.$api.$get(`/emergency/calls/${id}/`)
        .then((response) => {
          if (!response.err) resolve(response);
          else resolve(null);
        })
    })
  },

  // Принять
  async acceptRequest({rootGetters, dispatch}, {id}) {
    const {pk} = await dispatch("gbr/profile/fetchInfo", null, {root: true})
    await this.$api.$put(`/emergency/calls/${id}/`, {executor: pk, status: "IN_PROGRESS"})
      .then((response) => {
        if (!response.err) {
          this.$toast.success("Заявку принята");
          this.$router.push(`/gbr/requests/edit/${id}`)
        }
        else this.$toast.error("Ошибка принятия")
      })
  },

  // Принять
  async finishRequest({rootGetters, dispatch}, {id, comment}) {
    const {pk} = await dispatch("gbr/profile/fetchInfo", null, {root: true})
    await this.$api.$put(`/emergency/calls/${id}/`, {executor: pk, status: "GBR_CONFIRMED", executor_comment: comment})
      .then((response) => {
        if (!response.err) {
          this.$toast.success("Заявка завершена");
          this.$router.push(`/gbr/requests/edit/${id}`)
        }
        else this.$toast.error("Ошибка завершения")
      })
  },

  // создать запрос (возвращает успешно ли)
  createRequest({ commit }, {user}) {
    return new Promise(resolve => {
      this.$api.$post("/emergency/calls/", user)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },

  // создать запрос (возвращает успешно ли)
  updateUser({ commit }, {user, id}) {
    return new Promise(resolve => {
      this.$api.$put(`/emergency/calls/${id}/`, user)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },

  getClient({ commit }, id) {
    return new Promise(resolve => {
      this.$api.$get(`/clients/${id}/`)
        .then((response) => {
          resolve(response.user);
        })
    })
  },
}
