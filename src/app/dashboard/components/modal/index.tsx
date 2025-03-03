"use client"

import styles from './styles.module.scss'
import { X } from 'lucide-react'
import { use } from 'react'
import { OrderContext } from '@/providers/order'
import { calculateTotalOrder } from '@/lib/helper'
import Image from 'next/image'

export function Modalorder() {
  const { onRequestClose, order, finishOrder } = use(OrderContext);

  async function handleFinishOrder() {
    await finishOrder(order[0].order.id)
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  return (
    <dialog className={styles.dialogContainer}>
      <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#FF3f4b" />
        </button>

        <article className={styles.container}>
          <h2>Detalhes do pedido</h2>

          <span className={styles.table}>
            Mesa <b>{order[0].order.table}</b>
          </span>

          {order[0].order?.name && (
            <span className={styles.name}>
              <b>{order[0].order.name}</b>
            </span>
          )}

          {order.map(item => (
            <section className={styles.item} key={item.id}>
              <span>
                Qtd: {item.amount} - <b>{item.product.name}</b> - {formatCurrency(parseFloat(item.product.price) * item.amount)}
              </span>

              <span className={styles.description}>
                {item.product.description}
              </span>
            </section>
          ))}

          <h3 className={styles.total}>Valor total: {formatCurrency(calculateTotalOrder(order))}</h3>

          <button className={styles.buttonOrder} onClick={handleFinishOrder}>
            Concluir pedido
          </button>

        </article>

      </section>
    </dialog>
  )
}

/*
se querer colocar imagem na modal. colocar na linha 39
<img
src={`http://localhost:3333/files/${item.product.banner}`}
width={80}
height={80}
/>
*/
