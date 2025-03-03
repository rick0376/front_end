"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import Image from 'next/image'
import logoImg from '/public/logo.png'
import { LogOutIcon } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

export function Header() {
  const router = useRouter();

  const [isCategoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [isProductMenuVisible, setProductMenuVisible] = useState(false);

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    toast.success("Logout feito com sucesso!");
    router.replace("/");
  }

  const closeMenus = () => {
    setCategoryMenuVisible(false);
    setProductMenuVisible(false);
  };

  const closeMenusProduct = () => {
    const [isCategoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [isProductMenuVisible, setProductMenuVisible] = useState(false);

  };

  const closeMenusCategory = () => {
    setCategoryMenuVisible(false);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <Image
            alt="Logo LHPSystems Pizza"
            src={logoImg}
            width={170}
            height={170}
            priority={true}
            quality={100}
            className={styles.logo}
          />
        </Link>

        <nav>
          <div className={styles.dropdown}>
            <button onClick={() => setCategoryMenuVisible(!isCategoryMenuVisible)}>
              Categorias
            </button>
            {isCategoryMenuVisible && (
              <div className={styles.dropdownMenu}>
                <Link href="/dashboard/category" onClick={closeMenus}>
                  Cadastrar
                </Link>
                <Link href="" >
                  ----------
                </Link>
                <Link href="/dashboard/category/editcategory" onClick={closeMenus}>
                  Gerenciar
                </Link>
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button onClick={() => setProductMenuVisible(!isProductMenuVisible)}>
              Produtos
            </button>
            {isProductMenuVisible && (
              <div className={styles.dropdownMenu}>
                <Link href="/dashboard/product" onClick={closeMenus}>
                  Cadastrar
                </Link>
                <Link href="" >
                  ----------
                </Link>
                <Link href="/dashboard/product/excluiproduct" onClick={closeMenus}>
                  Gerenciar
                </Link>
              </div>
            )}
          </div>

          <form action={handleLogout}>
            <button type="submit">
              <LogOutIcon size={24} color="#FFF" />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
