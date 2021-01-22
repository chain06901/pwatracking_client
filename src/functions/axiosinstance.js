import store from "../store";
import axios from "axios";
import auth from "functions/auth";
import * as Helpers from "functions/others";
const Interceptor =  () => {
  const baseURL = process.env.REACT_APP_BACKEND_URL+process.env.REACT_APP_FOLDER;
  let headers = {};
  if (localStorage.token) {
    headers.Authorization = `Bearer ${localStorage.token}`;
  }

  const axiosInstance = axios.create({
    baseURL: baseURL + "/api",
    timeout: 10000,
    headers,
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      if(response.data.status === 401)
      {
        store.dispatch({ type: "HIDE_LOADING" });
        Helpers.ErrorAlert(response.data);
        return Promise.reject();
      }else
      {
        return response;
      }
    },
    (error) => {
      store.dispatch({ type: "HIDE_LOADING" });
      if (!error.response || error.response.status === 404) {
        Helpers.ErrorAlert({
          error: "กรุณาลองใหม่อีกครั้ง",
          message: error,
        });
      } else {
        if (error.response.status === 403) {
          auth.logout();
        }
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
}


export default Interceptor;
