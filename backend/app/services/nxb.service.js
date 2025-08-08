const { ObjectId } = require("mongodb");
const { after } = require("node:test");
const { v4: uuidv4 } = require('uuid');
class NhaXuatBanService {
    constructor(client) {
        this.NXB = client.db().collection("NXB"); // Đặt tên nhất quán là "NXB"
    }

    async extractNXBData(payload) {
        let maNXB;
        let isDuplicate = true;
        while (isDuplicate) {
            maNXB = "NXB-" + uuidv4().split("-")[0];
            const exists = await this.NXB.findOne({ maNXB });
            if (!exists) isDuplicate = false;
        }
        const nhaXuatBan = {
            maNXB: maNXB,
            tenNXB: payload.tenNXB,
            diachi: payload.diachi,
        };

        Object.keys(nhaXuatBan).forEach(
            (key) => nhaXuatBan[key] === undefined && delete nhaXuatBan[key]
        );

        return nhaXuatBan;
    }

    async create(payload) {
        console.log(payload)
        const nxb = await this.extractNXBData(payload); 
        console.log(nxb)
        
        await this.NXB.insertOne(nxb);
        return { success: true, data: nxb};
    }

    async findByName(tenNXB) {
        return await this.NXB.find({ tenNXB: tenNXB }).toArray();
    }

    async findByMaNXB(maNXB) {
        return await this.NXB.find({ maNXB: maNXB }).toArray();
    }

    async find(filter) {
        const cursor = await this.NXB.find(filter);
        return await cursor.toArray();
    }
    async findOne(maNXB) {
        return await this.NXB.findOne({ maNXB: maNXB });
    }

    // Nếu cần thêm hàm delete
    async delete(maNXB) {
        console.log(maNXB)
        return await this.NXB.findOneAndDelete({ maNXB: maNXB });
    }

    async update(maNXB, payload) {
    const { tenNXB, diachi } = payload;
    const updateData = {};

    if (tenNXB !== undefined) updateData.tenNXB = tenNXB;
    if (diachi !== undefined) updateData.diachi = diachi;

    return await this.NXB.findOneAndUpdate(
        { maNXB: maNXB },
        { $set: updateData },
        { returnDocument: "after" }
    );
}

 
}

module.exports = NhaXuatBanService