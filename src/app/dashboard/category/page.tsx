import styles from './styles.module.scss'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { getCookieServer } from '@/lib/cookieServer'

export default async function Category() {
  const token = await getCookieServer();

  async function handleRegisterCategory(formData: FormData) {
    "use server"

    const name = formData.get("name")

    if (name === "") return;

    const data = {
      name: name,
    }


    await api.post("/category", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .catch((err) => {
        console.log(err);
        return;
      })

    redirect("/dashboard")

  }

  return (
    <main className={styles.container}>
      <h1>Nova Categoria</h1>

      <form
        className={styles.form}
        action={handleRegisterCategory}
      >
        <input
          type="text"
          name="name"
          placeholder="Nome da categoria, ex: Pizzas"
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Cadastrar</button>
      </form>
    </main>
  )
}