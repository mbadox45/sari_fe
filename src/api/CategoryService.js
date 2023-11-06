import http from './http-auth'

export default new class CategoryService{
    // USER
    getCategoryUserDept(){
        return http.get('category/index-user-dept');
    }
    getCategoryDept(){
        return http.get('category/index-dept');
    }
    getCategoryByChoosenDept(id){
        return http.get(`category/index-by-dept/${id}`);
    }
    getCategoryByID(id){
        return http.get(`category/get/${id}`);
    }
    addCategory(data){
        return http.post(`category/add`, data);
    }
    updateCategory(id,data){
        return http.post(`category/update/${id}`, data);
    }
}