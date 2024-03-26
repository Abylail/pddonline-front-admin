import {rolesDict} from "~/config/roleDict";

export const state = () => ({

  // Информация юзера
  userInfo: null,

  accessToken: null,
  refreshToken: null,

  checkTimeout: null,
})

export const getters = {

  // Авторизован ли пользователь
  isAuth: state => !!state.userInfo,

  getUserInfo: state => state.userInfo,

  getRole: state => state.userInfo?.role,

  isAdmin: state => state.userInfo?.role === rolesDict.admin.code,

  // Токен доступа
  getToken: state => state.accessToken,

  // Получить телефон
  getPhone: state => state.userInfo?.phone_number || null,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  setCheckTimeout(state, timeout) {
    clearTimeout(state.checkTimeout);
    state.checkTimeout = timeout;
  },
  setProperty(state, [namespace, propertyNamespace, value]) {
    let newObject = state[namespace] || {};
    newObject[propertyNamespace] = value;
    state[namespace] = newObject;
  }
}

export const actions = {
  // Логин через username ang password
  async login({ commit, dispatch, getters }, {number, password}) {
    if (!number || !password) return;
    await this.$api.$post("/rescuers/login/", {number, password})
      .then(({err, access, refresh}) => {
        if (!err) {
          commit("set", ["userInfo", {phone_number: number}]);
          commit("set", ["accessToken", access]);
          commit("set", ["refreshToken", refresh]);
          this.$cookies.set("accessToken", access);
          this.$cookies.set("refreshToken", refresh);
        }
      })
    if (getters.isAuth) await dispatch("tokenAuth")
  },

  // Логин через token
  tokenAuth({ commit, dispatch, getters, state }, refreshOnError = true) {
    return new Promise(resolve => {

      if (!getters.getToken) {
        commit("set", ["accessToken", this.$cookies.get("accessToken")]);
        commit("set", ["refreshToken", this.$cookies.get("refreshToken")]);
      }

      if (!state.accessToken) resolve(false);

      this.$api.$get("/users/profile/")
        .then(async response => {
          if (!response.err) {
            // Успех
            let userInfo = null;
            if (Array.isArray(response)) userInfo = response.find(u => u.role === rolesDict.admin.code)
            else userInfo = response;
            commit("set", ["userInfo", userInfo]);
            resolve(true);
            commit("setCheckTimeout", setTimeout(() => dispatch("tokenAuth"), 10000));
          }
          else if (refreshOnError) {
            await dispatch("refreshToken")
            resolve(await dispatch("tokenAuth", false))
          }
          else {
            // Ошибка
            dispatch("logout");
            resolve(false);
          }
        })

    })
  },

  // Обновить токен
  async refreshToken({state, commit}) {
    const refresh = state.refreshToken || this.$cookies.get("refreshToken");
    if (!refresh) return;
    await this.$api.$post("/users/auth/refresh-token/", {refresh})
      .then(({err, access, refresh}) => {
        if (!err) {
          commit("set", ["accessToken", access]);
          commit("set", ["refreshToken", refresh]);
          this.$cookies.set("accessToken", access);
          this.$cookies.set("refreshToken", refresh);
        }
      })
  },

  // Выход
  logout({ commit }) {
    commit("set", ["userInfo", null]);
    commit("set", ["accessToken", null]);
    commit("set", ["refreshToken", null]);
    this.$cookies.remove("accessToken");
    this.$cookies.remove("refreshToken");
    this.$router.push("/login")
  },

  // Информация пользователя
  async saveUserInfo({ commit, state }, {last_name, first_name}) {
    await this.$api.$put("/api/v1/admin/user/update", {auth_token: state.userToken, last_name, first_name})
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Данные пользователя обновленны");
          commit("setProperty", ["userInfo", "last_name", last_name]);
          commit("setProperty", ["userInfo", "first_name", first_name]);
        }
      })
  },
}
