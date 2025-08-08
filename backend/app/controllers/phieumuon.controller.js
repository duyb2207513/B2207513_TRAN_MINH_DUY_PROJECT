 const ApiError = require("../api-error");
const PhieuMuonService = require("../services/phieumuon.service");
const MongoDB = require("../utils/mongodb.util")


class PhieuMuonController{
    async create(req,res,next){
        try {
            const phieumuonService = new PhieuMuonService(MongoDB.getClient());
            const result=await phieumuonService.create(req.body);
            res.send(result)
        } catch (error) {
            console.error(error);
            return next(new ApiError(500, "Lỗi khi tạo phiếu mượn"));
        }
    }
    async update(req,res,next){
        try{
            const phieumuonService = new PhieuMuonService(MongoDB.getClient());
            const result =await phieumuonService.update(req.params.id ,req.body)
            res.send(result)
        }catch (error) {
            console.error(error);
            return next(new ApiError(500, "Lỗi khi cập nhật phiếu mượn"));
        }
    }
    async getAll(req, res, next) {
        try {
            const docGiaService= new PhieuMuonService(MongoDB.getClient());
            const result = await docGiaService.getAll();
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
        }
    }
    async getOne(req, res, next) {
    try {
        const docGiaService= new PhieuMuonService(MongoDB.getClient());
        const result = await docGiaService.getOne(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
    }
    }
    
}
module.exports= new PhieuMuonController();