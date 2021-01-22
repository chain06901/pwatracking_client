import React from "react";
import loadable from "@loadable/component";
import ProgressBar from "react-topbar-progress-indicator";
ProgressBar.config({
  barColors: {
    0: "#5e72e4",
  },
  shadowBlur: 1,
});
const detailqrcode = loadable(() => import("components/Public/Detailqrcode"), {
  fallback: <ProgressBar />,
});

const Dashboard = loadable(() => import("components/AdminCompany/Dashboard"), {
  fallback: <ProgressBar />,
});
const DashboardEmployee = loadable(
  () => import("components/Employee/Dashboard"),
  {
    fallback: <ProgressBar />,
  }
);
const FormLot = loadable(() => import("components/AdminCompany/FormLot"), {
  fallback: <ProgressBar />,
});
const CompanyAll = loadable(
  () => import("components/Admin/CompanyAll"),
  {
    fallback: <ProgressBar />,
  }
);
const CompanyForm = loadable(() => import("components/Admin/CompanyForm"), {
  fallback: <ProgressBar />,
});

const UserAll = loadable(() => import("components/Admin/UserAll"), {
  fallback: <ProgressBar />,
});
const UserForm = loadable(() => import("components/Admin/UserForm"), {
  fallback: <ProgressBar />,
});

var routes = [
  {
    path: "/dashboard",
    name: "หน้าหลัก",
    icon: "fas fa-home",
    component: Dashboard,
    leftmenu: true,
    exact: false,
    admin: true,
    company: true,
  },
  {
    path: "/dashboard",
    name: "หน้าหลัก",
    icon: "fas fa-home",
    component: DashboardEmployee,
    leftmenu: true,
    exact: false,
    employee: true,
  },
  {
    path: "/companys",
    name: "จัดการบริษัท",
    icon: "fas fa-building",
    component: CompanyAll,
    leftmenu: true,
    exact: true,
    admin: true,
  },
  {
    path: "/companys/add",
    name: "เพิ่มบริษัท",
    icon: "fas fa-building",
    component: CompanyForm,
    exact: true,
    admin: true,
  },
  ,
  {
    path: "/companys/edit",
    name: "แก้ไขบริษัท",
    icon: "fas fa-building",
    component: CompanyForm,
    exact: true,
    admin: true,
  },
  {
    path: "/users",
    name: "จัดการสิทธิใช้งาน",
    icon: "fas fa-users",
    component: UserAll,
    leftmenu: true,
    exact: true,
    admin: true,
  },
  {
    path: "/users/add",
    name: "เพิ่มพนักงาน",
    icon: "fas fa-building",
    component: UserForm,
    exact: true,
    admin: true,
  },
  {
    path: "/lot",
    name: "รายละเอียด",
    icon: "far fa-file-alt",
    component: FormLot,
    exact: true,
    admin: true,
    company: true,
    employee: true,
  },
  {
    path: "/add",
    name: "เพิ่มข้อมูล",
    icon: "fas fa-plus",
    component: FormLot,
    exact: true,
    admin: true,
    leftmenucompany: true,
    company: true,
  },
  {
    path: "/token",
    name: "รายละเอียด",
    icon: "fas fa-plus",
    component: detailqrcode,
    exact: true,
    public: true,
  },
];
export default routes;
