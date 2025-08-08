<template>
  <footer class="bg-dark text-white pt-4 pb-3 mt-auto">
    <div class="container text-center text-md-start">
      <div class="row">

        <!-- Thông tin thư viện -->
        <div class="col-md-6 mb-3">
          <h5 class="text-uppercase">Thư Viện Trường ABC</h5>
          <p>
            Địa chỉ: 123 Đường Sách, Quận Tri Thức, TP. Học Hỏi<br />
            Điện thoại: (0123) 456 789<br />
            Email: library@abc.edu.vn
          </p>
        </div>

        <!-- Liên kết nhanh -->
        <div class="col-md-3 mb-3">
          <h5 class="text-uppercase">Liên kết</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-white">Trang chủ</router-link></li>
            <li><router-link to="/about" class="text-white">Giới thiệu</router-link></li>
            <li><router-link to="/contact" class="text-white">Liên hệ</router-link></li>
          </ul>
        </div>

        <!-- Mạng xã hội -->
        <div class="col-md-3 mb-3">
          <h5 class="text-uppercase">Theo dõi chúng tôi</h5>
          <a href="#" class="text-white me-3"><i class="fab fa-facebook"></i></a>
          <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-white"><i class="fab fa-instagram"></i></a>
        </div>

      </div>
    </div>

    <div class="text-center mt-4">
      <small>© 2025 Thư Viện Trường ABC. Mọi quyền được bảo lưu.</small>
    </div>
  </footer>
</template>

<script>

</script>

<style scoped>
/* footer {
  font-size: 0.35rem;
} */
a.text-white:hover {
  color: #ffc107 !important;
  text-decoration: underline;
}
</style>
