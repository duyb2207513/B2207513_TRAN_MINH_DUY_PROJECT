const NhaXuatBanService = require("../services/nxb.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

const NhaXuatBanController = {
    // Lấy tất cả NXB
    async getAll(req, res, next) {
        try {
            const service = new NhaXuatBanService(MongoDB.getClient());
            const documents = await service.find({});
            return res.send(documents);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách NXB:", error);
            return next(new ApiError(500, "Không thể lấy danh sách nhà xuất bản"));
        }
    },

    // Lấy NXB theo mã
    async getNXB(req, res, next) {
        try {
            const service = new NhaXuatBanService(MongoDB.getClient());
            const document = await service.findOne(req.params.maNXB);
            if (!document) {
                return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
            }
            return res.send(document);
        } catch (error) {
            console.error("Lỗi khi lấy NXB:", error);
            return next(new ApiError(500, "Lỗi khi lấy thông tin nhà xuất bản"));
        }
    },

    // Tạo mới NXB
    async createNXB(req, res, next) {
        try {
            const service = new NhaXuatBanService(MongoDB.getClient());
            const result = await service.create(req.body);
            return res.status(201).send(result);
        } catch (error) {
            console.error("Lỗi khi tạo NXB:", error);
            return next(new ApiError(500, "Không thể tạo nhà xuất bản"));
        }
    },

    // Cập nhật NXB
    async updateNXB(req, res, next) {
        try {
            const service = new NhaXuatBanService(MongoDB.getClient());
            const updated = await service.update(req.params.maNXB, req.body);
            if (!updated) {
                return next(new ApiError(404, "Không tìm thấy nhà xuất bản để cập nhật"));
            }
            return res.send(updated);
        } catch (error) {
            console.error("Lỗi khi cập nhật NXB:", error);
            return next(new ApiError(500, "Không thể cập nhật nhà xuất bản"));
        }
    },

    // Xóa NXB
    async deleteNXB(req, res, next) {
        try {
            const service = new NhaXuatBanService(MongoDB.getClient());
            const deleted = await service.delete(req.params.maNXB);
            if (!deleted) {
                return next(new ApiError(404, "Không tìm thấy nhà xuất bản để xóa"));
            }
            return res.send({ success: true, message: "Đã xóa nhà xuất bản" });
        } catch (error) {
            console.error("Lỗi khi xóa NXB:", error);
            return next(new ApiError(500, "Không thể xóa nhà xuất bản"));
        }
    }
};

module.exports = NhaXuatBanController;
