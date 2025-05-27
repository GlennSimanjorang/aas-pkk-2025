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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  price: z.coerce.number().min(1, "Harga harus diisi"),
  stock: z.coerce.number().min(1, "Stok harus diisi"),
  sub_sub_category_id: z.coerce.number().min(1, "Kategori harus dipilih"),
});

export default function EditProductForm() {

  const { slug } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      sub_sub_category_id: undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;

        const token = getCookie("token");

        // Fetch product data
        const productResponse = await axios.get(
          `${baseUrl}/api/seller/products/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const productData = productResponse.data.content;

        // Set form values
        form.reset({
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          sub_sub_category_id: productData.sub_sub_category_id,
        });

        // Fetch categories
        let allCategories: Array<{ id: number; name: string }> = [];
        let nextPageUrl = `${baseUrl}/api/sub-sub-categories`;

        while (nextPageUrl) {
          const res = await axios.get(nextPageUrl, {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${getCookie("token")}`,
            },
          });

          const responseData = res.data.content.data;
          const pagination = res.data.content;

          allCategories = [...allCategories, ...responseData];
          nextPageUrl = pagination.next_page_url;

          if (nextPageUrl) {
            const url = new URL(nextPageUrl);
            const pathAndQuery = url.pathname + url.search;
            nextPageUrl = `${baseUrl}${pathAndQuery}`;
          }
        }
        setCategories(allCategories); 

      } catch (error) {
        console.error("Gagal mengambil data:", error);
        toast.error("Gagal memuat data produk");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = getCookie("token");

      // Send as JSON
      const payload = {
        name: values.name,
        price: values.price,
        stock: values.stock,
        sub_sub_category_id: values.sub_sub_category_id,
      };

      const response = await axios.put(
        `${baseUrl}/api/seller/products/${slug}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Produk berhasil diperbarui");
        router.push("/seller/dashboard");
      }
    } catch (error) {
      console.error("Gagal memperbarui produk:", error);

      // Detailed error handling
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Error tidak diketahui";
        toast.error(`Gagal memperbarui produk: ${errorMessage}`);
      } else {
        toast.error("Terjadi kesalahan pada sistem");
      }
    }
  }

  return (
    <SidebarProvider>
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
                  <BreadcrumbLink href="/seller/dashboard">
                    Seller Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/seller/dashboard">
                    Seller Product
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Product</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-6 w-2xl mx-auto h-auto">
          <h1 className="text-xl font-bold py-4">Edit Produk</h1>
          <div className="rounded-xl bg-muted/90 border dark:border-none dark:bg-muted/50 p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto py-10"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nama Produk"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sub_sub_category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Sub Sub Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Memproses..." : "Simpan Perubahan"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
