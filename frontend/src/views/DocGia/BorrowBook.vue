<!-- 
  <template>
    <div class="container mt-5">
      <h2 class="mb-4 text-primary">Quản Lý Mượn Sách</h2>
      <BookSearch
            class="mx-3"
            v-model="searchTerm"
            @submit="handleSearch"
          />

      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-primary text-white">Danh Sách Sách</div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Hình Ảnh</th>
                <th>Tên sách</th>
                <th>Số quyển</th>
                <th>Đơn giá</th>
                <th>Năm xuất bản</th>
                <th>Nhà xuất bản</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book._id">
                <td>
                  <img
                    v-if="book.image"
                    :src="'data:image/jpeg;base64,' + book.image"
                    :alt="book.tensach"
                    class="img-thumbnail"
                    style="width: 50px; height: 50px; object-fit: cover;"
                  />
                  <img
                    v-else
                    src="https://via.placeholder.com/50"
                    :alt="book.tensach"
                    class="img-thumbnail"
                    style="width: 50px; height: 50px;"
                  />
                </td>
                <td>{{ book.tensach }}</td>
                <td>{{ book.soquyen }}</td>
                
                <td>
                  <button
                    @click="selectBook(book)"
                    class="btn btn-primary btn-sm"
                    :disabled="book.soluong <= 0"
                  >
                    {{ book.soquyen > 0 ? "Chọn Để Mượn" : "Hết Sách" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

////////////////////////////////////////////////////////////////////////////////////////////////////////
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">Thông Tin Mượn Sách</div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Hình Ảnh</label>
             
              <img
               
                src="https://via.placeholder.com/150"
                :alt="selectedBook.tensach"
                class="img-fluid rounded mb-3"
                style="max-width: 150px; max-height: 150px;"
              />
            </div>
            <div class="col-md-8">
              
              <div class="mb-3">
                <label class="form-label">Tên Sách</label>
                <input v-model="selectedBook.tensach" type="text" class="form-control" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Tác giả</label>
                <input v-model="selectedBook.tacgia" type="text" class="form-control" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Nhà xuất bản</label>
                <input v-model="tenNXB" type="text" class="form-control" readonly>
              </div>
              <div class="mb-3">
                <label for="nguoiMuon" class="form-label">Người Mượn</label>
                <input readonly
                  v-model="nguoiMuon"
                  type="text"
                  class="form-control"
                  required
                  placeholder="Nhập tên người mượn"
                />
              </div>
              <div class="d-flex">
                <div class="mb-3 w-50">
                <label for="ngayMuon" class="form-label">Ngày Mượn</label>
                <input
                  v-model="form.ngayMuon"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3 w-50">
                <label for="ngayTra" class="form-label">Ngày Trả</label>
                <input
                  v-model="form.ngayTra"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary w-100">Xác Nhận Mượn</button>
                <button
                  type="button"
                  @click="cancelSelection"
                  class="btn btn-secondary w-100"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
     
    </div>
  </template>

  <script>
import BookService from '@/services/sach.service';
import BookSearch from '@/components/NhanVien/BookSearch.vue';

export default {
  components: {
    BookSearch,
  },
  data() {
    return {
      books: [],
      selectedBook: null,
      form: {
        masach: '',
        nguoiMuon: '',
        ngayMuon: '',
        ngayTra: ''
      },
      searchTerm: "",
      nguoiMuon:"",

    };
  },
  async created() {
    const id = this.$route.params.masach; // <-- dùng :id bên route

    try {
      // Nếu có id truyền vào từ router (tức là được chọn từ card)
      if (id) {
        const book = await BookService.getOne(id);
        this.selectedBook = book;
        this.form.masach = book.masach;
      } else {
        // Nếu không thì load danh sách toàn bộ
        await this.fetchBooks();
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu sách:", error);
    }
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await BookService.getAll();
        this.books = response;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
      }
    },
    selectBook(book) {
      this.selectedBook = { ...book };
      this.form.masach = book._id || book.masach;
    },
    cancelSelection() {
      this.selectedBook = null;
      this.form = { masach: '', nguoiMuon: '', ngayMuon: '', ngayTra: '' };
    },
    async handleSubmit() {
      try {
        if (new Date(this.form.ngayMuon) > new Date(this.form.ngayTra)) {
          alert("Ngày mượn không được sau ngày trả.");
          return;
        }

        await BookService.borrowBook({
          masach: this.form.masach,
          nguoiMuon: this.form.nguoiMuon,
          ngayMuon: this.form.ngayMuon,
          ngayTra: this.form.ngayTra
        });

        alert('Mượn sách thành công!');
        this.cancelSelection();
        this.$router.push({ name: 'borrowSuccess' });
        await this.fetchBooks(); // Cập nhật danh sách
      } catch (error) {
        console.error('Lỗi khi mượn sách:', error);
        alert('Lỗi khi mượn sách: ' + (error.message || 'Vui lòng thử lại.'));
      }
    },
    async handleSearch(term) {
      if (term) {
        this.books = await BookService.find(term);
      } else {
        this.books = await BookService.getAll();
      }
    }
  }
};
</script>

  <style scoped>
  .card-header {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .table th,
  .table td {
    vertical-align: middle;
  }
  .img-thumbnail {
    border-radius: 5px;
  }
  </style> -->
  <template>
  <div class="container mt-5">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">Thông Tin Mượn Sách</div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="row g-3">
          <div class="col-md-4">
           
            <img
            :src="`http://localhost:3000/uploads/${selectedBook.hinhanh}`"
            :alt="selectedBook?.tensach || 'No image'"
            class="book-detail-image"
          />

           
          </div>
          <div class="col-md-8">
           
            <div class="mb-3">
              <label class="form-label">Tên Sách</label>
              <input v-model="selectedBook.tensach" type="text" class="form-control" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Tác giả</label>
              <input v-model="selectedBook.tacgia" type="text" class="form-control" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Nhà xuất bản</label>
              <input v-model="tenNXB" type="text" class="form-control" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Người Mượn</label>
              <input readonly v-model="nguoiMuon" type="text" class="form-control" >
            </div>
            Thời hạn mượn là 2 tuần:
            <div class="d-flex">
              <div class="mb-3 w-50 pe-2">
                <label class="form-label">Từ ngày</label>
                <input readonly v-model="form.ngayMuon" type="date" class="form-control" >
              </div>
              <div class="mb-3 w-50 ps-2">
                <label class="form-label">Đến ngày </label>
                <input readonly v-model="form.ngayTra" type="date" class="form-control" >
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary w-100">Xác Nhận Mượn</button>
              <button type="button" @click="cancelSelection" class="btn btn-secondary w-100">Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from '@/services/sach.service';
import NXBService from '@/services/nxb.service';

import nhanvienService from '@/services/nhanvien.service';
import docgiaService from '@/services/docgia.service';
import phieumuon from '@/services/phieumuon';

export default {
  data() {
    return {
      selectedBook: {},
      form: {
        masach: '',
        ngayMuon: '',
        ngayTra: '',
      },
      nguoiMuon: '',
      docgia:{},
      tenNXB: 'Không rõ',
    };
  },
  async created() {
    const id = this.$route.params.masach;

    try {
      // Lấy thông tin sách
      const book = await BookService.getOne(id);
      this.selectedBook = book;
      this.form.masach = book.masach;
      
      // Lấy người mượn (giả sử từ nhân viên đang đăng nhập)
      const user = await nhanvienService.getUser();
      
      const DocGia =await docgiaService.getOne(user.madocgia);
        this.docgia=DocGia
      this.nguoiMuon = DocGia?.holot +" "+ DocGia?.ten || 'Chưa đăng nhập';
      this.form.nguoiMuon = this.nguoiMuon;
        console.log(this.selectedBook)
      // Lấy tên NXB từ mã NXB
      const nxb = await NXBService.getNXB(this.selectedBook.maNXB)
      
      this.tenNXB = nxb?.tenNXB || 'Không rõ';

      // Gán ngày mặc định
      const today = new Date().toISOString().substr(0, 10);
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      const maxDate = twoWeeksLater.toISOString().substr(0, 10);

      this.form.ngayMuon = today;
      this.form.ngayTra = maxDate;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  },
  methods: {
    cancelSelection() {
      this.$router.push({ name: 'user-book' });
    },
    async handleSubmit() {
  // Kiểm tra ngày trả không quá 14 ngày sau ngày mượn
  if (new Date(this.form.ngayTra) > new Date(this.form.ngayMuon).setDate(new Date(this.form.ngayMuon).getDate() + 14)) {
    alert('Ngày trả không được quá 14 ngày sau ngày mượn.');
    return;
  }

  try {
    // Lấy toàn bộ phiếu mượn
    const allPhieuMuon = await phieumuon.getAll();

    // Kiểm tra xem đã tồn tại phiếu mượn với độc giả và sách này chưa
    const exists = allPhieuMuon.some(pm => 
      pm.madocgia === this.docgia.madocgia && 
      pm.masach === this.selectedBook.masach
    );

    if (exists) {
      alert('Bạn đã mượn sách này rồi. Không thể mượn lại cùng một cuốn sách.');
      return;
    }

    // Nếu chưa mượn thì cho mượn sách
    await phieumuon.create({
      madocgia: this.docgia.madocgia,
      masach: this.selectedBook.masach,
      ngaymuon: this.form.ngayMuon,
      ngaytra: this.form.ngayTra,
      manhanvien: ""
    });

    alert('Mượn sách thành công!');
    this.$router.push({ name: 'user-book' });
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    alert('Lỗi: ' + (error.message || 'Không thể mượn sách.'));
  }
}

  }
};
</script>

<style scoped>
.card-header {
  font-size: 1.25rem;
  font-weight: bold;
}
.book-image,
.book-detail-image {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

</style>
