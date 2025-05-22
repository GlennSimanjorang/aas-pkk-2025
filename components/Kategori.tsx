"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";


export function Kategori() {
  interface Category {
    name: string;
    slug: string;
  }

  interface SubCategory {
    name: string;
    slug: string;
  }

  interface SubSubCategory {
    name: string;
    slug: string;
  }

  interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    slug: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(
    null
  );
  const [hoveredSubSubCategory, setHoveredSubSubCategory] = useState<
    string | null
  >(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();


  // Fetch categories on load
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories").then((res) => {
      setCategories(res.data.content.data);
    });
  }, []);

  // Fetch sub-categories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `http://localhost:8000/api/categories/${selectedCategory}?with=subCategories`
        )
        .then((res) => {
          setSubCategories(res.data.content.sub_categories || []);
        });
    }
  }, [selectedCategory]);

  // Fetch sub-sub-categories when sub-category is hovered
  useEffect(() => {
    if (hoveredSubCategory) {
      axios
        .get(
          `http://localhost:8000/api/sub-categories/${hoveredSubCategory}?with=subSubCategories`
        )
        .then((res) => {
          setSubSubCategories(res.data.content.sub_sub_categories || []);
        });
    } else {
      setSubSubCategories([]);
    }
  }, [hoveredSubCategory]);

  // Fetch products when sub-sub-category is hovered
  useEffect(() => {
    if (hoveredSubSubCategory) {
      axios
        .get(
          `http://localhost:8000/api/sub-sub-categories/${hoveredSubSubCategory}`
        )
        .then((res) => {
          const products =
            res.data.content.product_categories?.map((pc: any) => pc.product) ||
            [];
          setProducts(products);
        });
    } else {
      setProducts([]);
    }
  }, [hoveredSubSubCategory]);

  return (
    <NavigationMenu className="mt-5 ml-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
          <NavigationMenuContent className="md:w-7xl h-96">
            {/* Kategori */}
            <div className="flex gap-5 p-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`text-sm px-2 py-1 rounded ${
                    selectedCategory === cat.slug ? "text-nav-text" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setHoveredSubCategory(null);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="w-full border-b border-gray-200 mb-4" />

            {/* Subkategori dan Produk */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-4 h-72">
              {/* Daftar Subkategori */}
              <div className="flex flex-col gap-2 w-32 border-r border-gray-300 pr-4">
                {subCategories.map((sub) => (
                  <span
                    key={sub.slug}
                    className={`cursor-pointer text-sm font-semibold hover:font-bold ${
                      hoveredSubCategory === sub.slug
                        ? "bg-gray-200 p-1 rounded-lg"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredSubCategory(sub.slug)}
                  >
                    {sub.name}
                  </span>
                ))}
              </div>

              {/* Daftar Sub-Subkategori */}
              <div className="gap-4 overflow-y-auto p-2">
                {subSubCategories.map((subsub) => (
                  <div
                    key={subsub.slug}
                    className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                    onMouseEnter={() => setHoveredSubSubCategory(subsub.slug)}
                    onMouseLeave={() => setHoveredSubSubCategory(null)}
                  >
                    <div className="font-semibold text-sm">{subsub.name}</div>
                  </div>
                ))}
                <div className="overflow-y-auto p-2">
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => router.push(`user/produk/${product.slug}`)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rp {product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daftar Produk */}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
