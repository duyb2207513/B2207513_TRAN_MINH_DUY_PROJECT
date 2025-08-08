<template>
  <div class="container p-2 mt-4">
    <div style="background-color:#f5f5f5; border-radius: 10px;" class="row justify-content-center">
      <div class="col-lg-6 mt-3 pb-3">
        <div class="card border-0 rounded-4 shadow-sm">
          <div class="card-body p-4">
            <h3 class="text-center mb-4">Chỉnh sửa thông tin</h3>
            <form @submit.prevent="handleUpdate">
              <div class="mb-3">
                <label class="form-label fw-semibold">Họ tên</label>
                <input type="text" class="form-control" v-model="form.hoten" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Số điện thoại</label>
                <input type="text" class="form-control" v-model="form.sodienthoai" disabled required />
              </div>
              <div  class="mb-3">
                <label  class="form-label fw-semibold">Chức vụ</label>
                <input disabled type="text" class="form-control" v-model="form.chucvu" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Địa chỉ</label>
                <input type="text" class="form-control" v-model="form.diachi" />
              </div>
              <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-secondary" @click="$router.go(-1)">Hủy</button>
                <button type="submit" class="btn btn-success">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import docgiaService from "@/services/docgia.service";
import nhanvienService from "@/services/nhanvien.service";

export default {
  data() {
    return {
      role:"",
      form: {
        hoten: "",
        sodienthoai: "",
        chucvu: "",
        diachi: "",
      },
      id: null
    };
  },
  methods: {
    async fetchUserData() {
      const token = nhanvienService.getUser();
      this.role=token.role
      console.log(token)
      if(token.role==='nv'){
        this.id = token.manhanvien;
        const data = await nhanvienService.getOne(this.id);
        this.form = {
          hoten: data.hoten,
          sodienthoai: data.sodienthoai,
          chucvu: data.chucvu,
          diachi: data.diachi,
          password:data.password,
      };
      }
      else if(token.role==='kh'){
        this.id=token.madocgia;
        const data= await docgiaService.getOne(this.id);
        this.form={
          hoten:data.holot+" "+data.ten,
          chucvu:"Khách hàng",
          diachi:data.diachi,
          sodienthoai:data.sodienthoai,
          password:data.password,
        }
      }
      
    },
    async handleUpdate() {
      try {
        if(this.role==="nv"){
          
          await nhanvienService.update(this.id, this.form);
        }
        else{

          const nameParts = this.form.hoten.trim().split(" ");
         
          const lastName = nameParts[nameParts.length - 1];
          const allExceptLast = nameParts.slice(0, -1).join(" ");
          console.log(this.form)
          const payload={
            holot:allExceptLast,
            ten: lastName,
          
            diachi:this.form.diachi,
            sodienthoai:this.form.sodienthoai,

          }
        await docgiaService.update(this.id,payload)
        } 
         
        alert("Cập nhật thành công");
        this.$router.push({ name: "admin-account" }); // hoặc bất kỳ route nào khác
      } catch (err) {
        console.error("Update failed", err);
        alert("Cập nhật thất bại");
      }
    }
  },
  created() {
    this.fetchUserData();
  }
};
</script>
