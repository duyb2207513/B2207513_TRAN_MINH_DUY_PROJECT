const BooksService = require('../services/sach.service');
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const upload = require('../config/upload.config');
class BooksController {
    async create(req, res, next) {
    if (req.body.book) {
      try {
        req.body = JSON.parse(req.body.book);
      } catch (err) {
        return next(new ApiError(400, "Dữ liệu sách không hợp lệ"));
      }
    }

      if (!req.body.tensach) {
      return next(new ApiError(400, "Tên sách không được để trống"));
    }

    try {
      const booksService = new BooksService(MongoDB.getClient());
      console.log(req.body)
      const document = await booksService.create(req.body, req.file);
      return res.status(201).json({
        success: true,
        data: document,
        message: "Tạo sách thành công",
      });
    } catch (error) {
      return next(new ApiError(500, error.message || "Không thể tạo sách"));
    }
  }

  async update(req, res, next) {
    try {
      const booksService = new BooksService(MongoDB.getClient());
      const masach = req.params.masach;
      const result = await booksService.update(masach, req.body, req.file);
      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy sách để cập nhật" });
      }
      return res.status(200).json({
        success: true,
        data: result,
        message: "Cập nhật sách thành công",
      });
    } catch (error) {
      return next(new ApiError(500, error.message || "Lỗi khi cập nhật thông tin của sách"));
    }
  }
    // Get
    async findAll(req, res, next) {
        let documents = [];
        try {
            const booksService = new BooksService(MongoDB.getClient());
            const { tensach} = req.query;
            console.log(req.query)
            if (tensach) {
                documents = await booksService.findByName(tensach);
            } else {
                documents = await booksService.find({});
            }

            return res.send(documents);
        } catch (error) {
            console.error("FindAll Error:", error);
            return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
        }
    }
    // findOne
    async findOne(req,res,next){
        try{
            const booksService=new BooksService(MongoDB.getClient())
            const id = req.params.masach
            console.log(id)
            const document = await booksService.findByMaSach(id);
            res.send(document);
        }
        catch(error){
            return next(new ApiError(500, "Lỗi khi lấy tên sách"))
        }
    }
    // update : về số lượng, đơn giá các thứ
   
    // delete
    async deleteOne(req,res, next){
        try{
            const masach = req.params.masach;
            const booksService = new BooksService(MongoDB.getClient());
            const result = await  booksService.delete(masach)
            res.send(result)
        }   
        catch(error){
            return next(new ApiError(500,"Lỗi xảy ra khi xóa sách"))
        }
    }

}

module.exports = new BooksController();  