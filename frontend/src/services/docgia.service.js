  import createApiClient from "./api.service";


  class UserService {
    constructor() {
      this.api = createApiClient("/api/docgia");
    }
    // async getAll(){
    //   return (await this.api.get("/user")).data;
    // }

    async register(user) {
      return (await this.api.post("/register", user)).data;
    }

    async login(user) {
      
      const response = await this.api.post("/login", user);
      // console.log(response)
      const { token,} = response.data;
      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      localStorage.setItem("loginTime", new Date().getTime()); // Lưu thời gian đăng nhập

      // Tự động logout sau 1 tiếng
      setTimeout(() => {
          this.logout();
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          window.location.href = "/login";
      }, 3600000); // 1 tiếng = 60 phút * 60 giây * 1000ms
      console.log(response.data)
      return "haha"
    }

    logout() {
      // Xóa token và user từ localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime"); // Xóa thời gian đăng nhập
      window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
    }
    async getOne(id){
      return (await this.api.get(`/${id}`)).data;
          }
    async getAll(){
      return (await this.api.get(`/`)).data;
    }
    async update(madocgia,user){
      return (await this.api.post(`/${madocgia}`, user)).data;
    }
   async sendOtp(data) {
    const response = await this.api.post(`/send-otp`, data);
    return response.data;
    }
    async verifyOtp(data) {
      const response = await this.api.post(`/verify-otp`, data);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token); // Lưu token vào localStorage
      }
      return response.data;
    }
  }

  export default new UserService();
