import {rolesDict} from "~/config/roleDict";

export const state = () => ({

  // Информация юзера
  userInfo: null,

  accessToken: null,
  refreshToken: null,

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
    await this.$api.$post("/users/auth/login-staff/", {number, password})
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
  async tokenAuth({ commit, dispatch, getters }) {
    if (!getters.getToken) {
      commit("set", ["accessToken", this.$cookies.get("accessToken")]);
      commit("set", ["refreshToken", this.$cookies.get("refreshToken")]);
    }

    await this.$api.$get("/users/profile/")
      .then(response => {
        if (!response.err) {
          let userInfo = null;
          if (Array.isArray(response)) userInfo = response.find(u => u.role === rolesDict.admin.code)
          else userInfo = response;
          commit("set", ["userInfo", userInfo]);
        }
        else {
          dispatch("logout");
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
