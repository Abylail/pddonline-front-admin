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
    await this.$api.$get("/api/v1/emergency/departments/")
      .then((response) => {
        if (!response.err) {
          console.log(response)
        }
      })
  }
}
