<!-- <template>
  <section class="vh-100  bg-image" style="background-image: url('/admin2.jpg')">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
              <div class="card-body p-4">
                <h2 class="text-uppercase text-center mb-5">Đăng nhập bằng OTP</h2>

                <form v-if="!otpSent" @submit.prevent="handleSendOtp">
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
                      Gửi OTP
                    </button>
                  </div>
                </form>

                <form v-else @submit.prevent="handleVerifyOtp">
                  <div class="form-outline mb-5">
                    <label class="form-label">Mã OTP:</label>
                    <input
                      v-model="user.otp"
                      type="text"
                      placeholder="Nhập mã OTP"
                      class="p-3 form-control"
                      required
                    />
                  </div>
                  <div class="d-flex justify-content-center">
                    <button
                      type="submit"
                      class="btn btn-success btn-block btn-lg gradient-custom-4 form-control"
                    >
                      Xác thực OTP
                    </button>
                  </div>
                  <div class="text-center mt-3">
                    <button
                      @click="resendOtp"
                      class="btn btn-link"
                      :disabled="countdown > 0"
                    >
                      Gửi lại OTP {{ countdown > 0 ? `(${countdown}s)` : '' }}
                    </button>
                  </div>
                </form>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> -->

<template>
  <section class="otp-login-section">
    <div class="container py-5 h-100 d-flex align-items-center justify-content-center">
      <div class="col-lg-6 col-md-8 col-sm-10">
        <div class="card shadow rounded-4">
          <div class="card-body p-5">
            <h2 class="text-center mb-4 text-primary fw-bold">Đăng nhập bằng OTP</h2>

            <form v-if="!otpSent" @submit.prevent="handleSendOtp">
              <div class="form-group mb-4">
                <label class="form-label">Số điện thoại</label>
                <input
                  v-model="user.sodienthoai"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Nhập số điện thoại (VD: 09xxxxxxxx)"
                  required
                />
              </div>

              <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="submit">Gửi OTP</button>
              </div>
            </form>

            <form v-else @submit.prevent="handleVerifyOtp">
              <div class="form-group mb-4">
                <label class="form-label">Mã OTP</label>
                <input
                  v-model="user.otp"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Nhập mã OTP"
                  required
                />
              </div>

              <div class="d-grid">
                <button class="btn btn-success btn-lg" type="submit">Xác thực OTP</button>
              </div>

              <div class="text-center mt-3">
                <button
                  @click="resendOtp"
                  class="btn btn-link"
                  :disabled="countdown > 0"
                >
                  Gửi lại OTP {{ countdown > 0 ? `(${countdown}s)` : '' }}
                </button>
              </div>
            </form>

            <p class="text-center text-muted mt-4 mb-0">
              Bạn chưa có tài khoản?
              <router-link class="fw-bold text-primary mx-2" :to="{ name: 'user-register' }">
                Đăng ký tại đây
              </router-link>
              |
              <router-link class="fw-bold text-danger" :to="{ name: 'admin-login' }">
                Admin đăng nhập
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import UserService from "@/services/docgia.service";

export default {
  data() {
    return {
      user: {
        sodienthoai: "",
        hoten: "",
        otp: "",
      },
      otpSent: false,
      countdown: 60, // Thời gian chờ trước khi được gửi lại OTP (60 giây)
      countdownInterval: null,
    };
  },
  methods: {
    async handleSendOtp() {
      try {
        const response = await UserService.sendOtp({
          sodienthoai: this.user.sodienthoai,
          hoten: this.user.hoten || "Khách hàng",
        });
        if (response.success) {
          this.otpSent = true;
          this.startCountdown();
          alert("Đã gửi OTP thành công!");
        } else {
          alert(`Gửi OTP thất bại: ${response.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi gửi OTP:", error);
        alert("Lỗi khi gửi OTP. Vui lòng thử lại.");
      }
    },
    async handleVerifyOtp() {
      try {
        const response = await UserService.verifyOtp({
          sodienthoai: this.user.sodienthoai,
          otp: this.user.otp,
        });
        console.log(response)
        if (response.success) {
          alert("Xác thực OTP thành công!");
          window.dispatchEvent(new Event("storage"));
          this.$router.push("/");
        } else {
          alert(`Xác thực OTP thất bại: ${response.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi xác thực OTP:", error);
        alert("Lỗi khi xác thực OTP. Vui lòng thử lại.");
      }
    },
    async resendOtp() {
      if (this.countdown > 0) return;
      this.user.otp = "";
      await this.handleSendOtp();
    },
    startCountdown() {
      this.countdown = 60;
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    },
    beforeDestroy() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    },
  },
};
</script>
<style>
.otp-login-section {
  min-height: calc(100vh - 75px);
  background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 75px;
}

.card {
  border: none;
  border-radius: 1rem;
}

.card-body {
  background: #ffffff;
  border-radius: 1rem;
}

.btn-primary {
  background: linear-gradient(45deg, #007bff, #00c6ff);
  border: none;
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #4cd964);
  border: none;
}

.btn-primary:hover,
.btn-success:hover {
  opacity: 0.9;
}

.form-control {
  border-radius: 0.6rem;
  font-size: 1.1rem;
}
</style>