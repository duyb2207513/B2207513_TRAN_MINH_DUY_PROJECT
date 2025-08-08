const PhieuMuonController =require("../controllers/phieumuon.controller")
const express= require("express")
const router= express.Router()
router.post("/",PhieuMuonController.create);//oke
router.put("/:id",PhieuMuonController.update);//oke
router.get("/",PhieuMuonController.getAll);//oke
router.get("/:id",PhieuMuonController.getOne);//oke

module.exports = router