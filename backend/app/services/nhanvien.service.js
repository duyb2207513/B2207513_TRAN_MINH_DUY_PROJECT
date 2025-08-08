
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("nhanvien");
    }

    async validateAndRegisterReader(payload) {
        const errors = [];
        console.log("Bắt đầu nè")
        console.log("Kiểm sdt hợp lệ nè")
        // Kiểm tra số điện thoại hợp lệ
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(payload.sodienthoai)) {
            errors.push("Số điện thoại không hợp lệ (phải có đúng 10 chữ số).");
        }
        console.log("Kiểm tra trùng nè")
        // Kiểm tra trùng số điện thoại
        const existingPhone = await this.NhanVien.findOne({ sodienthoai: payload.sodienthoai });
        if (existingPhone) {
            errors.push("Số điện thoại đã được sử dụng.");
        }
        console.log("in lỗi ra")
        // Nếu có lỗi → return
        if (errors.length > 0) {
            return { success: false, errors };
        }
        console.log("Tạo mã nè")
        // Sinh mã độc giả không trùng
        // let manhanvien;
        let isDuplicate = true;
        console.log("Coi chừng lỗi ")
        while (isDuplicate) {
            var manhanvien = "NV-" + uuidv4().split("-")[0];
            console.log(manhanvien)
            const exists = await this.NhanVien.findOne({ manhanvien });
            if (!exists) isDuplicate = false;
        }
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        console.log("Tới bước cuối nè")
        const nhanVien = {
            manhanvien,
            hoten: payload.hoten,
            password:hashedPassword,
            chucvu: payload.chucvu,
            diachi: payload.diachi,
            sodienthoai: payload.sodienthoai
        };

        await this.NhanVien.insertOne(nhanVien);
        return { success: true, data: nhanVien };
    }

  

    async login(sodienthoai,manhanvien, password) {
        let nhanvien;
        console.log(manhanvien)
        console.log(sodienthoai)
        if(manhanvien==undefined){
            nhanvien = await this.NhanVien.findOne({ sodienthoai:sodienthoai});
        }
        else{
            
            nhanvien = await this.NhanVien.findOne({ manhanvien:manhanvien});
        }
        console.log(nhanvien)

        if (!nhanvien) {
            throw new Error("hoten không tồn tại");
        }

        const isMatch = await bcrypt.compare(password, nhanvien.password);
        if (!isMatch) {
            throw new Error("Sai mật khẩu");
        }
        const role="nv"
        // Tạo JWT token
        console.log("Tới đây nè")
        const token = jwt.sign(
            { id: nhanvien._id,manhanvien: nhanvien.manhanvien, sodienthoai: nhanvien.sodienthoai, role:role },
            process.env.JWT_SECRET, // nên lưu trong biến môi trường
            { expiresIn: "1d" }
        );
        console.log(token)
        return { success: true, message: 'Đăng nhập thành công', token };
    }
    async getAll() {
        return await this.NhanVien.find({}).toArray(); // tránh trả client
    }
    async getOne(manhanvien) {
        return await this.NhanVien.findOne({manhanvien:manhanvien}); // tránh trả client
    }
    async updateNV(manhanvien, payload) {
 
    console.log('Payload received:', payload);

    // Tạo object update, chỉ bao gồm các trường có giá trị
    const update = {};
    if (payload.hoten !== undefined && payload.hoten !== null) update.hoten = payload.hoten;
    if (payload.password !== undefined && payload.password !== null) update.password = payload.password;
    if (payload.chucvu !== undefined && payload.chucvu !== null) update.chucvu = payload.chucvu;
    if (payload.diachi !== undefined && payload.diachi !== null) update.diachi = payload.diachi;
    if (payload.sodienthoai !== undefined && payload.sodienthoai !== null) update.sodienthoai = payload.sodienthoai;

    console.log('Update object:', update);

    // Kiểm tra nếu không có trường nào để cập nhật
    if (Object.keys(update).length === 0) {
      console.log('Không có trường nào để cập nhật, giữ nguyên dữ liệu hiện tại');
      const currentDoc = await this.NhanVien.findOne({ manhanvien: manhanvien });
      return currentDoc || { message: `Không tìm thấy nhân viên với mã: ${manhanvien}` };
    }

    const result = await this.NhanVien.findOneAndUpdate(
      { manhanvien: manhanvien },
      { $set: update },
      { returnDocument: "after" }
    );

    

    return result
  
}
 

}

module.exports = NhanVienService;