"use client";

import React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";


const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Full Name must be at least 2 characters." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    phone: z.string().min(10).regex(/^\+?[0-9]{10,15}\d$/, {message: "nomor telepon minimal 10 digit"}),
    role: z.string().min(1, { message: "Role is required" }),
    email: z.string().min(6, {message: "Email dibutuhkan"}).email({message: "Email tidak valid"}).regex(/@gmail\.com$/, {message: "Email harus menggunakan domain gmail.com"}),
  })

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      email: "",
      role: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
        const response = await axios.post(
          `${baseUrl}/api/auth/register`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success("Registration successful! Please login.", {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        router.push("/authenthication/login");
        }
      }
     catch (error) {
       if (axios.isAxiosError(error)) {
         toast.error(error.response?.data.message || "Registration failed");
       } else {
         toast.error("An unexpected error occurred");
       }
       console.error("Error response:", axios.isAxiosError(error) ? error.response?.data : error);
     }
     
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <ToastContainer />
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="•••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* phone field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="masukkan nomor telepon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emailr</FormLabel>
                    <FormControl>
                      <Input
                        type="mail"
                        placeholder="masukkan email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={() => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Controller
                        name="role"
                        control={form.control}
                        render={({ field: { value, onChange } }) => (
                          <Select onValueChange={onChange} value={value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/authenthication/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
