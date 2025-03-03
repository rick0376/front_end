"use client"

import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Button } from "@/app/dashboard/components/button"
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface ButtonProps {
  name: string;
  onClick: () => void; // Aceitando a função onClick
}

export function ActionButton({ name, onClick }: ButtonProps) {
  return <button onClick={onClick}>{name}</button>;
}
export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getCookieClient();
        const response = await api.get('/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        console.log(err);
        toast.error('Erro ao carregar categorias');
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/category/editcategory/${id}`);
  };

  const handleDelete = async (id: string) => {
    const token = getCookieClient();
    try {
      await api.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Categoria excluída com sucesso!');
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      console.log(err);
      toast.error('Exclua primeiros os produtos cadastrados na categoria.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Excluir Categorias</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td className={styles.actions}>
                <button className="edit" onClick={() => handleEdit(category.id)}>Editar</button>
                <button className="delete" onClick={() => handleDelete(category.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}