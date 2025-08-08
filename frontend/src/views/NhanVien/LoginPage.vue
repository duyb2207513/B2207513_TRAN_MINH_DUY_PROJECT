<template class=" login-container">
  <section class="vh-100 bg-image"
    style="background-image: url('/user1.avif') ">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
               
              
              <div class="card-body p-4">
                <h2 class="text-uppercase text-center mb-5">Đăng nhập</h2>

                <form  @submit.prevent="handleLogin">
                  <div class="form-outline mb-5">
                    <label class="form-label">Tên đăng nhập:</label>
                    <input v-model="user.username" type="text" placeholder="Nhập tên đăng nhập" class="p-3 form-control" required />
                  </div>      
                  <div class="form-outline mb-5">
                    <label class="form-label">Mật khẩu:</label>
                    <input v-model="user.password" type="password" placeholder="Nhập mật khẩu" class="p-3 form-control" required />
                  </div>

                  <div class="d-flex justify-content-center ">
                    <button type="submit" class=" btn btn-success btn-block btn-lg gradient-custom-4   form-control">
                      Đăng nhập
                    </button>
                  </div>

                  <p class="text-center text-muted mt-5 mb-0">
                    Bạn chưa có tài khoản?
                    <router-link class="fw-bold text-body" :to="{ name: 'admin-register' }">
                      <u>Đăng ký tại đây</u>
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

<style>
.login-container {
  all: unset;
}

 </style>
<script>
import AuthService from "@/services/nhanvien.service";

export default {
  data() {
    return {
      phoneError:"",
      user: {
        sodienthoai: "",
        madocgia:"",
        username:"",
        password: "",
      },
    };
  },
  methods: {
    validatePhone() {
      const phonePattern = /^[0-9]{10}$/;
      this.user.sodienthoai = phonePattern.test(this.user.username) ? this.user.username: "";
    },
    async handleLogin() {
      try {
        this.validatePhone()
        if(this.user.sodienthoai==""){
          this.user.madocgia=this.user.username
        }
        console.log(this.user)
        await AuthService.login(this.user);
        const result = await AuthService.getUser()
        const result2 =await AuthService.getOne(result.manhanvien)
        console.log(result2)

        if(result2.chucvu===""){
          await AuthService.logout()
          alert("Vui lòng chờ được cấp quyền truy cập")
        }
        else{
          alert("Đăng nhập thành công!");
          // Kiểm tra quyền của user
          window.dispatchEvent(new Event("storage"));
          this.$router.push("/admin");

        }
          
        
      } catch (error) {
        alert("Đăng nhập thất bại!");
      }

    },
    
    
  },
};


</script>

