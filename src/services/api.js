import  axios  from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api", 
    Headers: {
        "Content-Type " : "Application/json",
        Accept:"Application/json",
    },
});

export default api;