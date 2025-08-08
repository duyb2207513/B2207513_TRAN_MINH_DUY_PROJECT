<template>
  <AppHeader :nav_link="'1'" />
  <h1>Quản lý cho mượn</h1>

  <div v-if="hasPendingApproval">
    <table class="table align-middle mb-0 bg-white shadow border">
      <thead class="bg-light">
        <tr>
          <th>Tên sách</th>
          <th>Người mượn</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in phieumuon" :key="user._id" v-if="isNullWork(user.manhanvien)">
          <td><p class="fw-bold mb-1">{{ user.tensach }}</p></td>
          <td><p class="fw-bold mb-1">{{ user.docgia_holot }} {{ user.docgia_ten }}</p></td>
          <td><p class="text-muted mb-0">{{ user.ngaymuon }}</p></td>
          <td><p class="text-muted mb-0">{{ user.ngaytra }}</p></td>
          <td>
            <button type="button" class="btn btn-success btn-sm fw-bold me-2" @click="changeRole(user)">Duyệt</button>
            <button type="button" class="btn btn-danger btn-sm fw-bold" @click="changeDate(user)">Không duyệt</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="alert alert-info mt-3">Hiện không có phiếu mượn nào đang chờ duyệt.</div>

  <BooksLendingManagement />
</template>


<script>
import docgiaService from '@/services/docgia.service';
import nhanvienService from '@/services/nhanvien.service';
import phieumuon from '@/services/phieumuon';
import bookService from '@/services/sach.service';
import BooksLendingManagement from '@/views/NhanVien/BooksLendingManagement.vue';

export default {
  components: {
    BooksLendingManagement
  },
  computed: {
  hasPendingApproval() {
    return this.phieumuon.some(pm => pm.manhanvien === "");
  }
},
  data() {
    return {
      phieumuon: [],
      admin: {},
      book: {},
      user: {},
    };
  },
  methods: {
    isNullWork(chucvu) {
      return chucvu === "";
    },
    async fetchData() {
      const list = await phieumuon.getAll();
      const updatedList = await Promise.all(list.map(async (pm) => {
        const book = await this.getBook(pm.masach);
        const docgia = await this.getDocGia(pm.madocgia);
        const nhanvien = await this.getNhanVien(pm.manhanvien);

        return {
          ...pm,
          tensach: book?.tensach || pm.masach,
          docgia_holot: docgia?.holot || "",
          docgia_ten: docgia?.ten || "",
          nhanvien_hoten: nhanvien?.hoten || pm.manhanvien
        };
      }));

      this.phieumuon = updatedList;
    },
    async getDocGia(madocgia) {
      return await docgiaService.getOne(madocgia);
    },
    async getNhanVien(manhanvien) {
      return await nhanvienService.getOne(manhanvien);
    },
    async getBook(masach) {
      return await bookService.getOne(masach);
    },
    getuser() {
      const result = nhanvienService.getUser();
      return result.manhanvien;
    },
    async changeRole(user) {
      if (confirm("Bạn muốn duyệt quyển sách của người dùng này chứ")) {
        user.manhanvien = this.getuser();
        await phieumuon.update(user._id, user);
        alert("Duyệt thành công!");
      }
      this.fetchData();
    },
    async changeDate(user) {
      if (confirm("Bạn muốn không duyệt quyển sách của người dùng này chứ")) {
        user.manhanvien = this.getuser();
        user.ngaytra = "";
        await phieumuon.update(user._id, user);
        alert("Đã cập nhật!");
      }
      this.fetchData();
    }
  },
  async created() {
    this.fetchData();
    this.getuser();
  }
};
</script>