<template>
  <div class="btn btn-light">
    <router-link :to="{ name: 'admin-book' }">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
  </div>

  <Form class="container" :validation-schema="bookFormSchema" @submit="submitBook">
    <div class="form-group">
      <label for="tensach">Tên sách</label>
      <Field name="tensach" type="text" class="form-control" v-model="bookLocal.tensach" />
      <ErrorMessage name="tensach" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="dongia">Đơn giá</label>
      <Field name="dongia" type="number" class="form-control" v-model="bookLocal.dongia" />
      <ErrorMessage name="dongia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="soquyen">Số quyển</label>
      <Field name="soquyen" type="number" class="form-control" v-model="bookLocal.soquyen" />
      <ErrorMessage name="soquyen" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="namxuatban">Năm xuất bản</label>
      <Field name="namxuatban" type="text" class="form-control" v-model="bookLocal.namxuatban" />
      <ErrorMessage name="namxuatban" class="error-feedback" />
    </div>
    <div class="form-group">
  <label for="hinhanh">Ảnh bìa sách</label>
  <input type="file"  name="hinhanh" class="form-control" @change="onFileChange" />
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
     <button class="btn btn-primary" @click="submitBook(bookLocal)">Tạo sách</button>

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
      namxuatban: yup.number().min(0, "Năm phải lớn").required("Năm xuất bản bắt buộc."),
      maNXB: yup.string().required("Mã NXB là bắt buộc."),
    });

    return {
      bookLocal: {
        tensach: "",
        dongia: 0,
        soquyen: 0,
        namxuatban: "",
        maNXB: "",
        tacgia: "Không rõ",
      },
      bookFormSchema,
      NXB: [],
      selectedImage: null, // Lưu file ảnh người dùng chọn
    };
  },
  methods: {
    // Xử lý file ảnh khi người dùng chọn
   onFileChange(event) {
  const file = event.target.files[0];
  console.log("File đã chọn:", file);
  if (file) {
    this.selectedImage = file;
  }
},

    // Submit form tạo sách
  async submitBook(bookLocal) {
  try {
    const formData = new FormData();

    // Bước 1: Chuyển bookLocal thành chuỗi JSON
    formData.append("book", JSON.stringify(bookLocal));
    console.log(bookLocal);
    console.log(this.selectedImage)
    // Bước 2: Append hình ảnh nếu có
    if (this.selectedImage) {
      formData.append("hinhanh", this.selectedImage);  // đúng tên field 'hinhanh'
    }

    // Gửi request
    await BookService.create(formData);

    // Quay lại trang danh sách sau khi tạo thành công
    this.$router.push({ name: "admin-book" });
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
  }
},

    // Gọi API lấy danh sách nhà xuất bản
    async getNXB() {
      return await nxbService.getAll();
    },
  },

  async created() {
    this.NXB = await this.getNXB();
  },
};
</script>
