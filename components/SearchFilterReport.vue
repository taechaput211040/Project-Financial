<template>
  <v-card width="100%" class="elevation-4 pa-5 rounded-lg">
    <v-row>
      <v-col cols="12" md="6" lg="6">
        <v-row>
          <v-col cols="12">
            <v-row align="baseline">
              <p class="font-weight-bold">เริ่ม</p>
              <v-col cols="11">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="filter.startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      v-model="filter.startDate"
                      label="จากวันที่ :"
                      prepend-icon="mdi-calendar"
                      readonly
                      hide-details="auto"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model.trim="filter.startDate"
                    :max="filter.endDate"
                    no-title
                    scrollable
                    locale="th"
                    @input="$refs.menu.save(filter.startDate)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row align="baseline">
              <p class="font-weight-bold">ถึง</p>
              <v-col cols="11">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="filter.endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filter.endDate"
                      label="ถึงวันที่"
                      dense
                      outlined
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details="auto"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model.trim="filter.endDate"
                    no-title
                    scrollable
                    :min="filter.startDate"
                    locale="th"
                    @input="$refs.menu2.save(filter.endDate)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row> </v-col
        ></v-row> </v-col
      ><v-divider vertical class="display-mb"></v-divider>
      <v-col cols="12" md="6" lg="6">
        <v-row>
          <v-col cols="8" md="8" v-if="searchinput == true">
            <v-select
              label="ตัวเลือกการค้นหา"
              dense
              v-model.trim="filter.options"
              outlined
              clearable
              :items="optional"
              hide-details="auto"
            ></v-select
          ></v-col>
          <v-col cols="8" md="8" v-if="searchinput == true && filter.options">
            <v-text-field
              v-if="filter.options == 'operator'"
              :label="
                `ค้นหาด้วย ${
                  optional.find(x => x.value === filter.options).text
                }`
              "
              placeholder="กรอกคำค้นหา"
              dense
              v-model.trim="filter.inputfilter"
              outlined
              clearable
              hide-details="auto"
            ></v-text-field>
            <v-select
              v-else-if="filter.options == 'status'"
              outlined
              clearable
              dense
              :items="statuslist"
              v-model="filter.inputfilter"
              label="สถานะ"
            ></v-select>
            <v-menu
              v-else-if="filter.options == 'due_date'"
              ref="menu3"
              v-model="menu3"
              :close-on-content-click="false"
              :return-value.sync="filter.inputfilter"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.inputfilter"
                  label="เลือกวันครบกำหนดชำระ"
                  dense
                  outlined
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hide-details="auto"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model.trim="filter.inputfilter"
                no-title
                scrollable
                locale="th"
                @input="$refs.menu3.save(filter.inputfilter)"
              >
              </v-date-picker>
            </v-menu>
            <v-select
              v-if="filter.options == 'company'"
              outlined
              clearable
              dense
              item-value="company"
              label="เลือกรายชื่อบริษัท"
              item-text="company"
              :items="companyList"
              v-model="filter.inputfilter"
            ></v-select>
          </v-col>
          <v-col
            cols="4"
            md="3"
            class="d-flex"
            :class="{ aligncclass: searchinput == false }"
          >
            <v-btn color="primary" @click="search()">
              <v-icon left dark> mdi-magnify </v-icon>
              ค้นหา</v-btn
            ></v-col
          >
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import dayjs from "dayjs";
import th from "dayjs/locale/th";

export default {
  data() {
    return {
      companyList: [],
      menu: false,
      menu2: false,
      menu3: false,
      inputdata: "",
      statuslist: [
        { text: "ทั้งหมด", value: null },
        { text: "สำเร็จ", value: true },
        { text: "ไม่สำเร็จ", value: false }
      ],
      optional: [
        { text: "ตัวช่วยการค้นหา", value: null },
        { text: "วันครบกำหนดชำระ", value: "due_date" },
        { text: "Company", value: "company" },
        { text: "สถานะการดำเนินการ", value: "status" },
        { text: "Operator", value: "operator" }
      ]
    };
  },
  watch: {
    "filter.options"(newVal) {
      if (newVal) {
        this.filter.inputfilter = null;
      }
    }
  },
  props: {
    filter: Object,
    searchinput: {
      type: Boolean,
      default: true
    },
    keyword: ""
  },
  fetch() {
    this.getCompany();
  },
  methods: {
    getFilterParameter() {
      let params = {
        startDate: dayjs(this.filter.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(this.filter.endDate).format("YYYY-MM-DD"),
        search: this.filter.inputfilter
      };
      this.filter.startDate = params.startDate;
      this.filter.endDate = params.endDate;
      return params;
    },
    async getCompany() {
      let { data } = await this.$store.dispatch("getCompanylist");
      this.companyList = data;
    },
    search() {
      let response = this.getFilterParameter();
      this.$emit("search", response);
    }
  }
};
</script>

<style></style>
