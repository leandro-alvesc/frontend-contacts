import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    currentUser: null,
  },
  getters: {
    token: (state) => state.token,
    currentUser: (state) => state.currentUser,
    isAuthenticated: (state) => !!state.currentUser,
  },
  mutations: {
    setToken(state, token) {
      token
        ? localStorage.setItem("token", token)
        : localStorage.removeItem("token");
      state.token = token;
      this._vm.$axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },
  actions: {
    authenticate({ commit }, login) {
      const auth = {
        username: login.username,
        password: login.password,
      };
      return this._vm.$axios
        .post("auth/login", {}, { auth: auth })
        .then(({ data }) => {
          commit("setToken", data.token);
          return Promise.resolve(data.token);
        })
        .catch(({ response }) => {
          return Promise.reject(response.data.code);
        });
    },
    logout({ commit }) {
      commit("setToken", null);
    },
    getCurrentUser({ commit }) {
      return this._vm.$axios
        .get("users/me")
        .then(({ data }) => {
          commit("setCurrentUser", data);
          return Promise.resolve(data);
        })
        .catch(({ response }) => {
          return Promise.reject(response.data.code);
        });
    },
  },
});
