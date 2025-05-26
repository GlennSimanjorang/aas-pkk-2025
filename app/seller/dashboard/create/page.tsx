"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  imageFile: z.instanceof(File, { message: "Gambar produk harus diupload" }),
  price: z.coerce.number().min(1, "Harga harus diisi"),
  stock: z.coerce.number().min(1, "Stok harus diisi"),
  sub_sub_category_id: z.coerce.number().min(1, "Kategori harus dipilih"),
});

export default function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      sub_sub_category_id: undefined,
      imageFile: undefined,
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        
        let allCategories: Array<{ id: number; name: string }> = [];
        let nextPageUrl = `${baseUrl}/api/sub-sub-categories`;

        while (nextPageUrl) {
          const res = await axios.get(nextPageUrl);
          const responseData = res.data.content;

          allCategories = [...allCategories, ...responseData.data];
          nextPageUrl = responseData.next_page_url;
        }

        setCategories(allCategories);
      } catch (err) {
        console.error("Gagal mengambil kategori", err);
        toast.error("Gagal memuat kategori");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("imageFile", values.imageFile);
      formData.append("price", values.price.toString());
      formData.append("stock", values.stock.toString());
      formData.append(
        "sub_sub_category_id",
        values.sub_sub_category_id.toString()
      );

      const token = getCookie("token");
      await axios.post(`${baseUrl}/api/seller/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produk berhasil ditambahkan");
      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Gagal menambahkan produk");
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold py-4">Tambah Produk Baru</h1>
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
                    <Input placeholder="Nama Produk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Gambar Produk</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...fieldProps}
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
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
