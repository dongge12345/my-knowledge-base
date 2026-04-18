import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default new Vuex.Store({
  state: {
    user: null,
    requestStatus: "idle",
    visitCount: 0,
    logs: []
  },
  getters: {
    isLogin(state) {
      return !!state.user;
    },
    statusText(state) {
      const map = {
        idle: "尚未触发 action",
        loading: "action 正在处理异步逻辑",
        success: "mutation 已提交，页面已联动更新"
      };
      return map[state.requestStatus];
    },
    logCount(state) {
      return state.logs.length;
    }
  },
  mutations: {
    addLog(state, message) {
      state.logs.unshift(message);
    },
    setRequestStatus(state, status) {
      state.requestStatus = status;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    increaseVisitCount(state) {
      state.visitCount += 1;
    },
    resetDemo(state) {
      state.user = null;
      state.requestStatus = "idle";
      state.visitCount = 0;
      state.logs = [];
    }
  },
  actions: {
    async fetchUser({ commit, state }) {
      commit("addLog", "1. dispatch('fetchUser') 进入 action");
      commit("setRequestStatus", "loading");
      commit("addLog", "2. action 开始模拟异步请求");

      await wait(600);

      const nextCount = state.visitCount + 1;
      const payload = {
        id: 1,
        name: "Vuex Demo User",
        role: "student",
        visitCount: nextCount,
      };

      commit("addLog", "3. action 请求完成，准备 commit('setUser')");
      commit("setUser", payload);
      commit("increaseVisitCount");
      commit("setRequestStatus", "success");
      commit("addLog", "4. mutation 已修改 state，依赖该 state 的组件开始联动更新");
    }
  }
});
