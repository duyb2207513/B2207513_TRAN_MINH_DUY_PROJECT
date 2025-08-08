const axios = require('axios');
const { setOtp, verifyOtp } = require('../utils/otpStore'); // Giả định bạn đã có module lưu trữ OTP
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Thông tin API eSMS
const API_KEY = "5070F2235223FAE2C097E2B5CE5352";
const SECRET_KEY = "E249BEA061081C83C3CB3934133979";
console.log("API_KEY:", API_KEY);
console.log("SECRET_KEY:", SECRET_KEY);
const ZALO_OA_ID = "4097311281936189049";
const ZALO_TEMP_ID = "205644";
const ZALO_BRANDNAME = "SVoucher";
const SMS_BRANDNAME = "Baotrixemay";
const SMS_TYPE = 2;
class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }

    async validateAndRegisterReader(payload) {
        const errors = [];

        // Ràng buộc: SĐT đúng định dạng 10 chữ số
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(payload.sodienthoai)) {
            errors.push("Số điện thoại không hợp lệ (phải có đúng 10 chữ số).");
        }

        // Ràng buộc: ngày sinh < năm 2025
        const birthYear = new Date(payload.ngaysinh).getFullYear();
        if (birthYear >= 2025) {
            errors.push("Ngày sinh phải nhỏ hơn năm 2025.");
        }

        // Ràng buộc: phái chỉ là 0 hoặc 1
        if (payload.phai !== 0 && payload.phai !== 1) {
            errors.push("Phái chỉ được là 0 (nữ) hoặc 1 (nam).");
        }

        // Kiểm tra trùng số điện thoại
        const existingPhone = await this.DocGia.findOne({ sodienthoai: payload.sodienthoai });
        if (existingPhone) {
            errors.push("Số điện thoại đã được sử dụng.");
        }

        // Nếu có lỗi, trả về
        if (errors.length > 0) {
            return { success: false, errors };
        }

        // Tạo madocgia ngẫu nhiên và kiểm tra trùng
        let madocgia;
        let isDuplicate = true;
        while (isDuplicate) {
            madocgia = "DG-" + uuidv4().split("-")[0];
            const exists = await this.DocGia.findOne({ madocgia });
            if (!exists) isDuplicate = false;
        }

        // Tạo object insert
        const docGia = {
            madocgia,
            holot: payload.holot,
            ten: payload.ten,
            ngaysinh: payload.ngaysinh,
            phai: payload.phai,
            diachi: payload.diachi,
            sodienthoai: payload.sodienthoai
        };

        await this.DocGia.insertOne(docGia);
        return { success: true, data: docGia };
    }

    async sendOtpService(phone, customerName = "Khách hàng") {
        // Tạo mã OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu OTP vào store
        setOtp(phone, otp);
        console.log(phone)
        // Thử gửi OTP qua Zalo trước
        try {
            const zaloUrl = "https://rest.esms.vn/MainService.svc/json/SendZaloMessage_V4_post_json/";
            const zaloPayload = {
                ApiKey: API_KEY,
                SecretKey: SECRET_KEY,
                Phone: phone,
                Params: [customerName, otp],
                IsJourney: false,
                OrderId: `ORDER_${Math.floor(Math.random() * 9000 + 1000)}`,
                TempID: ZALO_TEMP_ID,
                OAID: ZALO_OA_ID,
                RequestId: `REQ_${Math.floor(Math.random() * 9000 + 1000)}`,
                CallbackUrl: "",
            };

            const zaloResponse = await axios.post(zaloUrl, zaloPayload, {
                headers: { "Content-Type": "application/json" },
            });

            if (zaloResponse.data.CodeResult === "100") {
                return { success: true, message: "Đã gửi OTP qua Zalo thành công" };
            }
        } catch (error) {
            console.error("Lỗi khi gửi OTP qua Zalo:", error.message);
        }

        // Nếu Zalo thất bại, thử gửi qua SMS
        try {
            const smsUrl = "https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/";
            const smsContent = `${otp} la ma xac minh dang ky Baotrixemay cua ban`;
            const smsPayload = {
                ApiKey: API_KEY,
                SecretKey: SECRET_KEY,
                Content: smsContent,
                Phone: phone,
                Brandname: SMS_BRANDNAME,
                SmsType: SMS_TYPE,
            };

            const smsResponse = await axios.post(smsUrl, smsPayload, {
                headers: { "Content-Type": "application/json" },
            });

            if (smsResponse.data.CodeResult === "100") {
                return { success: true, message: "Đã gửi OTP qua SMS thành công" };
            } else {
                return { success: false, message: `Gửi OTP qua SMS thất bại: ${smsResponse.data.ErrorMessage}` };
            }
        } catch (error) {
            console.error("Lỗi khi gửi OTP qua SMS:", error.message);
            return { success: false, message: "Lỗi khi gửi OTP" };
        }
    }

    async verifyOtpService(phone, otp) {
        const isValid = verifyOtp(phone, otp);
        if (!isValid) {
            return { success: false, message: "Mã OTP không hợp lệ hoặc đã hết hạn." };
        }

        // Tìm độc giả theo số điện thoại
        const user = await this.DocGia.findOne({ sodienthoai: phone });
        if (!user) {
            return { success: false, message: "Không tìm thấy độc giả với số điện thoại này." };
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id, madocgia: user.madocgia, sodienthoai: user.sodienthoai, role: "kh" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { success: true, message: "Xác thực OTP thành công", token };
    }

    async userlogin(sodienthoai) {
        const docGia = await this.DocGia.findOne({ sodienthoai });
        if (!docGia) {
            return { success: false, message: "Số điện thoại không tồn tại" };
        }

        const role = "kh";
        const token = jwt.sign(
            { id: docGia._id, madocgia: docGia.madocgia, sodienthoai: docGia.sodienthoai, role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { success: true, message: "Đăng nhập thành công", token };
    }
    
    // Các phương thức khác (login, getOne, getAll) giữ nguyên như yêu cầu
    async getAll() {
    return await this.DocGia.find({}).toArray();
}
  async getOne(madocgia) {
    return await this.DocGia.find({ madocgia: madocgia }).toArray();
}
    async update(madocgia, payload) {
    try {
      console.log('Payload received:', payload);

      // Tạo object update, chỉ bao gồm các trường có giá trị
      const update = {};
      if (payload.holot !== undefined && payload.holot !== null) update.holot = payload.holot;
      if (payload.ten !== undefined && payload.ten !== null) update.ten = payload.ten;
      if (payload.ngaysinh !== undefined && payload.ngaysinh !== null) update.ngaysinh = payload.ngaysinh;
      if (payload.phai !== undefined && payload.phai !== null) update.phai = payload.phai;
      if (payload.diachi !== undefined && payload.diachi !== null) update.diachi = payload.diachi;
      if (payload.sodienthoai !== undefined && payload.sodienthoai !== null) update.sodienthoai = payload.sodienthoai;

      console.log('Update object:', update);

      // Kiểm tra nếu không có trường nào để cập nhật
      if (Object.keys(update).length === 0) {
        console.log('Không có trường nào để cập nhật, giữ nguyên dữ liệu hiện tại');
        const currentDoc = await this.DocGia.findOne({ madocgia: madocgia });
        return currentDoc || { message: `Không tìm thấy độc giả với mã: ${madocgia}` };
      }

      // Validate phai nếu được cập nhật
      if (update.phai !== undefined && (update.phai !== 0 && update.phai !== 1)) {
        throw new Error("Phái chỉ được là 0 (nữ) hoặc 1 (nam).");
      }

      // Validate ngaysinh nếu được cập nhật
      if (update.ngaysinh !== undefined) {
        const birthYear = new Date(update.ngaysinh).getFullYear();
        if (birthYear >= 2025) {
          throw new Error("Ngày sinh phải nhỏ hơn năm 2025.");
        }
      }

      // Validate sodienthoai nếu được cập nhật
      if (update.sodienthoai !== undefined) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(update.sodienthoai)) {
          throw new Error("Số điện thoại không hợp lệ (phải có đúng 10 chữ số).");
        }
        // Kiểm tra trùng số điện thoại với độc giả khác
        const existingPhone = await this.DocGia.findOne({
          sodienthoai: update.sodienthoai,
          madocgia: { $ne: madocgia }, // Loại trừ bản ghi hiện tại
        });
        if (existingPhone) {
          throw new Error("Số điện thoại đã được sử dụng bởi độc giả khác.");
        }
      }

      const result = await this.DocGia.findOneAndUpdate(
        { madocgia: madocgia },
        { $set: update },
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new Error(`Không tìm thấy độc giả với mã: ${madocgia}`);
      }

      console.log('Update result:', result.value);
      return result.value; // Trả về document đã cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật độc giả:', error);
      throw error; // Ném lỗi để controller xử lý
    }
    }
}

module.exports = DocGiaService;