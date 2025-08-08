const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs');

const app = express();

// Import các router
const DocGiaRouter = require("./app/routes/docgia.route");
const NhanVienRouter = require("./app/routes/nhanvien.route");
const PhieuMuonRouter = require("./app/routes/phieumuon.route");
const NXBRouter = require("./app/routes/nxb.route");
const SachRouter = require("./app/routes/sach.route");
const ApiError = require("./app/api-error");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/docgia", DocGiaRouter);
app.use("/api/nhanvien", NhanVienRouter);
app.use("/api/phieumuon", PhieuMuonRouter);
app.use("/api/NXB", NXBRouter);
app.use("/api/sach", SachRouter);

// Phục vụ file tĩnh từ thư mục uploads
const uploadsPath = path.join(__dirname, 'app/uploads');
console.log('Static uploads path:', uploadsPath);
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory:', uploadsPath);
}
app.use('/uploads', express.static(uploadsPath));

// Handle 404
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});


module.exports = app;