"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCookie} from "cookies-next"
import { useEffect, useState } from "react";
import {Kategori} from "./Kategori";
import { Input } from "@/components/ui/input";


export default function Navbars() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = getCookie("role");
    setRole(userRole?.toString() || null);
  }, []);
  return (
    <div className="">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        {/* navbar mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-2 py-6">
              {!role && (
                <>
                  <Link
                    href="/authenthication/login"
                    className="flex w-full items-center py-2 text-lg font-semibold text-black"
                    prefetch={false}
                  >
                    Login
                  </Link>
                  <Link
                    href="/authenthication/register"
                    className="flex w-full items-center py-2 text-lg font-semibold text-black"
                    prefetch={false}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* navbar dekstop */}
        <Link href="/" className="mt-4 hidden lg:flex ml-16" prefetch={false}>
          <p
            className="text-[#2D9CDB] font-bold text-3xl"
          >
            TBPedia
          </p>
        </Link>
        <Kategori />
        <Input
          type="email"
          placeholder="Cari di logo"
          className="w-3/5 ml-2 mt-4"
        />
        <Link href="/user/wishlist">
          <p className="font-medium text-sm mt-4 ml-8 hover:text-nav-text">
            Wishlist
          </p>
        </Link>
        <nav className="ml-auto  lg:flex gap-6">
          {!role && (
            <>
              <Link
                href="/authentication/login"
                className="flex w-full items-center py-2 text-lg font-semibold text-black"
                prefetch={false}
              >
                Login
              </Link>
              <Link
                href="/authentication/register"
                className="flex w-full items-center py-2 "
                prefetch={false}
              >
                register
              </Link>
            </>
          )}
        </nav>
      </header>
      <div className="  w-full border-b border-gray-200" />
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


