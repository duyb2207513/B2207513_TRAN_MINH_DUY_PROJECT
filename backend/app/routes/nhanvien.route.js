const NhanVienController = require("../controllers/nhanvien.controller");
const router = require("express").Router();

// Route tĩnh trước
router.post("/register", NhanVienController.register);//oke
router.post("/login", NhanVienController.login);//oke
router.get("/", NhanVienController.getAll);//oke

// Route động sau
router.get("/:manhanvien", NhanVienController.getOne);//oke
router.put("/:manhanvien", NhanVienController.update);//oke

module.exports = router;