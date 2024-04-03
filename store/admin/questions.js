export const state = () => ({
  // Список вопросов
  list: null,
})

export const getters = {
  getList: state => state.list || [],
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  async fetchList({ commit, state }, hard = false) {
    if (!hard && state.list) return;
    await this.$api.$get("/admin/question/getList")
      .then(({err, body}) => {
        if (!err) commit("set", ["list", body]);
      })
  }
}
