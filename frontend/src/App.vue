<script>
import AppHeaderKH from './components/DocGia/AppHeader.vue';
import AppHeaderNV from './components/NhanVien/AppHeader.vue';
import { jwtDecode } from 'jwt-decode';
import nhanvienService from './services/nhanvien.service';
import AppFooter from './views/AppFooter.vue';

export default {
  components: {
    AppHeaderKH,
    AppHeaderNV,
    AppFooter
  },
  data() {
    return {
      role: null,
    };
  },
  mounted() {
    window.addEventListener('storage', this.updateRole);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.updateRole);
  },
  created() {
    const user = nhanvienService.getUser();
    if (user) {
      this.role = user.role;
      console.log('Decoded user role:', this.role);
    }
  },
  computed: {
    isNhanVien() {
      return this.role === 'nv';
    },
  },
  methods: {
    updateRole() {
      const user = nhanvienService.getUser();
      this.role = user ? user.role : null;
    }
  }
};
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <div  v-if="isNhanVien">
      <main class="main1 ">
      <AppHeaderNV />
      <div class="router flex-grow-1 router1">
        <router-view />
      </div>
      <!-- <AppFooter /> -->
    </main>
    
    </div>
    <div  v-else >
      <main class="main2 container">
      <AppHeaderKH />
      <div class="router flex-grow-1">
        <router-view />
      </div>
      
    </main>
    <AppFooter />
    </div>
  </div>
</template>

<style>
/* Đảm bảo toàn bộ trang chiếm ít nhất 100vh */
#app {
  display: flex;
  flex-direction: column;
  /* min-height: 100vh; */
}
.router1{
  min-height: 575px;
}
.main1 {
  padding-left: 210px;
  padding-top: 75px;
  flex-grow: 1; /* Cho phép main1 mở rộng để đẩy footer xuống dưới */
  /* min-height: 0;  */
  /* min-height: 1200px; */
}

.main2 {
  min-height: 300px;
  padding-top: 30px;
}



.router {
  flex: 1 0 auto; /* Nội dung trong router mở rộng */
}

footer {
  margin-top: auto; /* Đẩy footer xuống dưới cùng */
  width: 100%;
  flex-shrink: 0; /* Ngăn footer co lại */
}


/* Media query */
@media (min-width: 991.98px) {
  .main1 {
    padding-left: 210px;
    padding-top: 75px;
  }
  .main2 {
    min-height: 300px;
    padding-top: 30px;
  }
}

@media (max-width: 991.98px) {
  .sidebar {
    width: 100%;
  }
  .main1 {
    padding-left: 0;
    padding-top: 75px;
  }
  .main2 {
    padding-top: 30px;
  }
}

/* Các style khác giữ nguyên */
.navbar {
  font-family: "Arial", sans-serif;
  margin-bottom: 1;
}

#sidebarMenu {
  background-color: rgba(113, 224, 255, 0.211);
}


.sidebar .active {
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar {
  padding: 75px 0 0;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  background: #f8f9fa;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  z-index: 600;
}

.active-sidebar {
  background: #f0f0f0;
}

.sidebar-menu {
  list-style: none;
  padding: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 0px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.nav-item:hover {
  background: #e9ecef;
}

.sub-menu {
  padding-left: 10px;
}

.sub-item {
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.nav-link {
  text-decoration: none;
}

.sub-item:hover {
  background: #dde1e7;
}

.icon {
  font-size: 18px;
}

.arrow {
  font-size: 14px;
  margin-left: auto;
}

.breadcrumb-container {
  background-color: #f8f9fa;
  padding: 8px 15px;
  border-radius: 5px;
  margin-left: 240px;
  position: relative;
  z-index: 500;
}

.breadcrumb {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  font-size: 14px;
}

.breadcrumb-item a {
  text-decoration: none;
  color: #007bff;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #6c757d;
}
</style>