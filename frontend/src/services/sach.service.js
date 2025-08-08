  import createApiClient from "./api.service";


  class BookService {
    constructor() {
      this.api = createApiClient("/api/sach");
    }
    async getAll(){
      return (await this.api.get(`/`)).data;
    }
    async getOne(masach){
      return (await this.api.get(`/${masach}`)).data;
    }
     async find(searchTerm) {
    const response = await this.api.get(`/`, {
      params: { tensach: searchTerm },
    });
    return response.data;
  }
    async create(data) {
    return (await this.api.post(`/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
  })).data;
}

    async delete(maNXB){
        return(await this.api.delete(`/${maNXB}`)).data;
    }
    async updateWithImage(masach, data) {
  return (await this.api.put(`/${masach}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })).data;
}

  }

  export default new BookService();
