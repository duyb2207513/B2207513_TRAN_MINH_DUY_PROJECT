// async getOne(id){
//       return (await this.api.get(`/${id}`)).data;
//           }
//     async getAll(){
//       return (await this.api.get(`/`)).data;
//     }
  import createApiClient from "./api.service";


  class PhieuMuonService {
    constructor() {
      this.api = createApiClient("/api/phieumuon");
    }
    async getAll(){
      return (await this.api.get(`/`)).data;
    }
    async getOne(id){
      return (await this.api.get(`/${id}`)).data;
    }
    async create(data){
        return (await this.api.post(`/`,data)).data;
    }
    // async delete(maNXB){
    //     return(await this.api.delete(`/${maNXB}`)).data;
    // }
    async update(maNXB,data){
        return (await this.api.put(`${maNXB}`,data)).data;
    }

  }

  export default new PhieuMuonService();
