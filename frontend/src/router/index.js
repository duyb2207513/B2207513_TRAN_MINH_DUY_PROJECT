import { createWebHistory,createRouter } from "vue-router";

import UserLogin from "@/views/DocGia/LoginPage.vue"

import UserHome from "@/views/DocGia/Home.vue";
import AdminLogin from "@/views/NhanVien/LoginPage.vue"
import AdminRegister from "@/views/NhanVien/RegisterPage.vue"
// import AdminHome from "@/views/NhanVien/Home.vue"
// import NXBList from "@/components/NhanVien/NXBList.vue";
import BooksManagement from "@/views/NhanVien/BooksManagement.vue";
import AddNXB from "@/components/NhanVien/AddNXB.vue";

import EditNXB from "@/components/NhanVien/EditNXB.vue";
import NXBList from "@/components/NhanVien/NXBList.vue";
import BookList from "@/components/NhanVien/BookList.vue";
import BookAdd from "@/components/NhanVien/BookAdd.vue";
import BookEdit from "@/components/NhanVien/BookEdit.vue";
import BookSearch from "@/components/NhanVien/BookSearch.vue";
import ApproveAccount from "@/components/NhanVien/ApproveAccount.vue";
import ApproveBook from "@/components/NhanVien/ApproveBook.vue";
import UserRegister from "@/views/Docgia/DocGiaRegisterPage.vue";
import Account from "@/views/NhanVien/Account.vue";
import AccountEdit from "@/views/NhanVien/AccountEdit.vue";
import ProductPage from "@/views/DocGia/ProductPage.vue";
import Introduce from "@/views/DocGia/Introduce.vue";
import AccountPage from "@/views/DocGia/AccountPage.vue";
import OTPLoginPage from "@/views/DocGia/OTPLoginPage.vue";
import Login from "@/views/DocGia/Login.vue";
import BorrowBook from "@/views/DocGia/BorrowBook.vue";
import ManagementBook from "@/views/DocGia/ManagementBook.vue";
import AccountManagement from "@/views/NhanVien/AccountManagement.vue";
import nhanvienService from "@/services/nhanvien.service";
const routes=[
    {
        path:"/user",
        name:"user-home",
        component: UserHome,
    },
 
    

    // USER...
   {
        path:"/page-login",
        name:"page-login",
        component: UserLogin,
    },
    {
        path:"/user-login",
        name:"user-login",
        component: OTPLoginPage,
    },
    {
        path:"/verify-login",
        name:"verify-login",
        component: Login,
    },
    {
        path:"/user-register",
        name:"user-register",
        component:UserRegister
        ,
    },
    {
        path:"/user-book",
        name:"user-book",
        component:ProductPage,
    },
    {
        path:"/user-manager-book",
        name:"user-borrow-book",
        component:ManagementBook,
        meta: { requiresAuth: true },
    },
     {
        path:"/user-account",
        name:"user-account",
        component:AccountPage,
        meta: { requiresAuth: true },
    },
    {
        path:"/",
        name:"introduce",
        component:Introduce,
    },
    {
    path: '/muon-sach/:masach',
    name: 'borrowBook',
    component: BorrowBook,
    props: true,
    meta: { requiresAuth: true },
  },        

    // ADMIN....
     {
        path:"/admin-login",
        name:"admin-login",
        component: AdminLogin,
        
    },
    {
        path:"/admin-register",
        name:"admin-register",
        component:AdminRegister,
    },
    {
        path:"/admin-add-NXB",
        name:"admin-add-NXB",
        component:AddNXB,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path: "/admin-NXB/edit/:maNXB",
        name: "admin-edit-NXB",
        component: EditNXB, // hoặc tên file bạn dùng
        props: true ,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin",
        name:"admin",
        component: BooksManagement,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin-NXB",
        name:"admin-NXB",   
        component: NXBList,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin-book",
        name:"admin-book",
        component:BookList,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin-book-add",
        name:"admin-book-add",
        component:BookAdd,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin-book-edit/:masach",
        name:"admin-book-edit",
        component:BookEdit,
        props: true ,
        meta: { requiresAuth: true,role:'nv' },
    },

    {
        path:"/admin-approve-account",
        name:"admin-approve-account",
        component:ApproveAccount,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
         path:"/admin-approve-book",
        name:"admin-approve-book",
        component:ApproveBook,
        meta: { requiresAuth: true,role:'nv' },
    },
    

    {
        path:"/admin-book-search",
        name:"admin-book-search",
        component:BookSearch,
        meta: { requiresAuth: true,role:'nv' },
    },
    {
        path:"/admin-account",
        name:"admin-account",
        component:Account,
        meta: { requiresAuth: true}
    },
    {
        path:"/admin-account-edit",
        name:"admin-account-edit",
        component:AccountEdit,
        meta: { requiresAuth: true },
    },
    
    {
        path:"/:pathMatch(.*)*",
        name:"notfound",
        component: () => import("@/views/NotFound.vue"),
    },
   
];




const router= createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const role = nhanvienService.getUser()
  console.log(role)
  if (requiresAuth) {
    if (role==null) {
        alert("Bạn không có quyền truy cập!");
        return next("/user-login"); // chưa đăng nhập
    }

    if (to.meta.role && to.meta.role !== role.role) {
      alert("Bạn không có quyền truy cập!");
      return next("/"); // không đúng quyền → đá về trang chủ
    }
  }

  next();
});


export default router;