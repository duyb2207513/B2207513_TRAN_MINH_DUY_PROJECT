<template>
  <div class="btn btn-light">
    <router-link :to="{ name: 'admin-book' }">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
  </div>

  <Form class="container" :validation-schema="bookFormSchema" >
    <div class="form-group">
      <label for="tensach">Tên sách</label>
      <Field name="tensach" type="text" class="form-control" v-model="bookLocal.tensach" />
      <ErrorMessage name="tensach" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="dongia">Đơn giá</label>
      <Field name="dongia" type="number" class="form-control" v-model.number="bookLocal.dongia" />
      <ErrorMessage name="dongia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="soquyen">Số quyển</label>
      <Field name="soquyen" type="number" class="form-control" v-model.number="bookLocal.soquyen" />
      <ErrorMessage name="soquyen" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="namxuatban">Năm xuất bản</label>
      <Field name="namxuatban" type="number" class="form-control" v-model.number="bookLocal.namxuatban" />
      <ErrorMessage name="namxuatban" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="maNXB">Nhà xuất bản</label>
      <select v-model="bookLocal.maNXB" class="form-control" name="maNXB">
        <option disabled value="">-- Chọn nhà xuất bản --</option>
        <option v-for="nxb in NXB" :key="nxb.maNXB" :value="nxb.maNXB">
          {{ nxb.tenNXB }}
        </option>
      </select>
      <ErrorMessage name="maNXB" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="tacgia">Tác giả</label>
      <Field name="tacgia" type="text" class="form-control" v-model="bookLocal.tacgia" />
      <ErrorMessage name="tacgia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="hinhanh">Hình ảnh</label>
      <input type="file" class="form-control" @change="handleImageUpload" />
      <img v-if="bookLocal.hinhanh" :src="`http://localhost:3000/uploads/${bookLocal.hinhanh}`" style="height: 100px;" alt="Hình ảnh sách" />
      <ErrorMessage name="hinhanh" class="error-feedback" />
    </div>

    <div class="form-group mt-3">
      <button v-on:click="submitBook()" type="submit" class="btn btn-primary">Lưu thay đổi</button>
    </div>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import BookService from "@/services/sach.service";
import nxbService from "@/services/nxb.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const bookFormSchema = yup.object().shape({
      tensach: yup.string().required("Tên sách bắt buộc."),
      dongia: yup.number().min(1000, "Giá phải >= 1000").required("Phải có đơn giá."),
      soquyen: yup.number().min(1, "Ít nhất 1 quyển").required("Phải có số quyển."),
      namxuatban: yup.number().min(0, "Năm phải lớn hơn 0").required("Năm xuất bản bắt buộc."),
      maNXB: yup.string().required("Mã NXB là bắt buộc."),
      tacgia: yup.string().required("Tác giả là bắt buộc."),
      hinhanh: yup.mixed().required("Hình ảnh là bắt buộc."), // Validation cho file upload
    });

    return {
      bookLocal: {
        tensach: "",
        dongia: 0,
        soquyen: 0,
        namxuatban: "",
        maNXB: "",
        tacgia: "",
        hinhanh: "", // Thêm trường hinhanh
      },
      bookFormSchema,
      NXB: [],
      masach: "",
      imageFile: null, // Để lưu file hình ảnh
    };
  },
  methods: {
    async getAllNXB() {
      try {
        const response = await nxbService.getAll();
        this.NXB = Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Lỗi khi tải danh sách NXB:", error);
      }
    },

    async loadBook(masach) {
      try {
        this.masach = masach;
        const data = await BookService.getOne(masach);
        this.bookLocal = {
          tensach: data.tensach,
          dongia: data.dongia,
          soquyen: data.soquyen,
          namxuatban: data.namxuatban,
          maNXB: data.maNXB,
          tacgia: data.tacgia,
          // hinhanh: data.hinhanh, // Lấy hình ảnh từ dữ liệu
        };
      } catch (error) {
        console.error("Không lấy được thông tin sách:", error);
      }
    },

    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
      // Không gán trực tiếp vào bookLocal.hinhanh vì cần upload file
    },

  async submitBook() {
  try {
    const formData = new FormData();

    // Thêm các field khác vào formData
    for (const key in this.bookLocal) {
      if (key !== "hinhanh") {
        formData.append(key, this.bookLocal[key]);
      }
    }

    // Thêm ảnh nếu có
    if (this.imageFile) {
      formData.append("hinhanh", this.imageFile);
    }

    // Gửi đến API (chỉnh sửa BookService nếu cần)
    await BookService.updateWithImage(this.masach, formData);

    this.$router.push({ name: "admin-book" });
  } catch (error) {
    console.error("Lỗi khi lưu sách:", error);
  }
}

  },

  async created() {
    await this.getAllNXB();

    // Nếu có masach trong route thì là đang update
    if (this.$route.params.masach) {
      await this.loadBook(this.$route.params.masach);
    }
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>