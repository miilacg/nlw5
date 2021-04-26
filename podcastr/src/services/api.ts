import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/' //vai ser igual em todas as chamadas
})