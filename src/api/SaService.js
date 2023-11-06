import http from './http-auth'

export default new class SaService{
    getRequest(){
        return http.get('request/index');
    }
    getRequestByID(id){
        return http.get(`request/get/${id}`);
    }
    getProblemByID(id){
        return http.get(`problem/get/${id}`);
    }
}