import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getProducts = () => {
  return axios.get(API_URL + "products", { headers: authHeader() });
};

const getOrders = (userid) => {
  return axios.get(API_URL + "orderhistoryforuser?userID="+userid, { headers: authHeader() });
};

const getProductByID = (id) => {
  return axios.get(API_URL + "product?id="+id, { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};
const getUsers = () => {
  return axios.get(API_URL + "userlist", { headers: authHeader() });
};

const postOrder = (postbody) => {
  return axios.post(API_URL + "ordernow", postbody, { headers: authHeader() });
};

const postModifyRole = (postbody) => {
  return axios.post(API_URL + "modifyrole", postbody, { headers: authHeader() });
};
const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getProducts,
  postOrder,
  getOrders,
  getProductByID,
  getUsers,
  postModifyRole
};

export default UserService;
