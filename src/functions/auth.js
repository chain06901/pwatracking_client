import axios from "./axiosinstance";
import Cookies from 'universal-cookie';
const auth = {
  logout: () => {
    localStorage.clear();
    let cookies = new Cookies();
    cookies.remove('token');
    axios().get('/logout');
    window.location.href = "";
  },
};

export default auth;
