<template>
  <div class="container">
    <loading-page v-if="isLoading"></loading-page>
    <h2>รายงานรายเดือน</h2>
    <div>
      <div class="row pa-3">
        <div class="col-12 col-sm-4 ">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                solo
                label="เลือกเดือน"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                hide-details="auto"
                dense
                outlined
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="th"
              v-model="date"
              type="month"
              @input="$refs.menu.save(date)"
            >
            </v-date-picker>
          </v-menu>
        </div>
        <div class="col-12 col-sm-4">
          <v-btn color="success" @click="search()">ค้นหา</v-btn>
        </div>
      </div>
    </div>
    <h2 class="my-3">{{ getdateRendering(this.date) }}</h2>
    <div>
      <div class="row">
        <div class="col-12 col-sm-3">
          <card-main
            :iconshow="false"
            titleclass="success--text"
            title="รายรับทั้งหมด"
            :value="result.all_income"
          ></card-main>
        </div>
        <div class="col-12 col-sm-3">
          <card-main
            :iconshow="false"
            titleclass="error--text"
            title="รายจ่ายทั้งหมด"
            :value="result.all_expense"
          ></card-main>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-6">
          <v-card>
            <v-card-title primary-title class="primary--text font-weight-bold">
              ค่าบริการต่อดือน
            </v-card-title>
            <div class="row pa-3">
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าบริการรายเดือน"
                  :value="result.monthly_fee"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าwinlose + ค่าเครดิต"
                  :value="result.winlose"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าแรกเข้าระบบออโต้"
                  :value="result.setup_auto"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าทำของ"
                  :value="result.wage"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าฟีเจอ + ค่าจดโดเมน + อื่นๆ"
                  :value="result.other"
                ></card-report>
              </div>
            </div>
          </v-card>
        </div>
        <div class="col-12 col-sm-6">
          <v-card>
            <v-card-title primary-title class="purple--text font-weight-bold">
              ค่าใช้จ่ายที่เกี่ยวข้อง
            </v-card-title>
            <div class="row pa-3">
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าลิขสิทธิ์"
                  :value="result.copyright"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าเช่า,ค่าน้ำค่าไฟ,ค่าจอดรถ "
                  :value="result.rental"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าคลาว"
                  :value="result.cloud"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ค่าแรง + ค่าคอม + Outsource + incentive"
                  :value="result.salary"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="ภาษี + อื่นๆ"
                  :value="result.other"
                ></card-report>
              </div>
              <div class="col-6">
                <card-report
                  :iconshow="false"
                  title="หนี้เสีย"
                  :value="result.loss_dept"
                ></card-report>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
require("dayjs/locale/th");
import CardReport from "../components/CardReport.vue";
import CardMain from "../components/CardMain.vue";
import LoadingPage from "../components/LoadingPage.vue";
export default {
  components: { CardReport, CardMain, LoadingPage },
  data() {
    return {
      isLoading: false,
      result: {},
      date: new Date().toISOString().substr(0, 7),
      menu: false
    };
  },
  async fetch() {
    await this.search();
  },
  methods: {
    getParameter() {
      let params = {
        month: dayjs(this.date).month(),
        year: dayjs(this.date).year()
      };
      return params;
    },
    getdateRendering() {
      let month = dayjs(this.date)
        .locale("th")
        .format("MMMM ปี YYYY");
      return `รายงานสรุปของเดือน ${month} `;
    },
    async search() {
      this.isLoading = true;
      let params = this.getParameter();
      try {
        let { data } = await this.$store.dispatch("getReportMonthly", params);
        this.result = data;
        console.log(data);
        this.isLoading = false;
      } catch (error) {
        this.$swal({
          icon: "error",
          title: `ไม่พบข้อมูลของเดือนที่ต้องการค้นหา`,
          showConfirmButton: false,
          timer: 1500
        });
        this.isLoading = false;
      }
    }
  }
};
</script>

<style></style>
