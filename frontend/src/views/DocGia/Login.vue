<template>
  <section class="vh-100 bg-image" style="background-image: url('/admin2.jpg')">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
              <div class="card-body p-4">
                <h2 class="text-uppercase text-center mb-5">Đăng nhập</h2>

                <form @submit.prevent="handleLogin">
                  <div class="form-outline mb-5">
                    <label class="form-label">Số điện thoại:</label>
                    <input
                      v-model="user.sodienthoai"
                      type="text"
                      placeholder="Nhập số điện thoại (VD: 09xxxxxxxx)"
                      class="p-3 form-control"
                      required
                    />
                  </div>
                  <div class="d-flex justify-content-center">
                    <button
                      type="submit"
                      class="btn btn-success btn-block btn-lg gradient-custom-4 form-control"
                    >
                      Đăng nhập
                    </button>
                  </div>
                  <div class="d-flex justify-content-center mt-3">
                    <button
                      type="button"
                      class="btn btn-primary btn-block btn-lg form-control"
                      @click="goToOtpLogin"
                    >
                      Đăng nhập bằng OTP
                    </button>
                  </div>
                  <p class="text-center text-muted mt-5 mb-0">
                    Bạn chưa có tài khoản?
                    <router-link class="mx-2 fw-bold text-body" :to="{ name: 'user-register' }">
                      <u>Đăng ký tại đây</u>
                    </router-link>
                    |
                    <router-link class="fw-bold" :to="{ name: 'admin-login' }">
                      <u>Admin đăng nhập ở đây</u>
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

<style scoped>
.bg-image {
  all: unset;
}
</style>

<script>
import UserService from "@/services/docgia.service";

export default {
  data() {
    return {
      user: {
        sodienthoai: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await UserService.login(this.user);
        if (response.success) {
          alert("Đăng nhập thành công!");
          this.$router.push("/user");
        } else {
          alert(`Đăng nhập thất bại: ${response.message}`);
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi khi đăng nhập. Vui lòng thử lại.");
      }
    },
    goToOtpLogin() {
      this.$router.push({ name: 'otp-login', query: { sodienthoai: this.user.sodienthoai } });
    },
  },
};
</script>