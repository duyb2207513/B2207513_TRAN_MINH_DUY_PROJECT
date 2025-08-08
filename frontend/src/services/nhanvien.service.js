  import createApiClient from "./api.service";
 import { jwtDecode } from "jwt-decode";
  class UserService {
    constructor() {
      this.api = createApiClient("/api/nhanvien");
    }


    async register(user) {
      return (await this.api.post("/register", user)).data;
    }

    async login(user) {
      console.log(user)
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
    async getAll(){
      return (await this.api.get("/")).data;
    }
    async getOne(id){
      return (await this.api.get(`/${id}`)).data;
          }
   
    getUser() {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        return jwtDecode(token); // Trả về payload { id, manhanvien, sodienthoai, ... }
      } catch (e) {
        console.error("Token không hợp lệ:", e);
        return null;
      }
  }

    async update(id,data){
      return (await this.api.put(`/${id}`,data)).data;
    }
   
  }

  export default new UserService();
