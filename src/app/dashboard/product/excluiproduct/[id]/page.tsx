"use client";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/app/dashboard/components/button";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import React from "react";

interface Product {
  id: string;
  name: string;
  price: string | number;
  description: string;
  banner: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = getCookieClient();
        const response = await api.get(`/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data);
      } catch (err) {
        console.error("Erro ao carregar produto", err);
        toast.error("Erro ao carregar produto");
      }
    };

    const fetchCategories = async () => {
      try {
        const token = getCookieClient();
        const response = await api.get("/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
        toast.error("Erro ao carregar categorias");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleUpdate = async () => {
    if (!product) return;

    const updatedPrice = parseFloat(product.price.toString().replace(',', '.'));

    setLoading(true);
    const token = getCookieClient();

    try {
      await api.put(
        `/product/${product.id}`,
        {
          name: product.name,
          price: updatedPrice,
          description: product.description,
          category_id: product.category_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Produto atualizado com sucesso");
      router.push("/dashboard/product/excluiproduct");
    } catch (err) {
      console.error("Erro ao atualizar produto", err);
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/product/excluiproduct");
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toFixed(2).replace('.', ',');
    }
    return price.replace('.', ',');
  };

  return (
    <dialog className={styles.dialogContainer}>
      <div className={styles.container}>
        <h1>Editar Produto</h1>
        {product ? (
          <div className={styles.form}>
            <label>Nome:</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <label>Preço:</label>
            <input
              type="text"
              value={formatPrice(product.price)}
              onChange={(e) => {
                setProduct({
                  ...product,
                  price: e.target.value.replace(',', '.'),
                });
              }}
            />

            <label>Descrição:</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />

            <label>Categoria:</label>
            <select
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className={styles.buttonContainer}>
              <button
                className={styles.saveButton}
                onClick={() => router.push("/dashboard/product/excluiproduct")}
              >
                Cancelar
              </button>

              <button
                className={styles.saveButton}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.loading}>Carregando produto...</div>
        )}
      </div>
    </dialog>
  );
}
