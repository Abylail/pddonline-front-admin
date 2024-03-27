export const state = () => ({
  // Список департаментов
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
  // Запросить список департаментов
  async fetchList({ commit }) {
    await this.$api.$get("/rescuers/")
      .then((response) => {
        if (!response.err) {
          commit("setList", response);
        }
      })
  },

  // Запросить департамент по id
  fetchSingle({}, id) {
    return new Promise(resolve => {
      this.$api.$get(`/rescuers/${id}/`)
        .then((response) => {
          if (!response.err) resolve(response);
          else resolve(null);
        })
    })
  },

  // Запросить создать департамент (возвращает успешно ли)
  createUser({ commit }, {user}) {
    return new Promise(resolve => {
      this.$api.$post("/rescuers/register/", user)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },

  // Запросить создать департамент (возвращает успешно ли)
  updateUser({ commit }, {user, id}) {
    return new Promise(resolve => {
      this.$api.$put(`/rescuers/${id}/`, user)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },
}
