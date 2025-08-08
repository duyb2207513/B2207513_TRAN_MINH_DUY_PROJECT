<!-- 
<template>
 

  <div class="mt-5 bg-light p-2">
     <BookSearch 
    v-model="searchTerm"
    @submit="handleSearch"
  />
    <div class="row">
      <div
        class="col-md-3 my-3"
        v-for="(book, index) in books"
        :key="index"
      >
        <div class="card h-100 shadow-sm">
          <img
            :src="`http://localhost:3000/uploads/${book.hinhanh}`"
            class="card-img-top"
            style="height: 200px; object-fit: cover;"
            alt="Book Image"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ book.tensach }}</h5>
            <p class="card-text">
              <strong>Tên sách:</strong> {{ book.tensach }}<br>
              <strong>Tác giả:</strong> {{ book.tacgia }}<br>
              <strong>Số lượng:</strong> {{ book.soquyen }}<br>
              <strong>Đơn giá:</strong> {{ book.dongia }}.vnđ
            </p>
            <button
              class="btn btn-primary mt-auto" 
              @click="handleBorrow(book)"
            >
              Mượn sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <script>
  import BookService from '@/services/sach.service';
  import BookSearch from '@/components/NhanVien/BookSearch.vue';
import nhanvienService from '@/services/nhanvien.service';

  export default {
    components:{
      BookSearch
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
        searchTerm:""
      };
    },
    async created() {
      await this.fetchBooks();
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await BookService.getAll();
          console.log(response)
          this.books = response;
        } catch (error) {
          console.error('Lỗi khi lấy sách:', error);
        }
      },
      selectBook(book) {
        this.selectedBook = { ...book };
        this.form.masach = book._id;
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
          this.$router.push({ name: 'borrowSuccess' });
          this.cancelSelection();
          await this.fetchBooks(); // Refresh book list to update quantities
        } catch (error) {
          console.error('Lỗi khi mượn sách:', error);
          alert('Lỗi khi mượn sách: ' + (error.message || 'Vui lòng thử lại.'));
        }
      },
        async handleSearch(term) {
        console.log('Search term updated:', term);
        if (term) {
          this.books = await BookService.find(term);
        } else {
          this.books = await BookService.getAll();
        }
        
  },
  async handleBorrow(book){
          const token= await nhanvienService.getUser()
          if(!token){
            alert("Vui lòng đăng nhập")
          }
          else
            this.$router.push({ name: 'borrowBook', params: { masach:book.masach } })
        }

      // async fetchBooks(){
      //   try {
      //     console.log('Fetching books with searchTerm:', searchTerm.value);
      //     const response = searchTerm.value
      //       ? await bookService.find(searchTerm.value)
      //       : await bookService.getAll();
      //     Books.value = Array.isArray(response) ? response : [];
      //     console.log('Books fetched:', Books.value);
      //   } catch (error) {
      //     console.error('Lỗi khi lấy danh sách sách:', error);
      //     alert('Lỗi khi lấy danh sách sách.');
      //     Books.value = [];
      //   }
      // };
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
    <!-- Thanh tìm kiếm đặt giữa -->
    <BookSearch v-model="searchTerm" @submit="handleSearch" />

    <h2 class="text-center text-primary my-4">📚 Thư viện sách</h2>

    <div class="row">
      <div
        class="col-sm-6 col-md-4 col-lg-3 mb-4"
        v-for="(book, index) in books"
        :key="index"
      >
        <div class="card h-100 shadow-sm book-card">
          <img
            :src="`http://localhost:3000/uploads/${book.hinhanh}`"
            class="card-img-top"
            alt="Book Image"
            style="height: 300px; object-fit: cover; width: 100%;"
          />
          <div class="card-body">
            <h5 class="card-title  text-center text-truncate" :title="book.tensach">{{ book.tensach }}</h5>
            <p class="card-text text-center">
              <strong>Tác giả:</strong> {{ book.tacgia }}<br />
              <strong>Số lượng:</strong> {{ book.soquyen }}<br />
              <strong>Giá:</strong> {{ book.dongia.toLocaleString() }} vnđ
            </p>
            <button class="btn btn-outline-primary mt-auto w-100" @click="handleBorrow(book)">
              📖 Mượn sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  transition: transform 0.3s ease;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  height: 240px;
  object-fit: cover;
  width: 100%;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  flex-grow: 1;
  line-height: 1.4;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
}
</style>

<script>
import BookService from '@/services/sach.service';
import BookSearch from '@/components/NhanVien/BookSearch.vue';
import nhanvienService from '@/services/nhanvien.service';

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
      searchTerm: ""
    };
  },
  async created() {
    await this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await BookService.getAll();
        this.books = response;
      } catch (error) {
        console.error('Lỗi khi lấy sách:', error);
      }
    },
    async handleSearch(term) {
      if (term) {
        this.books = await BookService.find(term);
      } else {
        this.books = await BookService.getAll();
      }
    },
    async handleBorrow(book) {
      const token = await nhanvienService.getUser();
      if (!token) {
        alert("Vui lòng đăng nhập");
      } else {
        this.$router.push({ name: 'borrowBook', params: { masach: book.masach } });
      }
    }
  }
};
</script>
