
<template>
  <!-- Nút về trang chủ -->

  <div  class="container p-2 mt-4">
    <div style="background-color:#e0e0e0; border-radius: 10px;"  class="row align-items-center justify-content-center">
      <div class="col-lg-6 mt-2 pb-2">
        <div class="card border-0 rounded-4 shadow-sm">
          <div class="card-body p-4 text-center">
            <!-- Ảnh đại diện -->

            
            <!-- <img v-if="user.avatar" :src="getImageUrl(user.avatar)" alt="Avatar" class="border rounded-circle shadow-lg mb-3" 
                 style="width: 150px; height: 150px; object-fit: cover; border: 5px solid #e0e0e0;">
                  <img v-else
              src="/anhdaidien.jpg"
              class="rounded-circle"
              alt=""
              style="width: 150px; height: 150px;padding: 2px;border: 1px solid lightgray"
              />  -->
            
            <h3 class="text-center mb-4">Thông tin cá nhân</h3>
            <div class="mb-3">
              <label class="form-label fw-semibold">Họ tên</label>
              <div class="form-control bg-light border">{{ user.hoten }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Số điện thoại</label>
              <div class="form-control bg-light border">{{ user.sodienthoai }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Chức vụ</label>
              <div class="form-control bg-light border">{{ user.chucvu }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Địa chỉ</label>
              <div class="form-control bg-light border">{{ user.diachi }}</div>
            </div>
            <button class="btn btn-primary w-100 mt-2" @click="goToEdit">Chỉnh sửa</button>

          </div>
        </div>
      </div>
    </div>

    <!-- Component chỉnh sửa -->
   

   
  </div>
</template>

<style>

</style>
<script>

import nhanvienService from "@/services/nhanvien.service";
import axios from "axios";
export default {
  components: {
    
  },
  data() {
    return {
      user: {},
      form: { province: "", district: "", ward: "", address: "", note: "" },
      provinces: [],
      districts: [],
      wards: [],
      selectedOrders: [],
      users:{}
    };
  },
  methods: {
   
    async fetchProvinces() {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      this.provinces = res.data;
    },
    async fetchDistricts() {
      if (!this.form.province) return;
      this.districts = [];
      this.wards = [];
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${this.form.province}?depth=2`);
      this.districts = res.data.districts;
    },
    async fetchWards() {
      if (!this.form.district) return;
      this.wards = [];
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${this.form.district}?depth=2`);
      this.wards = res.data.wards;
    },
    populateAddress(addressString) {
      const parsed = this.parseAddress(addressString);
      this.form.address = parsed.address;

      const province = this.provinces.find((p) => p.name.includes(parsed.province));
      if (province) {
        this.form.province = province.code;
        this.fetchDistricts().then(() => {
          const district = this.districts.find((d) => d.name.includes(parsed.district));
          if (district) {
            this.form.district = district.code;
            this.fetchWards().then(() => {
              const ward = this.wards.find((w) => w.name.includes(parsed.ward));
              if (ward) this.form.ward = ward.code;
            });
          }
        });
      }
    },
    parseAddress(addressString) {
      if (!addressString) return { province: "", district: "", ward: "", address: "" };
      let parts = addressString.split(",").map((part) => part.trim());
      return { address: parts[0], ward: parts[1], district: parts[2], province: parts[3] };
    },
    goToEdit() {
    this.$router.push({ name: "admin-account-edit" }); // hoặc tên route bạn đặt trong router
    },


  
    async handleClick() {
      try {
          this.$router.push({ name: "admin-book" });
      } catch (error) {

      }
    },
    async fetchData(){
        const token= nhanvienService.getUser();
        this.user = await nhanvienService.getOne(token.manhanvien);
        console.log(this.user)
    }
  },
  async created() {
    this.fetchData();

    await this.fetchProvinces();
    
    if (this.user?.address) {
      this.populateAddress(this.user.address);
    }
  }
}
</script>



