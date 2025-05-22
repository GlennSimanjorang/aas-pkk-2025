"use client";
import Navbar from "@/components/navbarMain";
import Konten from "@/components/konten";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  slug: string;
};

export default function Main() {
  const [data, setData] = useState<Product[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedProduct] = useState<Product | null>(null);
  const [, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        setData(response.data.content.data);
        
        setNextPageUrl(response.data.content.next_page_url);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchInitialProducts();

  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPageUrl || isLoading) return;

    try {
      setIsLoading(true);
      const response = await axios.get(nextPageUrl);
      setData((prev) => [...prev, ...response.data.content.data]);
      setNextPageUrl(response.data.content.next_page_url);
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [nextPageUrl, isLoading]);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
      loadMore();
    }
  }, [isLoading, loadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleProductClick = async (slug: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${slug}`
      );
      setSelectedProduct(response.data.content);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Konten />

      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="font-bold text-xl my-6 ml-6">
          Rekomendasi Untuk Kamu{" "}
          <a href="/products" className="ml-1 text-[#00AA5B] text-sm">
            Lihat Semua
          </a>
        </h1>

        <div className="flex flex-wrap gap-3 justify-start ml-4 mb-6">
          {data.map((item) => (
            <Link
              key={item.id}
              href={`/user/produk/${item.slug}`}
              onClick={() => handleProductClick(item.slug)}
              className="w-48 h-72 rounded-lg bg-white shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-cover w-full h-48"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 text-black p-3">
                  <p className="text-sm font-medium truncate pt-2">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold pb-1.5">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs">
                    Total Stock: <span className="text-gray-500">{item.stock.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {isLoading && (
            <div className="w-full text-center py-4">Memuat...</div>
          )}
        </div>
      </div>
    </div>
  );
}
