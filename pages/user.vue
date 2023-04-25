<template>
  <div class="container">
    <h2>รายการพนักงาน</h2>
    <v-btn small color="primary" class="my-2" @click="createUser()"
      ><v-icon left>mdi-plus</v-icon> เพิ่มสมาชิก</v-btn
    >
    <v-card>
      <v-data-table disable-pagination :headers="headerUser" :items="items">
        <template #[`item.no`]="{ index }">
          {{ index + 1 }}
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip small outlined color="success" v-if="item.status"
            ><v-icon left>mdi-circle</v-icon>ใช้งานอยู่</v-chip
          >
          <v-chip small outlined color="error" v-else>
            <v-icon left>mdi-circle</v-icon>ปิดใช้งาน</v-chip
          >
        </template>
        <template #[`item.actions`]="{item}">
          <v-btn color="black" dark small @click="openedit(item)"
            >แก้ไขพนักงาน</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      v-model="dlCreate"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-form ref="form">
          <v-card-title primary-title class="justify-center">
            {{ isEdit ? "แก้ไขพนักงาน" : "สร้างพนักงาน" }}
          </v-card-title>
          <div class="pa-3">
            <label for="username" class="mt-1">username</label>
            <v-text-field
              dense
              outlined
              solo
              v-model="form.username"
              id="username"
              :rules="[v => !!v || 'กรุณากรอก username']"
              hide-details="auto"
              :disabled="isEdit"
              label="username"
            ></v-text-field>
            <label for="password" class="mt-1">password</label>
            <div>
              <v-btn
                @click="isChangePassword = true"
                v-if="isChangePassword == false"
                color="black"
                dark
                small
                >กดเพื่อเปลี่ยน password</v-btn
              >
            </div>
            <v-text-field
              dense
              outlined
              v-if="isChangePassword"
              id="password"
              solo
              :rules="[v => !!v || 'กรุณากรอก password']"
              hide-details="auto"
              v-model="form.password"
              label="password"
            ></v-text-field>
            <label for="role" class="mt-1">role</label>
            <v-select
              dense
              :rules="[v => !!v || 'กรุณาเลือก password']"
              hide-details="auto"
              id="role"
              outlined
              solo
              :items="optionRole"
              v-model="form.role"
              label="ตำแหน่ง"
            ></v-select>
            <label for="role" v-if="isEdit" class="mt-1">สถานะการใช้งาน</label>
            <v-switch
              v-if="isEdit"
              hide-details
              v-model="form.status"
            ></v-switch>
          </div>
          <v-card-actions class="justify-center">
            <v-btn small @click="handleCreateUser" color="primary">{{
              isEdit ? "แก้ไข" : "สร้าง"
            }}</v-btn>
            <v-btn small @click="handleCloseDialog" color="error">ปิด</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import th from "dayjs/locale/th";

export default {
  data() {
    return {
      isChangePassword: false,
      form: {
        role: null
      },
      optionRole: [
        { text: "เลือกตำแหน่ง", value: null },
        { text: "SUPERADMIN", value: "superadmin" },
        { text: "AUDT", value: "audt" },
        { text: "STAFF", value: "staff" }
      ],
      items: [],
      isEdit: false,
      dlCreate: false,
      headerUser: [
        {
          text: "ลำดับ",
          value: "no",
          align: "center",
          sortable: false,
          class: "font-weight-bold",
          width: "50px"
        },
        {
          text: "username",
          value: "username",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        },
        {
          text: "ตำเเหน่ง",
          value: "role",
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
          text: "จัดการ",
          value: "actions",
          align: "center",
          sortable: false,
          class: "font-weight-bold"
        }
      ]
    };
  },
  async fetch() {
    try {
      let { data } = await this.$store.dispatch("getUser");
      this.items = data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async handleCreateUser() {
      if (this.$refs.form.validate()) {
        this.$swal({
          title: `ต้องการ${this.isEdit ? "แก้ไข" : "สร้าง"}พนักงาน ?`,
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
                await this.$store.dispatch("createUser", this.form);
              } else if (this.isEdit) {
                await this.$store.dispatch("updateUser", this.form);
              }

              this.$swal({
                icon: "success",
                title: `${this.isEdit ? "แก้ไข" : "สร้าง"}พนักงานสำเร็จ`,
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
      this.isEdit = false;
      this.dlCreate = false;

      this.$refs.form.reset();
      this.isChangePassword = false;
    },
    openedit(item) {
      this.form = { ...item };
      this.isEdit = true;
      this.dlCreate = true;
    },
    createUser() {
      this.dlCreate = true;
      this.isChangePassword = true;
    }
  }
};
</script>

<style></style>
