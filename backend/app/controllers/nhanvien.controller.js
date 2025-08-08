const MongoDB = require("../utils/mongodb.util")
const ApiError = require("../api-error")
const NhanVienService= require("../services/nhanvien.service")
class NhanVienController{
    async register(req,res,next){
        try{
            const docGiaService= new NhanVienService(MongoDB.getClient());
            const result= await docGiaService.validateAndRegisterReader(req.body);
            res.send(result)
        }
        catch(error){
            return next(new ApiError(500,"Lỗi khi đăng ký"))
        }
    }
    async login(req,res,next){
        try{
            const docGiaService= new NhanVienService(MongoDB.getClient());
            const {sodienthoai,manhanvien,password}=req.body
            console.log(req.body)
            const result= await docGiaService.login(sodienthoai,manhanvien,password);
            res.send(result)
        }
        catch(error){
            return next(new ApiError(500,"Lỗi khi đăng nhập"))
        }
    }
    async getAll(req, res, next) {
    try {
        const docGiaService= new NhanVienService(MongoDB.getClient());
        const result = await docGiaService.getAll();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
    }
    }
    async getOne(req, res, next) {
    try {
        const docGiaService= new NhanVienService(MongoDB.getClient());
        const result = await docGiaService.getOne(req.params.manhanvien);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
    }
    }
    async update(req,res,next){
        try{
            const nhaXuatBanService= new NhanVienService(MongoDB.getClient());
            // console.log(req.body,req.params.manhanvien)
            const result= await nhaXuatBanService.updateNV(req.params.manhanvien,req.body)
            console.log(result)
            res.send(result);
        }
        catch(error){
            return next( new ApiError(500,"Lỗi khi cập nhật nhân viên "))
        }
    }
}


module.exports= new NhanVienController() 
