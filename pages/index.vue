<template>
  <div class="container">
    <loading-page v-if="isLoading"></loading-page>
    <h2>รายรับ-รายจ่าย</h2>
    <div>
      <search-filter-report
        @search="searchdata(dateFilter.inputfilter)"
        :searchinput="true"
        :filter="dateFilter"
      ></search-filter-report>
    </div>
    <div class="mt-3">
      <v-btn small color="primary" @click="openDetail()"
        ><v-icon left>mdi-plus</v-icon> เพิ่มรายการ</v-btn
      >
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
              >ดูและเเก้ไขรายละเอียด</v-btn
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

        <v-dialog v-model="isDetail" persistent>
          <v-card class="pa-3"
            ><v-form ref="formCreate">
              <v-card-title primary-title class="justify-center">
                <div v-if="!isEdit" class="primary--text">
                  สร้างรายการรายรับ/รายจ่าย
                </div>
                <div v-else>
                  <v-chip
                    small
                    class="mx-2"
                    label
                    v-if="itemrecord.income_expense"
                    color="primary"
                    >รายรับ</v-chip
                  ><v-chip class="mx-2" color="error" v-else label
                    >รายจ่าย</v-chip
                  >
                  : {{ itemrecord.record }}
                </div>
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
                        hide-details="auto"
                        :disabled="isEdit"
                        dense
                        outlined
                      ></v-select>
                    </div>
                    <div class="col-12">
                      <v-text-field
                        v-model="itemrecord.record"
                        hide-details="auto"
                        dense
                        outlined
                        :rules="[v => !!v || 'กรุณากรอกชื่อรายการ']"
                        label="รายการ"
                      ></v-text-field>
                    </div>
                    <div class="col-12">
                      <v-textarea
                        v-model="itemrecord.record_detail"
                        outlined
                        hide-details="auto"
                        label="รายละเอียดรายการ"
                        :rules="[v => !!v || 'กรุณากรอกรายละเอียดรายการ']"
                      ></v-textarea>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        :value="sumamount() | numberFormat"
                        hide-details="auto"
                        disabled
                        filled
                        dense
                        outlined
                        label="จำนวน"
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6">
                      <v-text-field
                        v-if="!itemrecord.income_expense"
                        hide-details="auto"
                        dense
                        outlined
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.actual_amount"
                        label="ชำระแล้ว"
                      ></v-text-field>
                    </div>
                    <div class="col-12 ">
                      <v-tabs v-model="tab">
                        <v-tab>เลือกรายชื่อบริษัท</v-tab>
                        <v-tab>เพิ่มรายชื่อบริษัท</v-tab>
                      </v-tabs>

                      <v-tabs-items v-model="tab">
                        <v-tab-item class="pa-2">
                          <v-select
                            outlined
                            clearable
                            v-model="itemrecord.company"
                            dense
                            item-value="company"
                            hide-details="auto"
                            label="เลือกรายชื่อบริษัทที่มีอยู่"
                            item-text="company"
                            :items="companyList"
                          ></v-select></v-tab-item
                        ><v-tab-item class="pa-2"
                          ><v-text-field
                            hide-details="auto"
                            dense
                            v-model="itemrecord.company"
                            outlined
                            label="เพิ่มชื่อบริษัทใหม่"
                            :rules="[v => !!v || 'กรุณากรอกชื่อบริษัท']"
                          ></v-text-field
                        ></v-tab-item>
                      </v-tabs-items>
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
                            v-bind="attrs"
                            v-on="on"
                            dense
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :rules="[v => !!v || 'กรุณาเลือกวันกำหนดชำระ']"
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
                    <div class="col-12 col-sm-6  py-1">
                      ค่าบริการรายเดือน
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model.number="itemrecord.monthly_fee"
                        :disabled="isLoseDept"
                        outlined
                        type="number"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6  py-1">
                      ค่าฟีเจอร์
                      <v-text-field
                        hide-details="auto"
                        type="number"
                        dense
                        v-model.number="itemrecord.feature"
                        outlined
                        :disabled="isLoseDept"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6  py-1">
                      ค่าwinlose
                      <v-text-field
                        hide-details="auto"
                        dense
                        v-model.number="itemrecord.winlose"
                        type="number"
                        outlined
                        :disabled="isLoseDept"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6  py-1">
                      ค่าจดโดเมน
                      <v-text-field
                        hide-details="auto"
                        type="number"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.regis_domain"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6  py-1">
                      ค่าเครดิต
                      <v-text-field
                        hide-details="auto"
                        type="number"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.credit_purchase"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12 col-sm-6  py-1">
                      ค่าแรกเข้าระบบออโต้
                      <v-text-field
                        type="number"
                        :disabled="isLoseDept"
                        hide-details="auto"
                        dense
                        v-model.number="itemrecord.setup_auto"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าทำของ
                      <v-text-field
                        hide-details="auto"
                        type="number"
                        :disabled="isLoseDept"
                        dense
                        v-model.number="itemrecord.wage"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าลิขสิทธิ์
                      <v-text-field
                        type="number"
                        :disabled="isLoseDept"
                        hide-details="auto"
                        dense
                        v-model.number="itemrecord.copyright"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าเช่า
                      <v-text-field
                        type="number"
                        :disabled="isLoseDept"
                        hide-details="auto"
                        dense
                        v-model.number="itemrecord.rental"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าน้ำค่าไฟ ค่าจอดรถ
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.facility"
                        type="number"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าคลาวน์
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.cloud"
                        type="number"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าแรง
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.salary"
                        type="number"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ค่าคอม
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.commission"
                        outlined
                        type="number"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      outsource
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.outsource"
                        outlined
                        type="number"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      incentive
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.incentive"
                        type="number"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ภาษี
                      <v-text-field
                        hide-details="auto"
                        dense
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.tax"
                        outlined
                        type="number"
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      ประกันสังคม
                      <v-text-field
                        hide-details="auto"
                        dense
                        type="number"
                        :disabled="isLoseDept"
                        v-model.number="itemrecord.social_tax"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div class="col-12  col-sm-6 py-1">
                      อื่นๆ
                      <v-text-field
                        hide-details="auto"
                        type="number"
                        :disabled="isLoseDept"
                        dense
                        v-model.number="itemrecord.others"
                        outlined
                        label=""
                      ></v-text-field>
                    </div>
                    <div
                      class="col-12"
                      v-if="!itemrecord.income_expense && isEdit"
                    >
                      <div class="d-flex align-center">
                        <v-checkbox
                          hide-details
                          :disabled="isLoseDept"
                          v-model="itemrecord.loss_dept"
                          outlined
                          id="loss"
                          dense
                        ></v-checkbox>
                        <label for="loss" class="my-2">
                          ยอดหนี้เสียที่ต้องชำระคงเหลือ:
                          {{ currentLossdept | numberFormat }}</label
                        >
                      </div>
                      <v-text-field
                        v-if="itemrecord.loss_dept"
                        hide-details="auto"
                        v-model.number="amountLossdepttopay"
                        type="number"
                        outlined
                        dense
                        label="ชำระยอดหนี้เสีย"
                      ></v-text-field>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-4 elevation-2">
                  <h4 class="text-center my-2">
                    รูป บิล หรือ หลักฐาน
                  </h4>

                  <v-file-input
                    label="File input"
                    outlined
                    dense
                    hide-details="auto"
                    accept="image/png, image/jpeg, image/jpg , image/webp"
                    @change="inputImage"
                  ></v-file-input>
                  <v-alert dense text type="warning" class="ma-3"
                    ><h3>
                      เมื่อแก้ไขภาพหรืออัพโหลดภาพใหม่กรุณากดปุ่ม upload
                      ด้านล่างทุกครั้ง
                    </h3>
                  </v-alert>
                  <div class="text-center mt-2">
                    <v-btn small class="primary" @click="handleUploadImage"
                      >upload ภาพ</v-btn
                    >
                  </div>

                  <div class="pa-5 text-center">
                    <img :src="image" alt="" class="img_show" />
                  </div>
                </div>
              </div>

              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="handlecreateRecords"
                  >บันทึกรายการ</v-btn
                >
                <v-btn color="error" @click="handleCloseDialog">ปิด</v-btn>
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
      tab: null,
      toggle_exclusive: 0,
      companyList: [],
      amountLossdepttopay: 0,
      currentLossdept: 0,
      isLoseDept: false,
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
        record: "",
        record_detail: "",
        due_date: undefined,
        amount: 0,
        monthly_fee: 0,
        feature: 0,
        winlose: 0,
        regis_domain: 0,
        credit_purchase: 0,
        setup_auto: 0,
        wage: 0,
        copyright: 0,
        rental: 0,
        facility: 0,
        cloud: 0,
        salary: 0,
        commission: 0,
        outsource: 0,
        incentive: 0,
        tax: 0,
        social_tax: 0,
        others: 0
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
          class: "font-weight-bold"
        },
        {
          text: "รายรับ/รายจ่าย",
          value: "income_expense",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "รายการ",
          value: "record",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },

        {
          text: "จำนวน",
          value: "amount",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "ชำระแล้ว",
          value: "actual_amount",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "ยอดหนี้เสีย",
          value: "loss_dept_balance",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "Action",
          value: "detail_record",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },

        {
          text: "วันที่และเวลาที่ชำระ/ลงบันทึก",
          value: "created_at",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "วันที่กำหนดชำระ",
          value: "due_date",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "สถานะ",
          value: "status",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "บริษัท",
          value: "company",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
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
    },
    tab(val) {
      if (val) {
        this.itemrecord.company = null;
      }
    }
  },
  async fetch() {
    await this.getCompany();
    this.isLoading = true;
    let params = await this.getParameter();
    try {
      let { data } = await this.$store.dispatch("getRecords", params);
      this.items = data;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  },
  methods: {
    async getCompany() {
      let { data } = await this.$store.dispatch("getCompanylist");
      this.companyList = data;
    },
    sumamount() {
      let amount = 0;
      amount =
        this.itemrecord.monthly_fee +
        this.itemrecord.feature +
        this.itemrecord.winlose +
        this.itemrecord.regis_domain +
        this.itemrecord.credit_purchase +
        this.itemrecord.setup_auto +
        this.itemrecord.wage +
        this.itemrecord.copyright +
        this.itemrecord.rental +
        this.itemrecord.facility +
        this.itemrecord.cloud +
        this.itemrecord.salary +
        this.itemrecord.commission +
        this.itemrecord.outsource +
        this.itemrecord.incentive +
        this.itemrecord.tax +
        this.itemrecord.social_tax +
        this.itemrecord.others;

      this.itemrecord.amount = Number(amount);
      return Number(amount);
    },
    searchdata(input = null, option = null) {
      this.isLoading = true;
      let params = this.getParameter();
      params.keyword = input;
      params.options = option;
      this.$fetch();
    },
    openDetail() {
      this.isEdit = false;
      this.isDetail = true;
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
      this.isLoseDept = this.itemrecord.loss_dept;
      this.currentLossdept =
        this.itemrecord.amount - this.itemrecord.actual_amount;
      this.amountLossdepttopay = 0;
      this.isEdit = true;
    },

    async inputImage(value) {
      if (value) this.image = URL.createObjectURL(value);
      let formData = new FormData();
      formData.append("file", value);
      this.imageUpload = formData;
    },
    async handleUploadImage() {
      try {
        let { data } = await this.$axios.post(
          `https://static-template-api-qlws7pv5wa-as.a.run.app/image/file/image/smart`,
          this.imageUpload
        );
        console.log(data.image, "response");
        this.itemrecord.bill_image = data.image;
        this.$swal({
          icon: "success",
          title: "อัพโหลดรูปภาพเสร็จสิ้น",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async handlecreateRecords() {
      if (this.$refs.formCreate.validate()) {
        this.$swal({
          title: `ต้องการ${this.isEdit ? "แก้ไข" : "สร้าง"}รายการหรือไม่ ?`,
          icon: "question",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `${this.isEdit ? "แก้ไข" : "สร้าง"}`,
          cancelButtonText: "ยกเลิก"
        }).then(async result => {
          if (result.isConfirmed) {
            try {
              if (!this.isEdit) {
                await this.$store.dispatch("createRecords", this.itemrecord);
              } else if (this.isEdit) {
                this.itemrecord.loss_dept_balance = this.amountLossdepttopay;
                await this.$store.dispatch("updateRecords", this.itemrecord);
              }

              this.$swal({
                icon: "success",
                title: `${
                  this.isEdit ? "แก้ไข" : "สร้าง"
                }รายการรายรับ/รายจ่ายสำเร็จ`,
                allowOutsideClick: false,
                showConfirmButton: false,
                timer: 1500
              }).then(async result => {
                if (result) {
                  await this.handleCloseDialog();
                  await this.$fetch();
                }
              });
            } catch (error) {
              console.log(error);
              this.handleCloseDialog();
            }
          }
        });
      }
    },
    handleCloseDialog() {
      this.$refs.formCreate.resetValidation();
      this.itemrecord = {
        income_expense: true,
        record: "",
        record_detail: "",
        due_date: undefined,
        amount: 0,
        monthly_fee: 0,
        feature: 0,
        winlose: 0,
        regis_domain: 0,
        credit_purchase: 0,
        setup_auto: 0,
        wage: 0,
        copyright: 0,
        rental: 0,
        facility: 0,
        cloud: 0,
        salary: 0,
        commission: 0,
        outsource: 0,
        incentive: 0,
        tax: 0,
        social_tax: 0,
        others: 0
      };
      this.image = "";
      this.isLoseDept = false;
      this.isDetail = false;
      this.isEdit = false;
    }
  }
};
</script>

<style></style>
