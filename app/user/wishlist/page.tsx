"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbarMain";
import { toast, ToastContainer } from "react-toastify";
import { getCookie } from "cookies-next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTriggers,
} from "@/components/ui/navigation-menu";

type WishlistItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getCookie("token");

      if (!token) {
        toast.error("Please login to view your wishlist", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        window.location.href = "/authenthication/login";
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/wishlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlist(response.data.content.products);
      } catch {
        toast.error("Error fetching wishlist", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
      setIsLoading(false);
    };
    fetchWishlist();
  }, []);

  const destroyWishlistItem = async (slug: string) => {
    const token = getCookie("token");
    try {
      await axios.delete(`http://localhost:8000/api/user/wishlists/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.slug !== slug)
      );
      toast.success("Item removed from wishlist", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch {
      toast.error("Error removing item from wishlist", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="w-full min-h-screen bg-[#F2F5F9]">
        <h1 className="font-bold text-2xl px-6 lg:px-28 mb-8 pt-10">
          Wishlist
        </h1>
        <div className="px-6 lg:px-28 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
          {wishlist.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="bg-white rounded-lg p-3 shadow-sm flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <p className="font-medium text-sm">{item.name}</p>
              <p className="font-bold text-base mt-2">Rp.{item.price}</p>
              <p className="font-medium text-sm text-gray-400">
                Stock: {item.stock}
              </p>
              <NavigationMenu className="mt-3">
                <NavigationMenuList>
                  <div className="flex flex-row gap-2">
                    <NavigationMenuItem>
                      <NavigationMenuTriggers>...</NavigationMenuTriggers>
                      <NavigationMenuContent className="min-w-[120px]">
                        <button
                          onClick={() => destroyWishlistItem(item.slug)}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                        >
                          Hapus Item
                        </button>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <div>
                      <button>Tes</button>
                    </div>
                  </div>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
