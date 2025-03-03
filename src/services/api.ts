/*import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API
})
*/

// Antes (usando Axios)
export const api = {
  get: async (url: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return await response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return await response.json();
  },
};