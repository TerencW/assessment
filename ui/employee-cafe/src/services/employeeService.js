import { apiUrl } from "../config";
import http from "./httpService";


const apiEndpoint = apiUrl;

export async function getEmployeeList(locationQuery = '') {

    const response = await http.get(`${apiEndpoint}/employees?cafe=${locationQuery}`);
    return response;

};

export async function deleteEmployee(id) {  

    return await http.delete(`${apiEndpoint}/employee/${id}`, null);

}

export async function saveEmployee(saveedit , employee) {
  //EDIT
  if (saveedit) {
    return await http.put(`${apiEndpoint}/employee/${saveedit.employee_id}`, employee);
  }
  //ADD
  return await http.post(`${apiEndpoint}/employee`, employee);
   
}