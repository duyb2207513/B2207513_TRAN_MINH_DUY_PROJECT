<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">
        <i class="fas fa-pen-nib me-2 text-warning"></i>Chỉnh sửa Nhà Xuất Bản
      </h3>
      <router-link :to="{ name: 'admin-NXB' }" class="btn btn-outline-secondary">
        <i class="fa-solid fa-arrow-left me-1"></i> Quay lại
      </router-link>
    </div>

    <Form :validation-schema="contactFormSchema" @submit="submitContact" class="card shadow p-4">
      <div class="mb-3">
        <label for="tenNXB" class="form-label">Tên nhà xuất bản</label>
        <Field name="tenNXB" type="text" class="form-control" v-model="contactLocal.tenNXB" />
        <ErrorMessage name="tenNXB" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <div class="row g-2">
          <div class="col-md-4">
            <select v-model="selectedProvince" @change="fetchDistricts" class="form-select">
              <option value="" disabled>Chọn Tỉnh/Thành phố</option>
              <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
          </div>

          <div class="col-md-4">
            <select v-model="selectedDistrict" @change="fetchWards" class="form-select" :disabled="!selectedProvince">
              <option value="" disabled>Chọn Quận/Huyện</option>
              <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
            </select>
          </div>

          <div class="col-md-4">
            <select v-model="selectedWard" class="form-select" :disabled="!selectedDistrict">
              <option value="" disabled>Chọn Xã/Phường</option>
              <option v-for="w in wards" :key="w.name" :value="w.name">{{ w.name }}</option>
            </select>
          </div>
        </div>

        <div class="mt-3">
          <input
            v-model="specificAddress"
            type="text"
            placeholder="Số nhà, tên đường..."
            class="form-control"
          />
        </div>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-success px-4">
          <i class="fa-solid fa-save me-1"></i> Lưu chỉnh sửa
        </button>
      </div>
    </Form>
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
      diachi: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
    });

    return {
      contactFormSchema,
      contactLocal: {
        tenNXB: "",
        diachi: "",
      },
      provinces: [],
      districts: [],
      wards: [],
      selectedProvince: "",
      selectedDistrict: "",
      selectedWard: "",
      specificAddress: "",
      maNXB: "", // mã nhà xuất bản từ route
    };
  },
  watch: {
    selectedWard() {
      this.updateAddress();
    },
    specificAddress() {
      this.updateAddress();
    },
  },
  methods: {
    async submitContact() {
      try {
        const payload = {
          tenNXB: this.contactLocal.tenNXB,
          diachi: this.contactLocal.diachi,
        };
        console.log(payload,this.maNXB)
        const result =await NXBService.updateNXB(this.maNXB, payload);
        console.log(result)
        this.$router.push({ name: "admin-NXB" });
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      }
    },
    async fetchProvinces() {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        this.provinces = response.data;
      } catch (error) {
        console.error("Lỗi tải tỉnh:", error);
      }
    },
    async fetchDistricts() {
      if (!this.selectedProvince) return;
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${this.selectedProvince}?depth=2`);
        this.districts = response.data.districts;
        this.selectedDistrict = "";
        this.selectedWard = "";
        this.wards = [];
        this.updateAddress();
      } catch (error) {
        console.error("Lỗi tải huyện:", error);
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
        console.error("Lỗi tải xã:", error);
      }
    },
    updateAddress() {
      const province = this.getProvinceName();
      const district = this.getDistrictName();
      const ward = this.selectedWard;
      this.contactLocal.diachi = `${this.specificAddress}, ${ward}, ${district}, ${province}`.replace(/^, |, $/g, "");
    },
    getProvinceName() {
      const province = this.provinces.find((p) => p.code === this.selectedProvince);
      return province ? province.name : "";
    },
    getDistrictName() {
      const district = this.districts.find((d) => d.code === this.selectedDistrict);
      return district ? district.name : "";
    },
    async loadNXB() {
      try {
        const ma = this.$route.params.maNXB;
        this.maNXB = ma;
        const data = await NXBService.getNXB(ma);
        this.contactLocal.tenNXB = data.tenNXB;
        this.contactLocal.diachi = data.diachi;

        // Tách địa chỉ linh hoạt
        const addressParts = this.contactLocal.diachi.split(",").map(part => part.trim()).filter(part => part.length > 0);
        let provinceName = addressParts[addressParts.length - 1]; // Tỉnh thường là phần cuối
        let districtName = addressParts[addressParts.length - 2] || ""; // Quận/Huyện trước tỉnh
        let wardName = addressParts[addressParts.length - 3] || ""; // Phường/Xã trước quận
        this.specificAddress = addressParts.slice(0, addressParts.length - 3).join(", ") || ""; // Phần số nhà, đường

        // Tìm province
        const province = this.provinces.find(p => p.name === provinceName);
        if (province) {
          this.selectedProvince = province.code;
          await this.fetchDistricts();

          // Tìm district
          const district = this.districts.find(d => d.name === districtName);
          if (district) {
            this.selectedDistrict = district.code;
            await this.fetchWards();

            // Tìm ward
            const ward = this.wards.find(w => w.name === wardName);
            if (ward) {
              this.selectedWard = ward.name;
            }
          }
        }

        this.updateAddress();
      } catch (error) {
        console.error("Không lấy được NXB:", error);
      }
    },
  },
  async created() {
    await this.fetchProvinces();
    this.loadNXB();
  },
};
</script>
<style scoped>
.card {
  border-radius: 16px;
  border: 1px solid #e0e0e0;
}

label {
  font-weight: 500;
}

input.form-control,
select.form-select {
  border-radius: 8px;
  transition: 0.3s;
}

input:focus,
select:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
