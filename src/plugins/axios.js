"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.VUE_APP_BACKEND_URL,
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.defaults.params = {};

let token = localStorage.getItem("token");

_axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

_axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

Vue.use({
  install(Vue) {
    Vue.prototype.$axios = _axios;
  },
});
