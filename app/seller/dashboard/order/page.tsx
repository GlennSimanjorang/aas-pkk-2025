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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

  

export default function Order() {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const token = getCookie("token");
      const url =
        selectedStatus === "all"
          ? `${baseUrl}/api/seller/orders`
          : `${baseUrl}/api/seller/orders?status=${encodeURIComponent(
              selectedStatus
            )}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.content.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = getCookie("token");
      const previousData = [...data];

      // Optimistic update
      setData((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await axios.put(
        `${baseUrl}/api/seller/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      setData(previousData);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "on progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "finished":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

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
                  <BreadcrumbPage>Order Product</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          {/* Filter Status Section */}
          <div className="mb-6">
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="on progress">On Progress</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableCaption>Daftar Pesanan</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Username Pembeli</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Total Harga</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.product?.name || "-"}</TableCell>
                  <TableCell>{order.user?.username || "-"}</TableCell>
                  <TableCell>{order.user?.phone || "-"}</TableCell>
                  <TableCell>
                    {order.total_price?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }) || "-"}
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.status || ""}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="on progress">On Progress</option>
                      <option value="finished">Finished</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
