export const runtime = 'nodejs';

import axios from 'axios';

// Criando a instância do axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
