"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Plus
} from "lucide-react";
import axios from "axios"
import { useEffect, useState} from "react";
import { getCookie } from "cookies-next"
import { toast, ToastContainer } from "react-toastify";

interface product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  slug: string;
}

export default function Page() {
  const [data, setData] = useState<product[]>([]);

  useEffect(() => {
    const token = getCookie("token");
    const FetchProduct = async() => {
      try {
        const respone = await axios.get(
          "http://localhost:8000/api/seller/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(respone.data.content.data)
      } catch  {
        toast.error("Gagal mengambil data", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
    FetchProduct();
  }, [])


  return (
    <SidebarProvider>
      <ToastContainer />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="">Seller Stats</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Seller Job</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="">
          <Button className="ml-20 mt-5">
            <Plus className="w-4 h-4" />
            <p className="text-white font-medium text-sm">
              <a href="/seller/dashboard/create">Tambah Produk</a>
            </p>
          </Button>
        </div>
        <div className="mt-10 flex gap-4 ml-20">
          {/* Daftar Item */}
          {data.map((item) => (
            <div
              key={item.slug}
              className="w-44 h-80  bg-white rounded-lg items-center gap-5 drop-shadow-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className=" object-cover aspect-square rounded lg mb-4"
              />
              <p className="font-medium text-sm ml-3">{item.name}</p>
              <p className="font-bold text-base ml-3 mt-2">Rp.{item.price}</p>
              <p className="font-medium text-sm ml-3 text-gray-400 ">
                stock:{item.stock}
              </p>
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
