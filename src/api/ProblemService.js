import http from './http-auth'

export default new class ProblemService{
    // USER
    getProblem(){
        return http.get('problem/index-mine');
    }
    addProblem(data){
        return http.post(`problem/add`, data);
    }
    updateProblem(id,data){
        return http.post(`problem/update/${id}`, data);
    }
    cancelProblem(id,data){
        return http.post(`problem/cancel/${id}`, data);
    }

    // DEPT
    getProblemDept(){
        return http.get('problem/index-dept');
    }
    executeProblem(id){
        return http.get(`problem/execute/${id}`);
    }
    doneProblem(id,data){
        return http.post(`problem/done/${id}`, data);
    }
    declineProblem(id,data){
        return http.post(`problem/decline-dept/${id}`, data);
    }
}