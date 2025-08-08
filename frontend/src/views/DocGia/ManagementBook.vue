<template>
  <div class="container mt-5">
    <h2 class="section-title">📚 Danh Sách Sách Đang Được Mượn</h2>
    

    <!-- 🔴 Quá Hạn -->
    <h4 class="status-title text-danger">🔴 Lịch sử mượn sách</h4>
    <div v-if="overdueBooks.length === 0" class="alert alert-info rounded shadow-sm">
      Không có sách nào bị quá hạn.
    </div>
    <table v-else class="table custom-table table-danger">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in overdueBooks" :key="book._id">
          <td><img :src="getImage(book)" class="book-img" /></td>
          <td>{{ book.tensach || 'Không rõ' }}</td>
          <td>{{ formatDate(book.ngaymuon) }}</td>
          <td class="text-danger">{{ formatDate(book.ngaytra) }}</td>
          <td> <button  class="btn btn-outline-primary btn-sm rounded-pill" @click="handleBorrow(book)">
              📖 Mượn lại
            </button></td>
        </tr>
      </tbody>
    </table>

    

    <!-- 🟢 Còn Hạn -->
    <h4 class="status-title text-success">🟢 Sách Còn Trong Thời Hạn</h4>
    <div v-if="onTimeBooks.length === 0" class="alert alert-info rounded shadow-sm">
      Không có sách nào đang được mượn trong thời hạn.
    </div>
    <table v-else class="table custom-table table-success">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in onTimeBooks" :key="book._id">
          <td><img :src="getImage(book)" class="book-img" /></td>
          <td>{{ book.tensach || 'Không rõ' }}</td>
          <td>{{ formatDate(book.ngaymuon) }}</td>
          <td class="text-success">{{ formatDate(book.ngaytra) }}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm rounded-pill" @click="setDate(book)">
              📤 Trả sách
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 🟡 Đang Chờ Duyệt -->
    <h4 class="status-title text-warning">🟡 Sách Đang Chờ Duyệt</h4>
    <div v-if="pendingBooks.length === 0" class="alert alert-info rounded shadow-sm">
      Không có sách nào đang chờ duyệt.
    </div>
    <table v-else class="table custom-table table-warning">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả dự kiến</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in pendingBooks" :key="book._id">
          <td><img :src="getImage(book)" class="book-img" /></td>
          <td>{{ book.tensach || 'Không rõ' }}</td>
          <td>{{ formatDate(book.ngaymuon) }}</td>
          <td>{{ formatDate(book.ngaytra) }}</td>
        </tr>
      </tbody>
    </table>



     <!-- 🔴\ Quá Hạn -->
    <h4 class="status-title ">Sách bị từ chối phê duyệt</h4>
    <div v-if="notapprovebooks.length === 0" class="alert alert-info rounded shadow-sm">
      Không có sách nào bị từ chối duyệt
    </div>
    <table v-else class="table custom-table table-light">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in notapprovebooks" :key="book._id">
          <td><img :src="getImage(book)" class="book-img" /></td>
          <td>{{ book.tensach || 'Không rõ' }}</td>
          <td>{{ formatDate(book.ngaymuon) }}</td>
          <td class="text-danger">Từ chối</td>
          <td> <button class="btn btn-outline-primary mt-auto w-100" @click="handleBorrow(book)">
              📖 Mượn lại
            </button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import nhanvienService from '@/services/nhanvien.service';
import phieumuon from '@/services/phieumuon';
import bookService from "@/services/sach.service"; // đảm bảo bạn có file này
export default {
  data() {
    return {
      overdueBooks: [],
      onTimeBooks: [],
      pendingBooks: [], // 🔴 Thêm danh sách đang chờ duyệt
      notapprovebooks:[],
    };
  },
async created() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const allBorrows = await phieumuon.getAll();          // 📦 Lấy tất cả phiếu mượn
    const allBooks = await bookService.getAll();          // 📚 Lấy danh sách sách
    const user = await nhanvienService.getUser();         // 👤 Lấy user hiện tại

    // 👉 Lọc ra các phiếu mượn thuộc về user này (so sánh mã độc giả)
    const myBorrows = allBorrows.filter(pm => pm.madocgia === user.madocgia);

    // 👉 Gắn thêm thông tin sách vào từng phiếu mượn
    const myBorrowsWithBooks = myBorrows.map(pm => {
      const matchedBook = allBooks.find(book => book.masach === pm.masach);
      return {
        ...pm,
        tensach: matchedBook?.tensach || "Không rõ",
        hinhanh: matchedBook?.hinhanh || null
      };
    });

    // 👉 Chia ra các loại phiếu mượn
    this.pendingBooks = myBorrowsWithBooks.filter(pm => !pm.manhanvien); // chưa duyệt
    const approvedBooks = myBorrowsWithBooks.filter(pm => pm.manhanvien); // đã duyệt

    this.overdueBooks = approvedBooks.filter(pm => new Date(pm.ngaytra) <= new Date(today));
    this.onTimeBooks = approvedBooks.filter(pm => new Date(pm.ngaytra) > new Date(today));
    this.notapprovebooks = myBorrowsWithBooks.filter(pm => pm.manhanvien && pm.ngaytra === "");

  } catch (error) {
    console.error("Lỗi khi tải danh sách mượn:", error);
  }
},

methods:{
  async handleBorrow(book) {
      const token = await nhanvienService.getUser();
      if (!token) {
        alert("Vui lòng đăng nhập");
      } else {
        this.$router.push({ name: 'borrowBook', params: { masach: book.masach } });
      }
    },
  getImage(book) {
  return book.hinhanh
    ? `http://localhost:3000/uploads/${book.hinhanh}`
    : "https://via.placeholder.com/100x140";
},
formatDate(dateStr) {
  if (!dateStr) return "Không rõ";
  return new Date(dateStr).toLocaleDateString('vi-VN');
},

  async setDate(book) {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // Cập nhật ngày trả là hôm nay
    const updatedBook = { ...book, ngaytra: today };
    console.log(updatedBook)
    // Gửi cập nhật lên server
    await phieumuon.update(book._id, updatedBook);

    // Cập nhật lại danh sách mượn sau khi sửa
    // this.created(); // hoặc tạo một hàm riêng để load lại danh sách
  } catch (error) {
    console.log("Lỗi khi trả sách:", error);
  }
}

}

};
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 2rem;
}

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.table.custom-table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.book-img {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

</style>
