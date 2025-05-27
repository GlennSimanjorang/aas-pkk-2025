"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [selectedFile, setSelectedFile] = useState<{
    slug: string;
    file: File;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    const FetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/api/seller/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": true,
          },
        });
        setData(response.data.content.data);
      } catch {
        toast.error("Gagal mengambil data", {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    FetchProduct();
  }, []);

  const handleDelete = async (slug: string) => {
    const token = getCookie("token");

    try {
      const response = await axios.delete(
        `${baseUrl}/api/seller/products/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setData((prev) => prev.filter((item) => item.slug !== slug));
        toast.success("Produk berhasil dihapus...");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const token = getCookie("token");
    const formData = new FormData();
    formData.append("imageFile", selectedFile.file);

    try {
      const response = await axios.post(
        `${baseUrl}/api/seller/products/${selectedFile.slug}/change-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      // Gunakan URL dari backend langsung (jika kamu tahu format nama filenya)
      const imageUrl = `${baseUrl}/storage/product-images/${selectedFile.slug}.jpeg`;

      setData((prev) =>
        prev.map((product) =>
          product.slug === selectedFile.slug
            ? { ...product, image: imageUrl }
            : product
        )
      );

      toast.success("Gambar berhasil diubah!");
      setShowDialog(false);

      // Reset input file
      const input = document.getElementById(
        `file-input-${selectedFile.slug}`
      ) as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      console.error("Error detail:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Gagal mengupload gambar. Cek format file (max 2MB)"
      );
    }
  };
  

  return (
    <SidebarProvider>
      <ToastContainer />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="">Seller Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Seller Product</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="ml-20 mt-5">
          <Button>
            <Plus className="w-4 h-4" />
            <p className="text-white font-medium text-sm">
              <a href="/seller/dashboard/create">Tambah Produk</a>
            </p>
          </Button>
        </div>

        <div className="mt-10 flex gap-4 ml-20 flex-wrap">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-44 h-80 bg-white rounded-lg drop-shadow-lg p-3 space-y-2"
              >
                <Skeleton className="w-full h-44 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-end gap-2 mt-5">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}

          {!isLoading &&
            data.map((item) => (
              <div
                key={item.slug}
                className="w-44 h-80 bg-white rounded-lg drop-shadow-lg"
              >
                <div className="relative group aspect-square mx-3 mt-3 rounded-lg overflow-hidden">
                  <img
                    src={
                      item.image && baseUrl
                        ? item.image.replace("http://localhost:3001", baseUrl)
                        : item.image || ""
                    }
                    alt={item.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-input-${item.slug}`}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile({ slug: item.slug, file });
                        setShowDialog(true);
                      }
                    }}
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const input = document.getElementById(
                        `file-input-${item.slug}`
                      ) as HTMLInputElement;
                      input?.click();
                    }}
                  >
                    <PencilLine className="text-white w-6 h-6" />
                  </button>
                </div>

                <p className="font-medium text-sm ml-3">{item.name}</p>
                <p className="font-bold text-base ml-3 mt-2">Rp.{item.price}</p>
                <p className="font-medium text-sm ml-3 text-gray-400">
                  stock: {item.stock}
                </p>
                <div className="mt-5 justify-end flex items-end gap-2 mr-3">
                  <Link href={`/seller/dashboard/edit/${item.slug}`}>
                    <PencilLine className="w-4" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="cursor-pointer">
                        <Trash2 className="w-4 text-red-500 hover:scale-110 transition-all" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Apakah kamu yakin ingin menghapus produk ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Produk akan dihapus permanen dan tidak dapat
                          dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.slug)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
        </div>

        {/* AlertDialog untuk konfirmasi upload gambar */}
        {showDialog && (
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Ganti Gambar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Gambar baru akan menggantikan gambar lama. Lanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDialog(false)}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleImageUpload}>
                  Upload
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
