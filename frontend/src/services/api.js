import axios from "axios";

const API = axios.create({
  baseURL: "https://careertrack-vvpy.onrender.com/api",
});

export default API;