"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { getCookieClient } from '@/lib/cookieClient';
import styles from './styles.module.scss';

interface Category {
  id: string;
  name: string;
}

export default function EditCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const token = getCookieClient();
          const response = await api.get(`/category/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategory(response.data);
        } catch (err) {
          console.log(err);
          toast.error('Erro ao carregar categoria');
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!category) return;

    const token = getCookieClient();
    try {
      await api.put(`/category/${category.id}`, category, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Categoria atualizada com sucesso!');
      router.push('/dashboard/category/editcategory');
    } catch (err) {
      console.log(err);
      toast.error('Erro ao atualizar categoria');
    } finally {
      setLoading(false);
    }
  };

  if (!category) return <div className={styles.loading}>Carregando...</div>;

  return (
    <dialog className={styles.dialogContainer}>
      <div className={styles.container}>
        <h1>Editar Categoria</h1>
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Categoria:</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              className={styles.input}
            />
          </div>
        </form>

        <div className={styles.buttonContainer}>
          <button
            className={styles.saveButton}
            onClick={() => router.push('/dashboard/category/editcategory')}
          >
            Cancelar
          </button>

          <button
            className={styles.saveButton}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
