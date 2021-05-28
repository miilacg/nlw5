import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.10.7:3333' //endereço IP da maquina
});

export default api;