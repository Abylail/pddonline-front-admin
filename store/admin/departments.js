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
    await this.$api.$get("/rescuers/departments/")
      .then((response) => {
        if (!response.err) {
          commit("setList", response);
        }
      })
  },

  // Запросить департамент по id
  fetchSingle({}, id) {
    return new Promise(resolve => {
      this.$api.$get(`/rescuers/departments/${id}/`)
        .then((response) => {
          if (!response.err) resolve(response);
          else resolve(null);
        })
    })
  },

  // Запросить создать департамент (возвращает успешно ли)
  createDepartment({ commit }, {department}) {
    return new Promise(resolve => {
      this.$api.$post("/rescuers/departments/", department)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },

  // Запросить создать департамент (возвращает успешно ли)
  updateDepartment({ commit }, {department, id}) {
    return new Promise(resolve => {
      this.$api.$put(`/rescuers/departments/${id}/`, department)
        .then((response) => {
          resolve(!response.err);
        })
    })
  },
}
