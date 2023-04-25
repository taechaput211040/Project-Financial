import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      key: localStorage.getItem("key") || "",
      user: localStorage.getItem("username") || null
    },
    actions: {
      async getRecords({}, params) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record`,
              { params }
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async getRecordsByDept({}, params) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record/Dept`,
              { params }
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async getCompanylist() {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Company`
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },

      async getReportMonthly({}, param) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record/Monthly/${param.month}/${param.year}`
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async actionLogin(context, { username, password }) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.post(
              `${process.env.ALL_FINANCIAL_API}/api/Auth/accounting/Login`,
              {
                username,
                password
              }
            );
            context.commit("set_login", response.data);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async createRecords(context, body) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.post(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record`,
              body
            );

            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async updateRecords(context, body) {
        console.log(body, "body");
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.put(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record/${body.id}`,
              body
            );

            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async getUser(context) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/user`
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async createUser(context, body) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.post(
              `${process.env.ALL_FINANCIAL_API}/api/Auth/accounting/register`,
              { ...body, status: true }
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async updateUser(context, body) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.put(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/user/${body.id}`,
              { ...body }
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      },
      async getCompanylist(context) {
        return new Promise(async (resolve, reject) => {
          try {
            let response = await this.$axios.get(
              `${process.env.ALL_FINANCIAL_API}/accounting/api/Record/Company`
            );
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      }
    },
    mutations: {
      set_login(state, payload) {
        const { token, username } = payload;
        state.key = token;
        state.user = username;
        localStorage.setItem("key", token);
        localStorage.setItem("username", username);
      }
    }
  });
  return Store;
}
