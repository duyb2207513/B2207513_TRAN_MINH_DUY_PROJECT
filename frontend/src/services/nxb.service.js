  import createApiClient from "./api.service";


  class NXBService {
    constructor() {
      this.api = createApiClient("/api/NXB");
    }
    async getAll(){
      return (await this.api.get(`/`)).data;
    }
    async getNXB(maNXB){
      return (await this.api.get(`/${maNXB}`)).data;
    }
    async createNXB(data){
        return (await this.api.post(`/`,data)).data;
    }
    async deleteNXB(maNXB){
        return(await this.api.delete(`/${maNXB}`)).data;
    }
    async updateNXB(maNXB,data){
        return (await this.api.put(`${maNXB}`,data)).data;
    }

  }

  export default new NXBService();
