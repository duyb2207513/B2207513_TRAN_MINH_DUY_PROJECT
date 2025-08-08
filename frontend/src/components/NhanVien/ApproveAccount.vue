<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-primary fw-bold">📝 Phê Duyệt Tài Khoản Nhân Viên</h2>

    <!-- 🔸 Danh sách người chờ duyệt -->
    <div class="table-responsive mb-5">
      <h5 class="fw-bold">🔐 Người Dùng Chờ Duyệt</h5>
      <table class="table table-bordered align-middle bg-white shadow-sm">
        <thead class="table-light">
          <tr>
            <th>Họ tên</th>
            <th>Địa chỉ</th>
            <th>SĐT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersPending" :key="user.manhanvien">
            <td class="d-flex align-items-center">
              <img
                src="https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
                alt="avatar"
                class="rounded-circle me-2"
                style="width: 45px; height: 45px; object-fit: cover; border: 1px solid #ccc"
              />
              <span>{{ user.hoten }}</span>
            </td>
            <td>{{ user.diachi }}</td>
            <td>{{ user.sodienthoai }}</td>
            <td>
              <button class="btn btn-success btn-sm rounded-pill" @click="changeRole(user)">
                ✔️ Duyệt
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ Danh sách nhân viên đã duyệt -->
    <div class="table-responsive">
      <h5 class="fw-bold">✅ Nhân Viên Đã Được Duyệt</h5>
      <table class="table table-bordered align-middle bg-white shadow-sm">
        <thead class="table-light">
          <tr>
            <th>Họ tên</th>
            <th>Địa chỉ</th>
            <th>SĐT</th>
            <th>Chức vụ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersApproved" :key="user.manhanvien">
            <td class="d-flex align-items-center">
              <img
                src="https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
                alt="avatar"
                class="rounded-circle me-2"
                style="width: 45px; height: 45px; object-fit: cover; border: 1px solid #ccc"
              />
              <span>{{ user.hoten }}</span>
            </td>
            <td>{{ user.diachi }}</td>
            <td>{{ user.sodienthoai }}</td>
            <td>{{ user.chucvu }}</td>
            <td>
              <button class="btn btn-secondary btn-sm rounded-pill" @click="changeRole(user)">
                🔄 Cập nhật
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import authService from '@/services/nhanvien.service';

export default {
  data() {
    return {
      usersAll: []
    };
  },
  computed: {
    usersPending() {
      return this.usersAll.filter(user => !user.chucvu || user.chucvu.trim() === '');
    },
    usersApproved() {
      return this.usersAll.filter(user => user.chucvu && user.chucvu.trim() !== '');
    }
  },
  methods: {
    async fetchUsers() {
      try {
        this.usersAll = await authService.getAll();
      } catch (err) {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
      }
    },
    async changeRole(user) {
      if (confirm('Bạn có chắc chắn muốn duyệt / cập nhật vai trò người dùng này?')) {
        try {
          user.chucvu = 'nhân viên';
          await authService.update(user.manhanvien, user);
          alert('✔️ Cập nhật vai trò thành công!');
          this.fetchUsers();
        } catch (err) {
          alert('❌ Có lỗi xảy ra khi cập nhật vai trò.');
          console.error(err);
        }
      }
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
h2 {
  font-size: 1.75rem;
}
</style>
