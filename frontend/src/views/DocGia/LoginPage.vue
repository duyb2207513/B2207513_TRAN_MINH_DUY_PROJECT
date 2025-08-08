<template class=" login-container">
  <section class="vh-100 bg-image "
    style="background-image: url('/admin2.jpg') ">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
               
              
              <div class="card-body p-4">
                <h2 class="text-uppercase text-center mb-5">Đăng nhập</h2>

                <form  @submit.prevent="handleLogin">
                  <div class="form-outline mb-5">
                    <label class="form-label">Mã độc giả/Số điện thoại:</label>
                    <input v-model="user.sodienthoai" type="text" placeholder="Nhập mã độc giả hoặc tên đăng nhập" class="p-3 form-control" required />
                  </div>      
                 

                  <div class="d-flex justify-content-center ">
                    <button type="submit" class=" btn btn-success btn-block btn-lg gradient-custom-4   form-control">
                      Đăng nhập
                    </button>
                  </div>

                  <p class="text-center text-muted mt-5 mb-0">
                    Bạn chưa có tài khoản?
                    <router-link class="mx-2 fw-bold text-body" :to="{ name: 'user-register' }">
                      <u>Đăng ký tại đây</u>   
                    </router-link>
                    | 
                    <router-link class="fw-bold   " :to="{ name: 'admin-login' }">
                      <u>Admin đăng nhập ở đây</u>
                    </router-link>
                  </p>
                  <p class="text-center text-muted mt-5 mb-0">
                    
                    
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
import UserService from "@/services/docgia.service"

export default {
  data() {
    return {
      user: {
        sodienthoai:""
        // password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log("Bắt đầu")
        await UserService.login(this.user);
        // localStorage.setItem("role", role || "kh"); // Giả sử độc giả mặc định là "kh"
        // console.log(result)
        alert("Đăng nhập thành công!");
        // Kiểm tra quyền của user
        window.dispatchEvent(new Event("storage"));
        this.$router.push("/");
        
        
      } catch (error) {
        console.log(error)
       
      }

    },
    
  },
};


</script>

