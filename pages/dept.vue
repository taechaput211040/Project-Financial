<template>
  <div class="container">
    <loading-page v-if="isLoading"></loading-page>
    <h2>รายงานหนี้เสีย</h2>
    <div>
      <search-filter-report
        @search="searchdata(dateFilter.inputfilter)"
        :searchinput="false"
        :filter="dateFilter"
      ></search-filter-report>
    </div>
    <div class="mt-3">
      <v-card class="mt-3">
        <v-data-table
          :server-items-length="items.meta ? items.meta.itemCount : 0"
          :options.sync="options"
          :footer-props="{
            showFirstLastPage: true,
            'items-per-page-text': '',
            'items-per-page-options': [10, 25, 50, 100]
          }"
          :headers="headers"
          :items="items.data"
        >
          <template #[`item.no`]="{ index }">
            {{ options.itemsPerPage * (options.page - 1) + (index + 1) }}
          </template>
          <template #[`item.income_expense`]="{ item }">
            <h4 v-if="item.income_expense" class="primary--text">รายรับ</h4>
            <h4 v-else class="error--text">รายจ่าย</h4>
          </template>

          <template #[`item.detail_record`]="{ item }">
            <v-btn
              color="black"
              dark
              small
              rounded
              @click="handleOpendetail(item)"
              >รายละเอียด</v-btn
            >
            <v-btn
              color="black"
              dark
              small
              rounded
              @click="handleOpenHistory(item)"
              >ประวัติการชำระ</v-btn
            >
          </template>
          <template #[`item.created_at`]="{ item }">
            {{ item.created_at | dateFormat }}
          </template>
          <template #[`item.due_date`]="{ item }">
            {{ item.due_date | dateFormat }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip small outlined v-if="item.status" color="success"
              ><v-icon left>mdi-circle</v-icon> สำเร็จ</v-chip
            >
            <v-chip small outlined v-else text color="error"
              ><v-icon left>mdi-circle</v-icon>ไม่สำเร็จ</v-chip
            >
          </template>
        </v-data-table>
        <v-dialog v-model="dlTransaction">
          <v-card>
            <v-card-title class="justify-center font-weight-bold" primary-title>
              <h3>ประวัติการชำระยอดหนี้เสีย</h3>
            </v-card-title>
            <!-- {{ transactionList }} -->
            <v-data-table
              :headers="headersTransaction"
              :items="transactionList"
              disable-pagination
              hide-default-footer
            >
              <template #[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template #[`item.created_at`]="{ item }">
                {{ item.created_at | dateFormat }}
              </template>
              <template #[`item.status`]="{ item }">
                <v-chip small outlined v-if="item.status" color="success"
                  ><v-icon left>mdi-circle</v-icon>ชำระครบยอดแล้ว</v-chip
                >
                <v-chip small outlined v-else text color="error"
                  ><v-icon left>mdi-circle</v-icon>ชำระยังไม่ครบ</v-chip
                >
              </template>
            </v-data-table>
            <v-card-actions class="justify-center">
              <v-btn color="error" @click="dlTransaction = false">ปิด</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isDetail">
          <v-card class="pa-3"
            ><v-form ref="formCreate">
              <v-card-title primary-title class="justify-center">
                <div v-if="!isEdit" class="primary--text">
                  สร้างรายการรายรับ/รายจ่าย
                </div>
                <h2 v-else>
                  <v-chip
                    class="mx-2"
                    label
                    v-if="itemrecord.income_expense"
                    color="primary"
                    >รายรับ</v-chip
                  ><v-chip class="mx-2" color="error" v-else label
                    >รายจ่าย</v-chip
                  >
                  : {{ itemrecord.record }}
                </h2>
              </v-card-title>
              <div class="row my-2">
                <div class="col-12 col-sm-6 col-md-4  elevation-2">
                  <h4 class="text-center my-2">
                    รายละเอียดทั่วไป
                  </h4>
                  <div class="row">
                    <div class="col-12">
                      <v-select
                        :items="itemincome_expense"
                        v-model="itemrecord.income_expense"
                        label="รายรับ/รายจ่าย"
                        disabled
                        hide-details="auto"
                        dense
                        outlined
                      ></v-select>
                    </div>
                    <div class="col-12">
                      <v-text-field
                        v-model="itemrecord.record"
                        hide-details="auto"
                        dense
                        disabled
                        outlined
                        label="รายการ"
                      ></v-text-field>
                    </div>
                    <div class="col-12">
                      <v-textarea
                        v-model="itemrecord.record_detail"
                        outlined
                        hide-details="auto"
                        disabled
                        label="รายละเอียดรายการ"
                      ></v-textarea>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        v-model="itemrecord.amount"
                        hide-details="auto"
                        dense
                        disabled
                        outlined
                        label="จำนวน"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        outlined
                        v-model="itemrecord.actual_amount"
                        disabled
                        label="ชำระแล้ว"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.company"
                        disabled
                        outlined
                        label="บริษัท"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model.trim="itemrecord.due_date"
                            label="วันกำหนดชำระเงิน"
                            prepend-icon="mdi-calendar"
                            readonly
                            disabled
                            v-bind="attrs"
                            v-on="on"
                            dense
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model.trim="itemrecord.due_date"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4 elevation-2">
                  <h4 class="text-center my-2">
                    รายละเอียดค่ารายการ
                  </h4>
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.monthly_fee"
                        disabled
                        outlined
                        label="ค่าบริการรายเดือน"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.feature"
                        disabled
                        outlined
                        label="ค่าฟีเจอ"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        disabled
                        dense
                        v-model="itemrecord.winlose"
                        outlined
                        label="ค่าwinlose"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.regis_domain"
                        disabled
                        outlined
                        label="ค่าจดโดเมน"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.credit_purchase"
                        disabled
                        outlined
                        label="ค่าเครดิต"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.setup_auto"
                        disabled
                        outlined
                        label="ค่าแรกเข้าระบบออโต้"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.wage"
                        disabled
                        outlined
                        label="ค่าทำของ"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.copyright"
                        outlined
                        disabled
                        label="ค่าลิขสิทธิ์"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.rental"
                        disabled
                        outlined
                        label="ค่าเช่า"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.facility"
                        disabled
                        outlined
                        label="ค่าน้ำค่าไฟ ค่าจอดรถ"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.cloud"
                        disabled
                        outlined
                        label="ค่าคลาว"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.salary"
                        disabled
                        outlined
                        label="ค่าแรง"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        disabled
                        dense
                        v-model="itemrecord.commission"
                        outlined
                        label="ค่าคอม"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        disabled
                        dense
                        v-model="itemrecord.outsource"
                        outlined
                        label="outsource"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        disabled
                        dense
                        v-model="itemrecord.incentive"
                        outlined
                        label="incentive"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.tax"
                        outlined
                        disabled
                        label="ภาษี"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.social_tax"
                        outlined
                        disabled
                        label="ประกันสังคม"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model="itemrecord.others"
                        disabled
                        outlined
                        label="อื่นๆ"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <label for="loss">ยอดหนี้เสีย</label>
                      <v-text-field
                        v-if="itemrecord.loss_dept"
                        hide-details="auto"
                        v-model="itemrecord.loss_dept_balance"
                        outlined
                        id="loss"
                        dense
                        disabled
                      ></v-text-field>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-4 elevation-2">
                  <h4 class="text-center my-2">
                    รูป บิล หรือ หลักฐาน
                  </h4>

                  <div class="pa-5 text-center">
                    <img :src="image" alt="" class="img_show" />
                  </div>
                </div>
              </div>

              <v-card-actions class="justify-center">
                <!-- <v-btn color="primary" @click="handlecreateRecords"
                  >บันทึกรายการ</v-btn
                > -->
                <v-btn color="error" @click="handleCloseDialog">close</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import SearchFilterReport from "../components/SearchFilterReport.vue";
import LoadingPage from "../components/LoadingPage.vue";
import th from "dayjs/locale/th";
export default {
  components: { SearchFilterReport, LoadingPage },
  data() {
    return {
      headersTransaction: [
        {
          text: "ลำดับ",
          value: "no",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "รายการ",
          value: "record_name",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "เวลาบันทึกยอด",
          value: "created_at",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "บันทึกยอดโดย",
          value: "operator",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "จำนวนยอดหนี้เสียที่จ่าย",
          value: "dept_payout",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "success--text font-weight-bold"
        },
        {
          text: "ยอดหนี้เสียคงเหลือ",
          value: "dept_balance",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "primary--text font-weight-bold"
        },
        {
          text: "หมายเหตุ",
          value: "remark",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "สถานะ",
          value: "status",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        }
      ],
      dlTransaction: false,
      transactionList: [],
      isLoading: false,
      menu: false,
      imageUpload: {},
      image: "",
      itemincome_expense: [
        { text: "รายรับ", value: true },
        { text: "รายจ่าย", value: false }
      ],
      isEdit: true,
      itemrecord: {
        income_expense: true,
        due_date: undefined
      },
      options: {
        itemsPerPage: 10,
        page: 1
      },
      isDetail: false,
      dlStatus: false,
      items: [],
      headers: [
        {
          text: "รายการ",
          value: "no",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "รายรับ/รายจ่าย",
          value: "income_expense",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "รายการ",
          value: "record",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },

        {
          text: "จำนวน",
          value: "amount",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "ชำระแล้ว",
          value: "actual_amount",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "การดำเนินการ",
          value: "detail_record",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },

        {
          text: "วันที่และเวลาที่ชำระ/ลงบันทึก",
          value: "created_at",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "วันที่",
          value: "due_date",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "สถานะ",
          value: "status",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        },
        {
          text: "บริษัท",
          value: "company",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          cellClass: "font-weight-bold"
        }
      ],
      dateFilter: {
        inputfilter: "",
        startDate: dayjs()
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: dayjs()
          .endOf("month")
          .format("YYYY-MM-DD"),
        options: "company"
      }
    };
  },
  watch: {
    options() {
      this.$fetch();
    }
  },
  async fetch() {
    this.isLoading = true;
    let params = await this.getParameter();
    try {
      let { data } = await this.$store.dispatch("getRecordsByDept", params);
      this.items = data;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  },
  methods: {
    async handleOpenHistory(item) {
      this.isLoading = true;
      try {
        let { data } = await this.$store.dispatch(
          "getTransactionDeptloss",
          item.id
        );
        this.transactionList = data;
        this.isLoading = false;
        this.dlTransaction = true;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
    },
    searchdata(input = null, option = null) {
      let params = this.getParameter();
      params.keyword = input;
      params.options = option;
      this.$fetch();
    },

    getParameter() {
      let parameter = {
        take: this.options.itemsPerPage,
        page: this.options.page,
        start: this.dateFilter.startDate,
        end: this.dateFilter.endDate,
        options: this.dateFilter.options,
        keyword: this.dateFilter.inputfilter
      };
      return parameter;
    },
    async handleOpendetail(item) {
      this.itemrecord = { ...item };
      this.isDetail = true;
      this.itemrecord.due_date = dayjs(this.itemrecord.due_date).format(
        `YYYY-MM-DD`
      );
      this.image = this.itemrecord.bill_image;
      this.isEdit = true;
    },

    handleCloseDialog() {
      this.$refs.formCreate.reset();
      this.image = "";
      this.isDetail = false;
      this.isEdit = false;
    }
  }
};
</script>

<style></style>
