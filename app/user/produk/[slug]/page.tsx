"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbars from "@/components/navbarMain";
import { Button } from "@/components/ui/button";
import {  toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";



type ProductDetail = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  created_at: string;
  slug: string;
};



export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${slug}`
        );
        setProduct(response.data.content);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToWishlist = async () => {
    setWishlistLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        toast.error("Silahkan login terlebih dahulu!", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/user/wishlists/${slug}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Berhasil menambahkan ke wishlist", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });
      } else {
        toast.error("Gagal menambahkan ke wishlist", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch  {
      toast.error("Gagal menambahkan ke wishlist", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Memuat detail produk...</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Produk tidak ditemukan</div>;
  }

  return (
    <div className="">
      <ToastContainer />
      {/* Navbar */}
      <Navbars />

      <div className="flex flex-row  justify-center mt-10 mb-10 gap-20">
        {/* Bagian Gambar */}
        <div className="">
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-80 rounded-lg"
          />
        </div>

        {/* Bagian Informasi Produk */}
        <div className="">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="mb-5 mt-1 text-sm">
            Total Stock:{" "}
            <span className="text-gray-500">
              {product.stock.toLocaleString()}
            </span>
          </p>
          <p className="text-3xl text-black font-bold mb-4">
            Rp{product.price.toLocaleString("id-ID")}
          </p>

          <div className="mb-6">
            <span className="w-80 h-0.5 bg-gray-200 inline-block"></span>
            <h3 className="text-lg font-semibold text-[#2D9CDB]">Detail</h3>
            <span className="w-80 h-0.5 bg-gray-200 inline-block"></span>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        <div className="w-72 h-72 border-1 border-gray-400 rounded-lg mr-20 mt-10">
          <p className="mt-3 font-bold text-lg ml-3">
            Atur Pembelian & Whistlist
          </p>
          <div className="flex flex-row mt-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-lg ml-4"
            />
            <p className="ml-3 text-sm font-medium mt-2">{product.name}</p>
          </div>
          <div className="justify-center items-center flex mt-4">
            <span className="w-64   h-0.5 bg-gray-200 inline-block"></span>
          </div>
          <p className="ml-4 mt-2">
            Stok:{" "}
            <span className="font-semibold">
              {product.stock.toLocaleString()}
            </span>
          </p>
          <div className="flex justify-between mt-2">
            <p className="text-gray-300 font-normal text-base ml-4">Total </p>
            <p className="text-black font-bold text-lg mr-2">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>
          <Button onClick={handleAddToWishlist} 
            className="mt-2 w-64 justify-center ml-3 text-white bg-[#2D9CDB] border border-[#2D9CDB] hover:bg-white hover:text-[#2D9CDB]"
          >
            +Wishlist
          </Button>
          <Button className="mt-2 w-64 justify-center ml-3 bg-white text-[#2D9CDB] border border-[#2D9CDB] hover:bg-gray-200">
            Beli Langsung
          </Button>
        </div>
      </div>
    </div>
  );
}


