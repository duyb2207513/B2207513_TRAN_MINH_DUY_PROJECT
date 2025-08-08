const { ObjectId } = require("mongodb");
class PhieuMuonService{
    constructor(client){
        this.PhieuMuon = client.db().collection("PhieuMuon");
    }
    extractPhieuMuonData(payload) {
        const ngaymuon = new Date(payload.ngaymuon);
        const ngaytra = new Date(payload.ngaytra);
        const today = new Date();
        today.setHours(0,0,0,0); // Xóa giờ phút giây để so sánh ngày

        if (ngaymuon < today) {
            throw new Error("Ngày mượn không được nhỏ hơn ngày hiện tại.");
        }

        if (ngaytra <= ngaymuon) {
            throw new Error("Ngày trả phải sau ngày mượn.");
        }

        const PhieuMuon = {
            madocgia: payload.madocgia,
            masach: payload.masach,
            ngaymuon,
            ngaytra,
            manhanvien: payload.manhanvien,
        };

        Object.keys(PhieuMuon).forEach(
            (key) => PhieuMuon[key] === undefined && delete PhieuMuon[key]
        );

        return PhieuMuon;
    }

    async create(payload){
        const phieumuon=this.extractPhieuMuonData(payload);
        await  this.PhieuMuon.insertOne(phieumuon)
        return { success: true, data: phieumuon };
    }   
    async update(id, payload) {
         const updateData = {
            madocgia: payload.madocgia,
            masach: payload.masach,
            ngaymuon:payload.ngaymuon,
            ngaytra:payload.ngaytra,
            manhanvien: payload.manhanvien,
        }; 
    return await this.PhieuMuon.findOneAndUpdate(
        { _id: new ObjectId(id) }, // convert string -> ObjectId
        { $set: updateData },
        { returnDocument: "after" }
    );
}
    async getAll() {
        return await this.PhieuMuon.find({}).toArray(); // tránh trả client
    }
    async getOne(id) {
        return await this.PhieuMuon.findOne({ _id:new ObjectId(id)}); // tránh trả client
    }
     async countBorrowersInMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const pipeline = [
            {
                $match: {
                    ngaymuon: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$madocgia",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBorrowers: { $sum: 1 }
                }
            }
        ];
        const result = await this.PhieuMuon.aggregate(pipeline).toArray();
        return result.length > 0 ? result[0].totalBorrowers : 0;
    }

    async calculateRevenueInMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        // Giả sử mỗi phiếu mượn có một phí cố định (ví dụ: 10000 VND), bạn có thể thay đổi logic tính phí tùy theo dữ liệu
        const pipeline = [
            {
                $match: {
                    ngaymuon: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: 10000 } // Thay 10000 bằng logic tính phí thực tế
                }
            }
        ];
        const result = await this.PhieuMuon.aggregate(pipeline).toArray();
        return result.length > 0 ? result[0].totalRevenue : 0;
    }
}
module.exports = PhieuMuonService;
