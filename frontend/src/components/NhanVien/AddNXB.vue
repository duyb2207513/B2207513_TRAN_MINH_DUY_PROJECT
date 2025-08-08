<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-start mb-3">
      <router-link :to="{ name: 'admin-NXB' }" class="btn btn-outline-secondary">
        <i class="fa-solid fa-arrow-left me-2"></i> Quay lại
      </router-link>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Thêm Nhà Xuất Bản</h5>
      </div>
      <div class="card-body">
        <Form :validation-schema="contactFormSchema" @submit="submitContact">
          <div class="mb-3">
            <label for="tenNXB" class="form-label">Tên Nhà Xuất Bản</label>
            <Field name="tenNXB" type="text" class="form-control" v-model="contactLocal.tenNXB" />
            <ErrorMessage name="tenNXB" class="text-danger" />
          </div>

          <div class="mb-3">
            <label class="form-label">Địa chỉ</label>
            <div class="row g-2">
              <div class="col-md-4">
                <select v-model="selectedProvince" @change="fetchDistricts" class="form-select" required>
                  <option value="" disabled>Chọn Tỉnh/TP</option>
                  <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <select v-model="selectedDistrict" @change="fetchWards" class="form-select" :disabled="!selectedProvince" required>
                  <option value="" disabled>Chọn Quận/Huyện</option>
                  <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <select v-model="selectedWard" class="form-select" :disabled="!selectedDistrict" required>
                  <option value="" disabled>Chọn Xã/Phường</option>
                  <option v-for="w in wards" :key="w.name" :value="w.name">{{ w.name }}</option>
                </select>
              </div>
            </div>
            <input v-model="specificAddress" type="text" class="form-control mt-2" placeholder="Nhập số nhà, tên đường..." required />
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-success">Tạo</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import NXBService from "@/services/nxb.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const contactFormSchema = yup.object().shape({
      tenNXB: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
    });

    return {
      contactLocal: {
        tenNXB: "",
        diachi: "",
      },
      contactFormSchema,
      provinces: [],
      districts: [],
      wards: [],
      selectedProvince: "",
      selectedDistrict: "",
      selectedWard: "",
      specificAddress: "",
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
    async submitContact() {
      try {
        const payload = {
          tenNXB: this.contactLocal.tenNXB,
          diachi: this.contactLocal.diachi,
        };
        await NXBService.createNXB(payload);
        this.$router.push({ name: 'admin-NXB' });
      } catch (error) {
        console.error("Lỗi khi tạo NXB:", error);
      }
    },
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
      this.contactLocal.diachi = `${this.specificAddress}, ${ward}, ${district}, ${province}`.replace(/^, |, $/g, "");
    },
    getProvinceName() {
      const province = this.provinces.find(p => p.code === this.selectedProvince);
      return province ? province.name : "";
    },
    getDistrictName() {
      const district = this.districts.find(d => d.code === this.selectedDistrict);
      return district ? district.name : "";
    },
  },
  created() {
    this.fetchProvinces();
  }
};
</script>
<style scoped>
.card {
  max-width: 800px;
  margin: auto;
}
</style>
