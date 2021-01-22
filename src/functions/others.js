import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
dayjs.extend(buddhistEra);

export const decode_payload = () => {
  var token = localStorage.getItem("token");
  if (token) {
    return jwt_decode(token);
  } else {
    return null;
  }
};
export const ConfirmDialog = (title,text) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#dcd7d7",
      allowOutsideClick: false,
    }).then((r) => {
      if (r.isConfirmed) {
        resolve("ok");
      } else if (r.isDismissed) {
        reject("cancel");
      }
    });
  });
};
export const ErrorAlert = (data) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      icon: "error",
      title: data.error,
      html: data.message,
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
    }).then((r) => {
      if (r.isConfirmed) {
        resolve("ok");
      }
    });
  });
};
export const SuccessAlert = (data) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      icon: "success",
      title: data.title,
      text: data.message,
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
    }).then((r) => {
      if (r.isConfirmed) {
        resolve("ok");
      }
    });
  });
};
export const Datetime = (e) => {
  return dayjs(e).format("DD/MM/BBBB HH:mm:ss");
};
export const Date = (e) => {
  return dayjs(e).format("DD/MM/BBBB");
};
export const Year = (e) => {
  return dayjs(e).format("YYYY");
};
export const Limitnumber = (text,length) => {
  return Math.max(0, parseInt(text) ).toString().slice(0,length);
};
