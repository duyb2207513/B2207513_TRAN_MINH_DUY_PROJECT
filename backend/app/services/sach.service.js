const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class BooksService {
    constructor(client) {
        this.Book = client.db().collection("books");
    }

    async extractBookData(payload) {
        let masach;
        let isDuplicate = true;
        while (isDuplicate) {
            masach = "ms-" + uuidv4().split("-")[0];
            const exists = await this.Book.findOne({ masach });
            if (!exists) isDuplicate = false;
        }
        const book = {
            masach,
            tensach: payload.tensach || "Chưa đặt tên",
            dongia: Number(payload.dongia) || 0,
            soquyen: Number(payload.soquyen) || 0,
            namxuatban: Number(payload.namxuatban) || new Date().getFullYear(),
            maNXB: payload.maNXB || null,
            tacgia: payload.tacgia || "Không rõ",
            hinhanh: payload.hinhanh || null,
        };
        Object.keys(book).forEach((key) => book[key] === undefined && delete book[key]);
        return book;
    }

    BookData(payload) {
        const book = {
            tensach: payload.tensach || "Chưa đặt tên",
            dongia: Number(payload.dongia) || 0,
            soquyen: Number(payload.soquyen) || 0,
            namxuatban: Number(payload.namxuatban) || new Date().getFullYear(),
            maNXB: payload.maNXB || null,
            tacgia: payload.tacgia || "Không rõ",
            hinhanh: payload.hinhanh || null,
        };
        Object.keys(book).forEach((key) => book[key] === undefined && delete book[key]);
        return book;
    }

    async create(payload, file) {
        try {
            const book = await this.extractBookData(payload);

            // Xử lý file upload cho ảnh sách
            if (file) {
                const uploadPath = path.join(__dirname, '../uploads'); // Đường dẫn tương đối đến thư mục uploads
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                    console.log('Created uploads directory:', uploadPath);
                }
                book.hinhanh = file.filename; // Gán tên file từ multer
                console.log('Saved image path:', path.join(uploadPath, book.hinhanh)); // Debug
            }

            // Validation
            if (!book.tensach || typeof book.tensach !== "string") {
                throw new Error("Tên sách là bắt buộc và phải là chuỗi");
            }
            if (isNaN(book.dongia) || book.dongia < 0) {
                throw new Error("Đơn giá phải là số không âm");
            }
            if (isNaN(book.soquyen) || book.soquyen < 0) {
                throw new Error("Số quyển phải là số không âm");
            }
            if (isNaN(book.namxuatban) || book.namxuatban > new Date().getFullYear()) {
                throw new Error("Năm xuất bản không hợp lệ");
            }

            const result = await this.Book.findOneAndUpdate(
                { masach: book.masach },
                { $setOnInsert: book },
                { returnDocument: "after", upsert: true }
            );

            if (!result) {
                throw new Error("Không thể tạo sách");
            }

            console.log('Created book:', result);
            return result;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }

    async update(masach, payload, file) {
        try {
            console.log("masach:", masach);
            console.log("Payload:", payload);

            const existingBook = await this.Book.findOne({ masach });
            if (!existingBook) {
                throw new Error("Sách không tồn tại");
            }

            const update = this.BookData(payload);
          
            // Xử lý file upload cho ảnh sách
            if (file) {
                const uploadPath = path.join(__dirname, '../uploads');
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                    console.log('Created uploads directory:', uploadPath);
                }
                const newFilePath = path.join(uploadPath, file.filename);
                console.log('New file received:', file);
                console.log('New file path:', newFilePath);
                update.hinhanh = file.filename;

                // Xóa ảnh cũ nếu tồn tại
                if (existingBook.hinhanh) {
                    const oldFilePath = path.join(uploadPath, existingBook.hinhanh);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log('Deleted old image:', oldFilePath);
                    }
                }
            } else {
                update.hinhanh = existingBook.hinhanh; // Giữ nguyên ảnh cũ
            }

            // Validation
            if (update.tensach && typeof update.tensach !== "string") {
                throw new Error("Tên sách phải là chuỗi");
            }
            if (update.dongia !== undefined && (isNaN(update.dongia) || update.dongia < 0)) {
                throw new Error("Đơn giá phải là số không âm");
            }
            if (update.soquyen !== undefined && (isNaN(update.soquyen) || update.soquyen < 0)) {
                throw new Error("Số quyển phải là số không âm");
            }
            if (update.namxuatban !== undefined && (isNaN(update.namxuatban) || update.namxuatban > new Date().getFullYear())) {
                throw new Error("Năm xuất bản không hợp lệ");
            }

            const result = await this.Book.findOneAndUpdate(
                { masach },
                { $set: update },
                { returnDocument: "after" }
            );

            if (!result) {
                throw new Error("Không thể cập nhật sách");
            }

            console.log('Updated book:', result);
            return result;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.Book.find({
            tensach: { $regex: new RegExp(name, "i") }
        }).toArray();
    }

    async findByMaSach(id) {
        return await this.Book.findOne({ masach: id });
    }

    async delete(masach) {
        const result = await this.Book.findOneAndDelete({ masach });
        return result.value ? { message: `Xóa sách ${masach} thành công` } : null;
    }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BooksService;