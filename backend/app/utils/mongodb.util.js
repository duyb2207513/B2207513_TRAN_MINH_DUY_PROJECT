const { MongoClient } = require('mongodb');

class MongoDB {
    static async connect(uri) {
        if (this.client) return this.client;
        this.client = await MongoClient.connect(uri);
        return this.client;
    }

    static getClient() {
        if (!this.client) {
            throw new Error("MongoDB client chưa được khởi tạo. Gọi MongoDB.connect(uri) trước.");
        }
        return this.client;
    }

    static async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
    }
}

module.exports = MongoDB;
