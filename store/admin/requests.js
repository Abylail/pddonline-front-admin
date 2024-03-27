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
          commit("setList", response);
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
}