
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const DocGiaService = require("../services/docgia.service");

class DocGiaController {
    async register(req, res, next) {
        try {
            console.log("Bắt đầu gọi hàm");
            const docGiaService = new DocGiaService(MongoDB.getClient());
            console.log("Tiếp theo nè");
            const result = await docGiaService.validateAndRegisterReader(req.body);
            console.log("Hết lỗi rồi nè");
            if (!result.success) {
                console.log("Lỗi:", result.errors);
                return res.status(400).json({ success: false, errors: result.errors });
            }
            console.log("Đăng ký thành công:", result.data);
            return res.status(201).json({ success: true, data: result.data });
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            return next(new ApiError(500, "Lỗi khi đăng ký"));
        }
    }

    async login(req, res, next) {
        try {
            const docGiaService = new DocGiaService(MongoDB.getClient());
            const { sodienthoai } = req.body;
            if (!sodienthoai) {
                return next(new ApiError(400, "Số điện thoại là bắt buộc"));
            }
            const result = await docGiaService.userlogin(sodienthoai);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            return next(new ApiError(500, "Lỗi khi đăng nhập"));
        }
    }
      async sendOtp(req, res, next) {
        try {
            const { sodienthoai, hoten } = req.body;
            if (!sodienthoai) {
                return next(new ApiError(400, "Số điện thoại là bắt buộc"));
            }
            const docGiaService = new DocGiaService(MongoDB.getClient());
            console.log("Bắt đầu gửi OTP");
            const result = await docGiaService.sendOtpService(sodienthoai, hoten || "Khách hàng");
            console.log("Kết quả gửi OTP:", result);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error("Lỗi khi gửi OTP:", error);
            return next(new ApiError(500, "Lỗi khi gửi OTP"));
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const { sodienthoai, otp } = req.body;
            if (!sodienthoai || !otp) {
                return next(new ApiError(400, "Số điện thoại và OTP là bắt buộc"));
            }
            const docGiaService = new DocGiaService(MongoDB.getClient());
            const result = await docGiaService.verifyOtpService(sodienthoai, otp);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error("Lỗi khi xác thực OTP:", error);
            return next(new ApiError(500, "Lỗi khi xác thực OTP"));
        }
    }
    async getOne(req, res, next) {
        try {
            const docGiaService = new DocGiaService(MongoDB.getClient());
            const result = await docGiaService.getOne(req.params.madocgia);
            if (!result) {
                return next(new ApiError(404, "Không tìm thấy độc giả"));
            }
            return res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin độc giả:", error);
            return next(new ApiError(500, "Lỗi khi lấy thông tin độc giả"));
        }
    }

    async getAll(req, res, next) {
        try {
            const docGiaService = new DocGiaService(MongoDB.getClient());
            const result = await docGiaService.getAll();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách độc giả:", error);
            return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
        }
    }
    async update(req, res, next) {
    try {
      const docGiaService = new DocGiaService(MongoDB.getClient());
      const madocgia = req.params.madocgia; // Lấy từ params
      const payload = req.body; // Dữ liệu từ body
      const result = await docGiaService.update(madocgia, payload);

      if (result.message) {
        return res.status(404).json({ success: false, message: result.message });
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: `Cập nhật độc giả ${madocgia} thành công`,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật độc giả:", error);
      return next(new ApiError(500, error.message || "Lỗi khi cập nhật độc giả"));
    }
  }
}

module.exports = new DocGiaController(); 