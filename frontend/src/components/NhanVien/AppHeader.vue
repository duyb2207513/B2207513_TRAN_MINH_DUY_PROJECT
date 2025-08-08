

  <template>
  <header>  
    <!-- Sidebar khi là trang quản lý sản phẩm -->
    <div class="active-sidebar sidebar">
      <nav id="sidebar-menu">
         <ul>  
          <li class="nav-item">
            <!-- <router-link class="nav-link" :to="{ name: 'approve' }">
              <i class="fa-user-shield fas"></i> <strong>Quản lý tài khoản</strong>
            </router-link> -->
          </li>

          <li class="nav-item" @click="toggleCategory('orders')">
            <i class="fa-box fas"></i> <strong>Quản lý sách</strong>
            <i class="fas" :class="{'fa-chevron-down': !openCategories.orders, 'fa-chevron-up': openCategories.orders}"></i>
          </li>
          <ul v-if="openCategories.orders" class="sub-menu">
            <li class="sub-item">
              <router-link class="nav-link" :to="{ name: 'admin-NXB' }"> Quản lý NXB</router-link>
            </li>
            <li class="sub-item">
              <router-link class="nav-link" :to="{ name: 'admin-book' }"> Quản lý sách</router-link>
            </li>
        
          </ul>

          <li class="nav-item" @click="toggleCategory('products')">
            <i class="fa-shopping-cart fas"></i> <strong>Quản lý phê duyệt</strong>
            <i class="fas" :class="{'fa-chevron-down': !openCategories.products, 'fa-chevron-up': openCategories.products}"></i>
          </li>
          <ul v-if="openCategories.products" class="sub-menu">
          
            <li class="sub-item">
              <router-link class="nav-link" :to="{ name: 'admin-approve-book' }">Duyệt mượn sách</router-link>
            </li>
            <li class="sub-item">
              <router-link class="nav-link" :to="{ name: 'admin-approve-account' }">Duyệt thành viên</router-link>
            </li>
          </ul>
        </ul>
      </nav>
    </div>

  
<!-- 
    <nav  id="main-navbar" class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#sidebarMenu">
          <i class="fa-bars fas"></i>
        </button>

   

        <ul class="d-flex flex-row navbar-nav">
         
       
        </ul>


    

        <div class="navbar-nav">
          <div>
            <li v-if="!isLogin" class="nav-item">
              
              <router-link :to="{ name: 'admin-register' }" class="nav-link text-primary">Đăng ký</router-link>
            </li>
          </div> 
          <div>
            <li v-if="!isLogin"  class="nav-item"> 
              <router-link :to="{ name: 'admin-login' }" class="nav-link text-primary">Đăng nhập <i class="fa-user-circle fas"></i></router-link>
            </li>
          </div>
          <div v-if="isLogin" >
            <li class="nav-item">
              <router-link :to="{ name: 'admin-account' }" class="nav-link text-primary">Tài khoản <i class="fa-user-circle fas"></i></router-link>
            </li>
          </div>
          <div>
            <li class="nav-item">
              <button v-if="isLogin"  @click="handleLogout" class="nav-link text-danger">Đăng Xuất</button>
            </li>
          </div>
         
        </div>
      </div>
    </nav> -->
 <nav class="navbar fixed-top custom-navbar px-4 d-flex justify-content-between align-items-center">
      <!-- Bên trái: Tên hệ thống -->
      <div class="d-flex align-items-center gap-3">
        <i class="fas fa-book-reader fa-2x text-white"></i>
        <span class="text-white fw-bold fs-4">Quản lý thư viện</span>
      </div>

      <!-- Bên phải: Tài khoản / Đăng xuất -->
      <div class="d-flex align-items-center gap-4">
        <router-link :to="{ name: 'admin-account' }" class="nav-link text-white fw-bold">
          <i class="fas fa-user-circle me-1"></i> Tài khoản
        </router-link>
        <button @click="handleLogout" class="btn btn-outline-light btn-sm fw-bold">Đăng xuất</button>
      </div>
 </nav>
  </header>
</template>


<!-- <script>
import nhanvienService from '@/services/nhanvien.service';

export default {
  methods: {
    handleLogout() {
      nhanvienService.logout();
      this.$router.push('/user-login');
    }
  }
};
</script> -->

<style scoped>
.custom-navbar {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  height: 75px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-link {
  transition: all 0.3s ease;
  font-size: 16px;
}

.nav-link:hover {
  text-decoration: underline;
  transform: translateY(-1px);
}

.fs-4 {
  font-size: 1.5rem;
}
</style>



<script>
import nhanvienService from '@/services/nhanvien.service';

// import AuthService from "@/services/auth.service";
// import productService from "@/services/product.service";

export default {
  data() {
    return {
      searchQuery: "",
      categories: [],
      openCategories: {
        cat1: false,
        cat2: false
      }
    };
  },
  props:{
     nav_link: {
      type: String,
      required: true
  }
  },
  computed: {

        isLogin(){
            const token= nhanvienService.getUser();
            if(token!=null)
              return true;
            return false;
          }
  },
  methods: {
     toggleCategory(category) {
      this.openCategories[category] = !this.openCategories[category];
    },
    
    handleLogout(){
      nhanvienService.logout()
      this.$router.push('/user-login')
    }
  },
  async created() {
    // this.categories = await productService.getCategories();
    
  }
};

</script>


