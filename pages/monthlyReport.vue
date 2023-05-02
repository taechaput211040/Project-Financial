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
      <div class="row pa-3">
        <div class="col-12 col-sm-4 ">
          <card-main
            :iconshow="false"
            title="รายรับ"
            titleclass="success--text"
            :value="result.all_income"
          ></card-main>
        </div>
        <div class="col-12 col-sm-4 ">
          <card-main
            :iconshow="false"
            title="รายจ่าย"
            titleclass="pink--text"
            :value="result.all_expense"
          ></card-main>
        </div>
        <div class="col-12 col-sm-4 ">
          <card-main
            :iconshow="false"
            title="ยอดหนี้เสีย"
            titleclass="warning--text"
            :value="result.loss_dept"
          ></card-main>
        </div>
      </div>
      <div class="row pa-3">
        <div class="col-12 col-sm-4">
          <v-card class="card-child  rounded-xl elevation-5">
            <v-card-title primary-title class="font-weight-bold">
              รายรับ/รายจ่าย
            </v-card-title>
            <div class="pa-3">
              <VueApexCharts
                type="pie"
                ref="realtimeChart"
                :options="chartOptions"
                :series="series"
                height="400"
                @dataPointSelection="dataPointSelectionHandler"
              ></VueApexCharts>
            </div>
          </v-card>
        </div>

        <div class="col-12 col-sm-8">
          <v-card class="card-child  rounded-xl elevation-5">
            <v-card-title primary-title class="font-weight-bold">
              รายละเอียดรายการ : {{ pointIndex }}
            </v-card-title>
            <VueApexCharts
              width="100%"
              ref="realtimeChartRecord"
              height="400"
              :options="chartOptionsRecord"
              :series="seriesRender"
            ></VueApexCharts>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import dayjs from "dayjs";
require("dayjs/locale/th");
import CardReport from "../components/CardReport.vue";
import CardMain from "../components/CardMain.vue";
import LoadingPage from "../components/LoadingPage.vue";
import th from "dayjs/locale/th";
export default {
  components: { CardReport, CardMain, LoadingPage, VueApexCharts },
  data() {
    return {
      isLoading: false,
      result: {},
      pointIndex: null,
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      series: [44, 55],
      chartOptions: {
        chart: {
          width: 380,
          type: "pie"
        },

        colors: ["#539952", "#E91E63"],
        labels: ["รายรับ", "รายจ่าย"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      },
      chartOptionsRecord: {
        chart: {
          type: "bar",
          height: 350
        },

        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true
          }
        },

        dataLabels: {
          enabled: false
        },
        fill: {
          colors: ["#F44336"]
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        tooltip: {
          style: {
            color: "white"
          }
        }
      },
      seriesRender: [
        {
          name: "จำนวน",
          data: []
        }
      ]
    };
  },

  async fetch() {
    await this.search();
  },
  methods: {
    dataPointSelectionHandler(event, chartContext, config) {
      const indexPoint = config.dataPointIndex;
      if (indexPoint == 0) {
        this.pointIndex = "รายรับ";
        this.seriesRender[0].data = [
          {
            x: "ค่าบริการรายเดือน",
            y: this.result.monthly_fee
          },
          {
            x: "ค่าwinlose + ค่าเครดิต",
            y: this.result.winlose
          },
          {
            x: "ค่าแรกเข้าระบบออโต้",
            y: this.result.setup_auto
          },
          {
            x: "ค่าทำของ",
            y: this.result.wage
          },
          {
            x: "ค่าฟีเจอ + ค่าจดโดเมน + อื่นๆ",
            y: this.result.other
          }
        ];
        this.chartOptionsRecord.fill.colors[0] = "#539952";
      } else if (indexPoint == 1) {
        this.pointIndex = "รายจ่าย";
        this.seriesRender[0].data = [
          {
            x: "ค่าลิขสิทธิ์",
            y: this.result.copyright
          },
          {
            x: "ค่าเช่า,ค่าน้ำค่าไฟ,ค่าจอดรถ",
            y: this.result.rental
          },
          {
            x: "ค่าคลาว",
            y: this.result.cloud
          },
          {
            x: "ค่าแรง + ค่าคอม + Outsource + incentive",
            y: this.result.salary
          },
          {
            x: "ภาษี + อื่นๆ",
            y: this.result.other
          }
        ];
        this.chartOptionsRecord.fill.colors[0] = "#E91E63";
      }
      this.$refs.realtimeChartRecord.updateSeries(
        this.seriesRender,
        false,
        true
      );
    },
    mapChartRendering(item) {
      this.series = [item.all_income, item.all_expense];
      this.$refs.realtimeChart.updateSeries(this.series, false, true);
    },
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
    getOrder() {
      console.log("gettetet");
    },
    async search() {
      this.isLoading = true;
      let params = this.getParameter();
      try {
        let { data } = await this.$store.dispatch("getReportMonthly", params);
        this.result = data;
        await this.mapChartRendering(data);
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
