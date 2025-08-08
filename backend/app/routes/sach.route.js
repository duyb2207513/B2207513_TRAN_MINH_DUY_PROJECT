const express = require('express');
const router = express.Router();
const booksController = require('../controllers/sach.controller');
const { upload } = require('../config/upload.config'); // Destructuring để lấy middleware upload

router
  .route('/')
  .get(booksController.findAll)    // Lấy tất cả sách
  .post(upload.single('hinhanh'), booksController.create); // Tạo mới sách với upload ảnh

router
  .route('/:masach')
  .get(booksController.findOne)    // Lấy sách theo masach
  .put(upload.single('hinhanh'), booksController.update) // Cập nhật sách với upload ảnh
  .delete(booksController.deleteOne); // Xóa sách theo masach

router.get('/search', booksController.findAll); // Tìm kiếm (cần điều chỉnh logic trong controller)

module.exports = router;