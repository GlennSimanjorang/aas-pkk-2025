"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbars from "@/components/navbarMain";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer, Bounce } from "react-toastify";
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/products/${slug}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setProduct(response.data.content);
        console.log(response.data.content);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleBuyProduct = async () => {
    try {
      const token = getCookie("token");

      const response = await axios.post(
        `${baseUrl}/api/user/orders`,
        {
          product: product?.slug,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.status === 200) {
        window.open(response.data.content.seller_phone, "_blank");

        toast.success("Berhasil melakukan pembelian", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });
      }
      if (response.status ===  400) {
        toast.error("Produk sudah dibeli", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch {
      toast.error("Produk Sudah Pernah Dibeli", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

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
        `${baseUrl}/api/user/wishlists/${slug}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
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
    } catch {
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
      <Navbars />

      <div className="flex flex-col lg:flex-row justify-center items-center mt-10 mb-10 gap-10 px-4">
        {/* Bagian Gambar */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-lg object-cover"
          />
        </div>

        {/* Informasi Produk */}
        <div className="max-w-md w-full">
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
            <span className="block h-0.5 bg-gray-200 my-2"></span>
            <h3 className="text-lg font-semibold text-[#2D9CDB]">Detail</h3>
            <span className="block h-0.5 bg-gray-200 my-2"></span>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        {/* Box Atur Pembelian & Wishlist */}
        <div className="w-full max-w-sm border border-gray-300 rounded-lg p-4">
          <p className="font-bold text-lg mb-3">Atur Pembelian & Wishlist</p>
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <p className="text-sm font-medium">{product.name}</p>
          </div>
          <span className="block h-0.5 bg-gray-200 my-4"></span>
          <p>
            Stok:{" "}
            <span className="font-semibold">
              {product.stock.toLocaleString()}
            </span>
          </p>
          <div className="flex justify-between mt-2">
            <p className="text-gray-400">Total</p>
            <p className="text-black font-bold text-lg">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
          </div>
          <Button
            onClick={handleAddToWishlist}
            className="mt-4 w-full text-white bg-[#2D9CDB] border border-[#2D9CDB] hover:bg-white hover:text-[#2D9CDB]"
          >
            +Wishlist
          </Button>
          <Button
            onClick={handleBuyProduct}
            className="mt-2 w-full bg-white text-[#2D9CDB] border border-[#2D9CDB] hover:bg-gray-200"
          >
            Beli Langsung
          </Button>
        </div>
      </div>
    </div>
  );
}
