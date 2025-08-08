<template>
  <header>  
   

    <nav id="main-navbar" class="navbar navbar-expand-lg navbar-light fixed-top"
     style="background: linear-gradient(90deg, #00c6ff, #0072ff); border-radius: 20px;">

      <div class="container-fluid ">
        <ul class="d-flex flex-row navbar-nav mx-2">
          <li  class="nav-item">
            
            <router-link class="nav-link text-white"  :to="{name:`introduce`}"  > Giới thiệu <i class="fa-tshirt fas"></i></router-link>
          </li>
          <li  class="nav-item">
            
            <router-link  class="nav-link text-white"  :to="{name:`user-book`}" >Sách <i class="fa-book fas"></i></router-link>
          </li>
         <li v-if="isLogin()"   class="nav-item">
            
            <router-link  class="nav-link text-white"  :to="{name:`user-borrow-book`}" >Quản lý mượn sách <i class="fa-book fas"></i></router-link>
          </li>
         
        </ul>

       


        <div  v-if="!isLogin()"  class="navbar-nav">
          <div  >
            <li class="nav-item">
              <router-link :to="{ name: 'user-register' }" class="nav-link text-white" >Đăng ký</router-link>
            </li>
          </div>
           <div>
            <li class="nav-item">
              <router-link to="/user-login" class="nav-link text-white" >Đăng Nhập</router-link>
             
            </li>
          </div> 
        
        </div>
        <div  v-if="isLogin()"  class="navbar-nav">
          <div  >
            <!-- <li class="nav-item">
              <router-link :to="{ name: 'admin-account' }" class="nav-link text-white" >Tài khoản <i class="fa-user-circle fas"></i></router-link>
            </li> -->
          </div>
           <div>
             <li class="nav-item">
              <button v-if="isLogin"  @click="handleLogout" class="nav-link text-white" >Đăng Xuất</button>
            </li>
          </div> 
    
          
        </div>
      </div>
    </nav>
   
  </header>
</template>



<script>
import nhanvienService from '@/services/nhanvien.service';
export default {
  data() {
    return {
      searchQuery: "",
      categories: [],
      openCategories: {
        cat1: false,
        cat2: false
      },
      role:""
    };
  },
  props:{
     nav_link: {
      type: String,
      required: true
  }
  },

  computed:{
    
  },
  // },
  methods:{
    isLogin(){
      return this.role!=""
    },
    handleLogout(){
      nhanvienService.logout()
      this.$router.push('/user-login')
    }
  },
  async created() {
    const user = nhanvienService.getUser();
      if (user) {
        this.role = user.role;
        console.log('Decoded user role:', this.role);
      }
      // Lắng nghe sự kiện thay đổi từ localStorage
    window.addEventListener('storage', () => {
      const user = nhanvienService.getUser();
      this.role = user ? user.role : "";
    });
  },
  
};

</script>

