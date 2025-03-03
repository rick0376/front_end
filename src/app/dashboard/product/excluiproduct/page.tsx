"use client";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/app/dashboard/components/button";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";

interface Product {
  id: string;
  name: string;
  price: string | number;
  description: string;
  banner: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<string | null>(null);
  const [imageUrlToDelete, setImageUrlToDelete] = useState<string | null>(null);
  const router = useRouter();

  const confirmDeleteHandler = async () => {
    if (confirmDeleteProduct && imageUrlToDelete) {
      await handleDelete(confirmDeleteProduct, imageUrlToDelete);
      setConfirmDeleteProduct(null);
      setImageUrlToDelete(null);
    }
  };

  const cancelDeleteHandler = () => {
    setConfirmDeleteProduct(null);
    setImageUrlToDelete(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getCookieClient();
        const response = await api.get("/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data);

        if (response.data.length > 0) {
          const firstCategoryId = response.data[0].id;
          setSelectedCategory(firstCategoryId);
          fetchProductsByCategory(firstCategoryId);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
        toast.error("Erro ao carregar categorias");
      }
    };

    fetchCategories();
  }, []);

  // Buscar Produtos por Categoria
  const fetchProductsByCategory = async (category_id: string) => {
    setLoading(true);
    try {
      const token = getCookieClient();
      const response = await api.get(`/products/category/${category_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category_id: string) => {
    setSelectedCategory(category_id);
    if (category_id) {
      fetchProductsByCategory(category_id);
    } else {
      setProducts([]);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/dashboard/product/excluiproduct/${productId}`);
  };

  const deleteImageFromCloudinary = async (
    productId: string,
    imageUrl: string,
    token: string
  ) => {
    try {
      const cloudinaryResponse = await api.delete('/cloudinary/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          productId,
          imageUrl,
        },
      });

      if (cloudinaryResponse.status !== 200) {
        throw new Error('Erro ao excluir imagem no Cloudinary');
      }

      return true;

    } catch (error) {
      console.error('Erro ao excluir imagem no Cloudinary:', error);
      toast.error('Erro ao excluir imagem no Cloudinary');
      return false;
    }
  };

  const handleDelete = async (productId: string, imageUrl: string) => {
    console.log("Chamando handleDelete para o produto:", productId);

    if (loading) {
      console.log("⚠️ Já está carregando, impedindo nova requisição.");
      return;
    }

    setLoading(true);
    const token = getCookieClient();

    if (!token) {
      toast.error("Token de autenticação não encontrado");
      setLoading(false);
      return;
    }

    try {
      console.log("Chamando deleteImageFromCloudinary...");
      const imageDeleted = await deleteImageFromCloudinary(productId, imageUrl, token);

      if (imageDeleted) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      }
    } catch (err) {
      console.error("❌ Erro no processo de exclusão:", err);
      toast.error("Erro no processo de exclusão:");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (productId: string, imageUrl: string) => {
    setConfirmDeleteProduct(productId);
    setImageUrlToDelete(imageUrl);
  };

  return (

    <div className={styles.container}>
      <h1>Gerenciar Produtos</h1>

      <div className={styles.categoryFilter}>
        <label htmlFor="category">Filtrar por Categoria:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className={styles.loadingText}>Carregando produtos...</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{String(product.price).replace('.', ',')}</td>
              <td>
                {product.banner && (
                  <img
                    src={product.banner}
                    alt={product.name}
                    className={styles.productImage}
                    width={50}
                    height={50}
                  />
                )}
              </td>
              <td className={styles.actions}>
                <button className="edit" onClick={() => handleEdit(product.id)}>
                  Editar
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteRequest(product.id, product.banner)}
                  disabled={loading}
                >
                  {loading ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmDeleteProduct && (
        <div className={styles.confirmDeleteModal}>
          <div className={styles.modalContent}>
            <p>Deseja realmente excluir este produto?</p>
            <button onClick={confirmDeleteHandler}>Sim</button>
            <button onClick={cancelDeleteHandler}>Não</button>
          </div>
        </div>
      )}
    </div>
  );

}
