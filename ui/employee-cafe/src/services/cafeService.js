import http from "./httpService";


const apiEndpoint = "https://localhost:44355/api" ;

export async function getCafeList(locationQuery = '') {

    const response = await http.get(`${apiEndpoint}/cafes?location=${locationQuery}`);
    return response;

  };
export async function deleteCafe(id) {  

  const result = await http.delete(`${apiEndpoint}/cafe/${id}`, null);
  return result;
}

export async function saveCafe(saveedit , cafe) {
  //EDIT
  if (saveedit) {
    return await http.put(`${apiEndpoint}/cafe/${saveedit.cafe_id}`, cafe);
  }
  //ADD
  return await http.post(`${apiEndpoint}/cafe`, cafe);
   
}