import { useState } from "react";
import { Package, Clock, CheckCircle2, XCircle, LogOut, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type Order, type User } from "@/lib/data";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
}

export function DashboardPage({ user, orders, onLogout }: DashboardPageProps) {
  const userOrders = orders.filter((o) => o.userId === user.id);
  const pendingOrders = userOrders.filter((o) => o.status === "pending");
  const approvedOrders = userOrders.filter((o) => o.status === "approved");
  const rejectedOrders = userOrders.filter((o) => o.status === "rejected");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Gift card code copied!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Brand", "Amount", "UTR", "Date", "Status", "Gift Card Code"];
    const rows = userOrders.map((o) => [
      o.id,
      o.brand,
      o.amount,
      o.utr,
      new Date(o.createdAt).toLocaleDateString(),
      o.status,
      o.giftCardCode || "",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "giftkart-orders.csv";
    a.click();
    toast.success("Orders exported to CSV!");
  };

  const stats = [
    { label: "Total Orders", value: userOrders.length, icon: Package, color: "bg-blue-500" },
    { label: "Pending", value: pendingOrders.length, icon: Clock, color: "bg-amber-500" },
    { label: "Approved", value: approvedOrders.length, icon: CheckCircle2, color: "bg-green-500" },
    { label: "Rejected", value: rejectedOrders.length, icon: XCircle, color: "bg-red-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">+91 {user.mobile}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Purchase History</CardTitle>
          <CardDescription>Track all your gift card orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({userOrders.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedOrders.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <OrderTable orders={userOrders} onCopyCode={handleCopyCode} />
            </TabsContent>
            <TabsContent value="pending">
              <OrderTable orders={pendingOrders} onCopyCode={handleCopyCode} />
            </TabsContent>
            <TabsContent value="approved">
              <OrderTable orders={approvedOrders} onCopyCode={handleCopyCode} />
            </TabsContent>
            <TabsContent value="rejected">
              <OrderTable orders={rejectedOrders} onCopyCode={handleCopyCode} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderTable({ orders, onCopyCode }: { orders: Order[]; onCopyCode: (code: string) => void }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Order ID</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Brand</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">UTR</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Gift Card Code</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{order.id}</td>
              <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{order.brand}</td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">₹{order.amount}</td>
              <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{order.utr}</td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={cn(
                    order.status === "approved" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                    order.status === "pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                    order.status === "rejected" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  )}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {order.giftCardCode ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{order.giftCardCode}</span>
                    <Button variant="ghost" size="sm" onClick={() => onCopyCode(order.giftCardCode!)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}