<template>
  <section class="vh-100 mt-2  "
    style="background-image: url('/admin.jpg');">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
               <div class="mx-4 mt-3">
            
              </div>

              <div class="card-body p-2">
                <h2 class="text-uppercase text-center mb-2">Đăng ký tài khoản</h2>

                <form @submit.prevent="handleRegister">
                 

                  <div class="form-outline mb-2">
                    <label class="form-label">Họ tên:</label>
                    <input v-model="user.name" type="text" placeholder="Nhập họ tên" class="form-control" required />
                  </div>

                  

                 <div class="form-outline mb-2">
                    <label class="form-label">Số điện thoại:</label>
                    <input v-model="user.phone" type="text" placeholder="Nhập số điện thoại" class="form-control" @blur="validatePhone" required />
                    <p v-if="phoneError" class="text-danger">{{ phoneError }}</p> 
                  </div>
                  <div class="form-outline mb-2">
                    <label class="form-label">Ngày sinh:</label>
                    <input v-model="user.dateofbirth" type="date" placeholder="Nhập số điện thoại" class="form-control"  required />
                    <p v-if="phoneError" class="text-danger">{{ phoneError }}</p> 
                  </div>
                  <div class="form-outline mb-2">
                    <label class="form-label">Giới tính:</label>
                  <form class="d-flex" action="">
                    <label class="mx-2">
                      <input v-model="user.sex" type="radio" name="gender" value="0"> Nam
                    </label>
                    <label class="mx-2">
                      <input v-model="user.sex" type="radio" name="gender" value="1"> Nữ
                    </label>
                 
                  </form>

                  </div>
                  

                  <div class="form-outline mb-2">
                    <label class="form-label">Địa chỉ trước sáp nhập:</label>
                    <div class="row g-2">
                      <div class="col-md-4">
                        <select v-model="selectedProvince" @change="fetchDistricts" class="form-control" required>
                          <option value="" disabled>Chọn Tỉnh/TP</option>
                          <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <select v-model="selectedDistrict" @change="fetchWards" class="form-control" :disabled="!selectedProvince" required>
                          <option value="" disabled>Chọn Quận/Huyện</option>
                          <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <select v-model="selectedWard" class="form-control" :disabled="!selectedDistrict" required>
                          <option value="" disabled>Chọn Xã/Phường</option>
                          <option v-for="w in wards" :key="w.name" :value="w.name">{{ w.name }}</option>
                        </select>
                      </div>
                    </div>

                    <div class="mt-2">
                      <input v-model="specificAddress" type="text" placeholder="Nhập số nhà, tên đường..." class="form-control" required />
                    </div>
                  </div>
                

                  <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4  form-control">
                      Đăng ký
                    </button>
                  </div>

                  <p class="text-center text-muted mt-2 mb-0">
                    Bạn đã có tài khoản?
                    <router-link class="fw-bold text-body" :to="{ name: 'user-login' }">
                      <u>Đăng nhập tại đây</u>
                    </router-link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import UserService from "@/services/docgia.service"

export default {
  data() {
    return {
      user: {
        name: "",
        // password: "",
        // role: "user",
        dateofbirth:"",
        sex:"",
        name: "",
        phone: "",

        address: "" // Lưu địa chỉ đầy đủ
      },
      provinces: [],
      districts: [],
      wards: [],
      selectedProvince: "",
      selectedDistrict: "",
      selectedWard: "",
      specificAddress: "", // Số nhà, tên đường,
       emailError: "",
      phoneError: "",
      passwordError: ""
    };
  },
  watch: {
    selectedWard() {
      this.updateAddress();
    },
    specificAddress() {
      this.updateAddress();
    }
  },
  methods: {
    async fetchProvinces() {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        this.provinces = response.data;
      } catch (error) {
        console.error("Lỗi tải danh sách tỉnh:", error);
      }
    },
    async fetchDistricts() {
      if (!this.selectedProvince) return;
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${this.selectedProvince}?depth=2`);
        this.districts = response.data.districts;
        this.wards = [];
        this.selectedDistrict = "";
        this.selectedWard = "";
        this.updateAddress();
      } catch (error) {
        console.error("Lỗi tải danh sách huyện:", error);
      }
    },
    async fetchWards() {
      if (!this.selectedDistrict) return;
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${this.selectedDistrict}?depth=2`);
        this.wards = response.data.wards;
        this.selectedWard = "";
        this.updateAddress();
      } catch (error) {
        console.error("Lỗi tải danh sách xã:", error);
      }
    },
    updateAddress() {
      const province = this.getProvinceName();
      const district = this.getDistrictName();
      const ward = this.selectedWard;
      this.user.address = `${this.specificAddress}, ${ward}, ${district}, ${province}`.replace(/^, |, $/g, "");
    },
    getProvinceName() {
      const province = this.provinces.find(p => p.code === this.selectedProvince);
      return province ? province.name : "";
    },
    getDistrictName() {
      const district = this.districts.find(d => d.code === this.selectedDistrict);
      return district ? district.name : "";
    },

      validateEmail() {
      const emailPattern = /^\S+@\S+\.\S+$/;
      this.emailError = emailPattern.test(this.user.email) ? "" : "Email không hợp lệ!";
    },
    validatePhone() {
      const phonePattern = /^[0-9]{10}$/;
      this.phoneError = phonePattern.test(this.user.phone) ? "" : "Số điện thoại phải có đúng 10 chữ số!";
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      this.passwordError = passwordPattern.test(this.user.password)
        ? ""
        : "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt!";
    },

    async handleRegister() {
      //  Gọi lại các hàm validate để đảm bảo kiểm tra trước khi submit
      this.validateEmail();
      this.validatePhone();
      this.validatePassword();

      if ( this.phoneError ) {
        alert("Số điện thoại đã tồn tại!");
        return;
      }

      const nameParts = this.user.name.trim().split(" ");
      // const lastName = nameParts[nameParts.length - 1];
      const lastName = nameParts[nameParts.length - 1];
      const allExceptLast = nameParts.slice(0, -1).join(" ");
      const payload={
        holot:allExceptLast,
        ten: lastName,
        ngaysinh:this.user.dateofbirth,
        phai:parseInt(this.user.sex),
        diachi:this.user.address,
        sodienthoai:this.user.phone,

      }
      console.log(payload)
      try {
        await UserService.register(payload);
        alert("Đăng ký thành công!");
        this.$router.push("/login");
      } catch (error) {
        alert("Đăng ký thất bại!");
      }
      
    }
  },
  mounted() {
    this.fetchProvinces();
  }
};
</script>
