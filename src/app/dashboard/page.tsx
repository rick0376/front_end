import { Orders } from "./components/orders";
import { api } from '@/services/api'
import { getCookieServer } from '@/lib/cookieServer'
import { OrderProps } from '@/lib/order.type'

async function getOrders(token: string): Promise<OrderProps[] | []> {
  try {

    const response = await api.get("/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data || []

  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function Dashboard() {
  const token = await getCookieServer(); // Verificamos token e ai passamos para o getOrders
  const orders = await getOrders(token!);

  return (
    <>
      <Orders orders={orders} />
    </>
  )
}