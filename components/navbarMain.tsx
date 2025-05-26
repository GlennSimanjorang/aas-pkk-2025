"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Kategori } from "./Kategori";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Heart, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
}

interface ApiResponse {
  message: string;
  content: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
  };
  error: null | string;
}

export default function Navbars() {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userRole = getCookie("role");
    const userName = getCookie("username");
    setRole(userRole as string | null);
    setUsername(userName as string | null);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let currentPage = 1;
        let hasMorePages = true;
        const accumulatedProducts: Product[] = [];

        while (hasMorePages) {
          const response = await fetch(
            `http://localhost:8000/api/products?page=${currentPage}`
          );

          if (!response.ok) throw new Error("Failed to fetch products");

          const data: ApiResponse = await response.json();

          accumulatedProducts.push(...data.content.data);
          hasMorePages = data.content.next_page_url !== null;
          currentPage++;
        }

        setAllProducts(accumulatedProducts);
      } catch (err) {
        setError("Gagal memuat produk. Silakan coba kembali nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered.slice(0, 5));
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && filteredProducts.length > 0) {
      router.push(`/user/produk/${filteredProducts[0].slug}`);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/user/produk/${slug}`);
    setSearchQuery("");
    setFilteredProducts([]);
  };

  const handleLogout = async () => {
    const token = getCookie("token");
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error logout:", error);
    } finally {
      deleteCookie("role");
      deleteCookie("username");
      deleteCookie("token");
      router.push("/authenthication/login");
    }
  };

  return (
    <div className="sticky top-0 bg-white z-50">
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
          {/* Mobile Navbar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden mt-1">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] flex flex-col">
              <SheetTitle className="text-lg font-semibold mb-4">
                Menu
              </SheetTitle>

              <div className="grid gap-2 py-2">
                <div className="flex gap-2">
                  <Heart />
                  <Link href="/user/wishlist" className="text-base font-medium">
                    Wishlist
                  </Link>
                </div>

                {!role && (
                  <>
                    <Link
                      href="/authenthication/login"
                      className="text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/authenthication/register"
                      className="text-base font-medium"
                    >
                      Register
                    </Link>
                  </>
                )}

                {role === "seller" && (
                  <Link
                    href="/seller/dashboard"
                    className="text-base font-medium"
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              {/* USER MENU MOBILE */}
              {role === "user" && username && (
                <div className="mt-auto mb-2 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left text-xl font-semibold"
                      >
                        {username}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setShowLogoutDialog(true)}
                        className="cursor-pointer flex items-center gap-2 text-lg"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="mt-4 ml-4 lg:ml-16 hidden lg:flex"
            prefetch={false}
          >
            <p className="text-[#2D9CDB] font-bold text-3xl">TBPedia</p>
          </Link>

          {/* Kategori */}
          <div className="hidden lg:block ml-6 mt-4">
            <Kategori />
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xl ml-4 mt-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                />
                {isLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  </div>
                )}
              </div>
            </form>

            {filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.slug)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                  >
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist (desktop only) */}
          <Link
            href="/user/wishlist"
            className="font-medium text-sm mt-4 ml-8 hover:text-[#2D9CDB] transition-colors hidden lg:block"
          >
            Wishlist
          </Link>

          {/* Desktop Auth */}
          <nav className="ml-auto hidden lg:flex gap-6 mt-4">
            {!role && (
              <>
                <Link
                  href="/authenthication/login"
                  className="text-gray-700 hover:text-[#2D9CDB]"
                >
                  Login
                </Link>
                <Link
                  href="/authenthication/register"
                  className="text-gray-700 hover:text-[#2D9CDB]"
                >
                  Register
                </Link>
              </>
            )}
            {role === "seller" && (
              <Link
                href="/seller/dashboard"
                className="text-gray-700 hover:text-[#2D9CDB]"
              >
                Dashboard
              </Link>
            )}
            {role === "user" && username && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </header>

        {/* Alert Dialog for Logout Confirmation */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu akan keluar dari akun kamu sekarang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full border-b border-gray-200" />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
