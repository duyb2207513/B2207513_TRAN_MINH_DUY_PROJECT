<template>
  <div class="container py-4">
    <!-- Tiêu đề + Nút thêm + Ô tìm kiếm -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">
        <i class="fa-solid fa-book-open me-2 text-primary"></i>Danh sách quyển sách
      </h3>

      <div class="d-flex align-items-center">
        <router-link :to="{ name: 'admin-book-add' }" class="btn btn-success me-3">
          <i class="fa-solid fa-plus me-1"></i> Thêm sách
        </router-link>

        <SearchInput v-model="searchTerm" @submit="handleSearch" />
      </div>
    </div>

    <!-- Bảng danh sách sách -->
    <div class="table-responsive shadow rounded">
      <table class="table align-middle table-bordered mb-0 bg-white">
        <thead class="table-light">
          <tr class="text-center">
            <th>Hình ảnh</th>
            <th>Tên sách</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm XB</th>
            <th>NXB</th>
            <th>Tác giả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(book, index) in Books"
            :key="book.masach"
            :class="{ 'table-active': index === activeIndex }"
            @click="updateActiveIndex(index)"
          >
            <td class="text-center">
              <img :src="`http://localhost:3000/uploads/${book.hinhanh}`" class="img-thumbnail" style="height: 60px;" />
            </td>
            <td>{{ book.tensach }}</td>
            <td>{{ book.dongia.toLocaleString() }} đ</td>
            <td>{{ book.soquyen }}</td>
            <td>{{ book.namxuatban }}</td>
            <td>{{ getTenNXB(book.maNXB) }}</td>
            <td>{{ book.tacgia }}</td>
            <td class="text-center">
              <router-link
                :to="{ name: 'admin-book-edit', params: { masach: book.masach } }"
                class="btn btn-sm btn-warning me-2"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </router-link>
              <button class="btn btn-sm btn-outline-danger" @click.stop="deleteOne(book.masach)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="Books.length === 0">
            <td colspan="8" class="text-center text-muted">Không tìm thấy sách nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- <Chart/> -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import bookService from '@/services/sach.service';
import nxbService from '@/services/nxb.service';
import SearchInput from './BookSearch.vue';
import phieumuon from '@/services/phieumuon';
// import Chart from '@/views/NhanVien/Chart.vue';

export default {
  components: {
    SearchInput,
    // Chart
  },
  setup() {
    const Books = ref([]);
    const NXBList = ref([]);
    const searchTerm = ref('');
    const activeIndex = ref(-1);

    const fetchBooks = async () => {
      try {
        console.log('Fetching books with searchTerm:', searchTerm.value);
        const response = searchTerm.value
          ? await bookService.find(searchTerm.value)
          : await bookService.getAll();
        Books.value = Array.isArray(response) ? response : [];
        console.log('Books fetched:', Books.value);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
        alert('Lỗi khi lấy danh sách sách.');
        Books.value = [];
      }
    };

    const fetchNXBs = async () => {
      try {
        const response = await nxbService.getAll();
        NXBList.value = Array.isArray(response) ? response : [];
        console.log('NXB fetched:', NXBList.value);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách NXB:', error);
      }
    };

    const deleteOne = async (masach) => {
      try {
        // Lấy danh sách tất cả phiếu mượn
        const allBorrows = await phieumuon.getAll();

        // Kiểm tra xem có phiếu nào đang mượn sách này không
        const isBookBorrowed = allBorrows.some(borrow => borrow.masach === masach);
        if (isBookBorrowed) {
          alert(`Không thể xóa sách ${masach} vì đang có người mượn.`);
          return; // Không cho phép xóa
       }

    // Nếu không có ai mượn, tiến hành xóa
    await bookService.delete(masach);
    alert(`Xóa thành công ${masach}`);
    await fetchBooks();
      } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        alert('Lỗi khi xóa sách.');
      }
    };

    const getTenNXB = (maNXB) => {
      const nxb = NXBList.value.find(n => n.maNXB === maNXB);
      return nxb ? nxb.tenNXB : '(không rõ)';
    };

    const handleSearch = async (term) => {
      searchTerm.value = term;
      console.log('Search term updated:', searchTerm.value);
      await fetchBooks();
    };

    const updateActiveIndex = (index) => {
      activeIndex.value = index === activeIndex.value ? -1 : index;
      console.log('Active index updated:', activeIndex.value);
    };

    onMounted(async () => {
      await fetchBooks();
      await fetchNXBs();
    });

    return {
      Books,
      NXBList,
      searchTerm,
      activeIndex,
      fetchBooks,
      fetchNXBs,
      deleteOne,
      getTenNXB,
      handleSearch,
      updateActiveIndex,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
}
.table th,
.table td {
  vertical-align: middle;
}
.img-thumbnail {
  object-fit: cover;
  border-radius: 6px;
}
.table-active {
  background-color: #f1f1f1;
}
</style>
