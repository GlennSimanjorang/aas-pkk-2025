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

  // Fetch main categories
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories").then((res) => {
      setCategories(res.data.content.data);
    });
  }, []);

  // Fetch sub-categories
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

  // Fetch sub-sub-categories
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

  // Fetch products
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
              {categories.map((cat, index) => (
                <button
                  key={`${cat.slug}-${index}`}
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
              {/* Subkategori */}
              <div className="flex flex-col gap-2 w-32 border-r border-gray-300 pr-4 h-64 overflow-y-auto">
                {subCategories.map((sub, index) => (
                  <span
                    key={`${sub.slug}-${index}`}
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

              {/* Sub-subkategori + Produk Inline */}
              <div className="gap-4 overflow-y-auto p-2 h-64 col-span-2">
                {subSubCategories.map((subsub, index) => (
                  <div
                    key={`${subsub.slug}-${index}`}
                    className="cursor-pointer p-2 hover:bg-gray-100 rounded transition-all duration-300"
                    onMouseEnter={() => setHoveredSubSubCategory(subsub.slug)}
                    onMouseLeave={() => setHoveredSubSubCategory(null)}
                  >
                    <div className="font-semibold text-sm">{subsub.name}</div>

                    {hoveredSubSubCategory === subsub.slug && products.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => router.push(`user/produk/${product.slug}`)}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <div className="text-xs font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                Rp {product.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
