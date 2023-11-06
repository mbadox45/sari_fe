import http from './http-auth'

export default new class RequestService{
    // USER
    getRequest(){
        return http.get('request/index-mine');
    }
    addRequest(data){
        return http.post(`request/add`, data);
    }
    updateRequest(id,data){
        return http.post(`request/update/${id}`, data);
    }
    cancelRequest(id,data){
        return http.post(`request/cancel/${id}`, data);
    }

    // ATASAN
    getRequestAtasan(){
        return http.get('request/index-atasan');
    }
    approveRequestAtasan(id){
        return http.get(`request/approve-atasan/${id}`);
    }
    cancelRequestAtasan(id,data){
        return http.post(`request/decline-atasan/${id}`, data);
    }

    // DEPT
    getRequestDept(){
        return http.get('request/index-dept');
    }
    approveRequestDept(id,data){
        return http.post(`request/approve-dept/${id}`, data);
    }
    executeRequestDept(id,data){
        return http.post(`request/execute/${id}`, data);
    }
    cancelRequestDept(id,data){
        return http.post(`request/decline-dept/${id}`, data);
    }

    // PRINT
    printRequest(id){
        return http.get(`request/${id}/pdf`);
    }
}