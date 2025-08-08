const multer = require("multer");
const path = require("path");
const fs = require('fs'); // Thêm fs để tạo thư mục nếu cần

// Cấu hình lưu trữ ảnh sách
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads'); // Lưu vào app/uploads
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('Created uploads directory:', uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  },
});

// Cấu hình lưu trữ ảnh avatar
const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    const avatarPath = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(avatarPath)) {
      fs.mkdirSync(avatarPath, { recursive: true });
      console.log('Created avatars directory:', avatarPath);
    }
    cb(null, avatarPath);
  },
  filename: (req, file, cb) => {
    cb(null, "avatar_" + Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  },
});

const upload = multer({ storage: storage }); // Tạo middleware multer cho ảnh sách
const uploadAvatar = multer({ storage: storageAvatar }); // Tạo middleware multer cho avatar

module.exports = { upload, uploadAvatar }; // Export cả hai middleware