<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="fas fa-building me-2 text-primary"></i>Danh sách nhà xuất bản
      </h2>
      <router-link :to="{ name: 'admin-add-NXB' }" class="btn btn-danger shadow-sm">
        <i class="fa-solid fa-plus me-1"></i> Thêm NXB
      </router-link>
    </div>

    <div class="table-responsive table-container shadow-sm rounded">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-primary">
          <tr>
            <th scope="col">Mã nhà xuất bản</th>
            <th scope="col">Tên nhà xuất bản</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col" class="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nxb in NXB" :key="nxb._id">
            <td><strong>{{ nxb.maNXB }}</strong></td>
            <td>{{ nxb.tenNXB }}</td>
            <td>{{ nxb.diachi }}</td>
            <td class="text-end">
              <router-link
                :to="{ name: 'admin-edit-NXB', params: { maNXB: nxb.maNXB } }"
                class="btn btn-warning btn-sm me-2"
              >
                <i class="fa-solid fa-pen"></i> Chỉnh sửa
              </router-link>
              <button class="btn btn-secondary btn-sm" @click="deleteOne(nxb.maNXB)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="NXB.length === 0">
            <td colspan="4" class="text-center text-muted">Không có dữ liệu nhà xuất bản.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.table-container {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px;
}

.table th,
.table td {
  vertical-align: middle;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-hover tbody tr:hover {
  background-color: #f1f9ff;
  transition: 0.2s;
}
</style>
<script>
import nxbService from '@/services/nxb.service';
import sachService from '@/services/sach.service';

export default {
  data() {
    return {
      NXB: [],
    };
  },
  methods: {
    async fetchNXB() {
      this.NXB = await nxbService.getAll();
    },

    async deleteOne(maNXB) {
      try {
        const allBooks = await sachService.getAll();
        const isLinked = allBooks.some(book => book.maNXB === maNXB);

        if (isLinked) {
          alert(`Không thể xóa NXB ${maNXB} vì đang có sách thuộc NXB này.`);
          return;
        }

        await nxbService.deleteNXB(maNXB);
        alert(`Đã xóa NXB ${maNXB} thành công.`);
        await this.fetchNXB();
      } catch (error) {
        console.error("Lỗi khi xóa NXB:", error);
        alert("Đã xảy ra lỗi khi xóa.");
      }
    },
  },
  async created() {
    await this.fetchNXB();
  },
};
</script>
