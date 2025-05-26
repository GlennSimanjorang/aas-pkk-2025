"use client";

import  { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { setCookie } from "cookies-next";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface FormValues {
  username: string;
  password: string;
  role: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          withCredentials: true,
        }
      );
      

      const token = response.data?.content?.token;
      if (token) {
        setCookie("token", token, {
          secure: true,
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "none",
        })
        setCookie("role", data.role, {
          secure: true,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "none",
        });
        setCookie("username", data.username, {
          secure: true,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "none",
        });        
        toast.success("Berhasil login", {
          position: "top-center",
          autoClose: 5000,
          transition: Bounce,
        });
        
        router.push("/");
      } else {
        toast.error("Token tidak ditemukan di respons server");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.content?.message || "Gagal login, silakan coba lagi.";
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ToastContainer />
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="abdulrahman"
                  {...register("username", {
                    required: "Username dibutuhkan",
                    minLength: {
                      value: 3,
                      message: "Username minimal 6 karakter",
                    },
                  })}
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Role</Label>
                </div>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role dibutuhkan" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">user</SelectItem>
                        <SelectItem value="seller">seller</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <a href="/authenthication/register" className="ml-auto text-sm underline-offset-2 ">
                  Tidak mempunyai akun?{" "}
                  <span className="hover:underline">Register</span>
                </a>
                {errors.role && (
                  <span className="text-red-500 text-sm">
                    {errors.role.message}
                  </span>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/farasAJG.jpg"
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
