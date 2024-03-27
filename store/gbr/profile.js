// export const state = () => ({
//   // Получить информацию
//   info: null,
// })
//
// export const getters = {
//   getInfo: state => state.list || [],
// }
//
// export const mutations = {
//   setInfo(state, value) {
//     state.info = value;
//   }
// }

export const actions = {
  // Запросить информацию
  fetchInfo({}) {
    return new Promise(resolve => {
      this.$api.$get(`/rescuers/profile/`)
        .then((response) => {
          if (!response.err) resolve(response);
          else resolve(null);
        })
    })
  },

  // Запросить информацию
  async updateInfo({dispatch}, info) {
    await this.$api.$put(`/rescuers/profile/`, info)
      .then((response) => {
        if (!response.err) this.$toast.success("Ваша информация обновленна")
        else this.$toast.error("Ваша информация не обновленна")
      })
    return await dispatch("fetchInfo")
  },
}
