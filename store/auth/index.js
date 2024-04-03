export const state = () => ({

  // Информация юзера
  userInfo: null,

  // Токен авторизации
  accessToken: null,
})

export const getters = {

  // Авторизован ли пользователь
  isAuth: state => !!state.userInfo,

  getUserInfo: state => state.userInfo,

  // Токен авторизации
  getToken: state => state.accessToken,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
}

export const actions = {
  // Логин через username ang password
  async login({ commit, dispatch, getters }, {phone, password}) {
    if (!phone || !password) return;
    await this.$api.$post("/admin/user/login", {phone, password})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", {...body}]);
          commit("set", ["accessToken", body.token]);
          this.$cookies.set("userToken", body.token);
        }
      })
  },

  // Логин через token
  tokenAuth({ commit, dispatch, getters, state }) {
    return new Promise(resolve => {

      if (!getters.getToken) {
        commit("set", ["accessToken", this.$cookies.get("userToken")]);
      }

      if (!state.accessToken) resolve(false);

      this.$api.$get("/admin/user/login/token")
        .then(({err, body}) => {
          if (!err) {
            commit("set", ["userInfo", body]);
            resolve(true);
          }
          else {
            // Ошибка
            dispatch("logout");
            resolve(false);
          }
        })

    })
  },

  // Выход
  logout({ commit }) {
    commit("set", ["userInfo", null]);
    commit("set", ["accessToken", null]);
    this.$cookies.remove("userToken");
    this.$router.push("/login")
  },
}
