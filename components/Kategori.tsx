"use client";
import { useState, useEffect,  } from "react";
import axios from "axios";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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



  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(
    null
  );

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

            {/* Subkategori  */}
            <div className="grid grid-cols-[auto_1fr] gap-4 h-72">
              <div className="flex flex-col gap-2 w-32 border-r border-gray-300 pr-4">
                {subCategories.map((sub) => (
                  <span
                    key={sub.slug}
                    className={`cursor-pointer text-sm font-semibold hover:font-bold ${
                      hoveredSubCategory === sub.slug ? "bg-gray-200 p-1 rounded-lg" : ""
                    }`}
                    onMouseEnter={() => setHoveredSubCategory(sub.slug)}
                  >
                    {sub.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 overflow-y-auto">
                {subSubCategories.map((subsub) => (
                  <div key={subsub.slug} className="text-base font-semibold">
                    {subsub.name}
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
