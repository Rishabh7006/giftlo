import { useState } from "react";
import { Shield, Users, Package, Clock, CheckCircle2, XCircle, IndianRupee, Search, Download, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type Order } from "@/lib/data";
import { emailService } from "@/lib/emailService";
import { cn } from "@/lib/utils";

interface AdminPageProps {
  orders: Order[];
  onAction: (orderId: string, status: "approved" | "rejected", code?: string) => void;
}

export function AdminPage({ orders, onAction }: AdminPageProps) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdminLogin = () => {
    if (adminEmail === "admin@giftkart.com" && adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const handleApprove = (order: Order) => {
    setSelectedOrder(order);
    setGiftCardCode("");
    setDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!giftCardCode.trim()) {
      toast.error("Please enter the gift card code");
      return;
    }
    
    // Send email to user with gift card code
    await emailService.sendGiftCardToUser({
      orderId: selectedOrder!.id,
      userEmail: selectedOrder!.email,
      userMobile: selectedOrder!.mobile,
      brand: selectedOrder!.brand,
      amount: selectedOrder!.amount,
      utr: selectedOrder!.utr,
      status: "approved",
      giftCardCode: giftCardCode,
    });
    
    onAction(selectedOrder!.id, "approved", giftCardCode);
    setDialogOpen(false);
    setSelectedOrder(null);
    setGiftCardCode("");
    toast.success("Gift card sent to user's email!");
  };

  const handleReject = async (order: Order) => {
    // Send rejection email to user
    await emailService.sendRejectionToUser({
      orderId: order.id,
      userEmail: order.email,
      userMobile: order.mobile,
      brand: order.brand,
      amount: order.amount,
      utr: order.utr,
      status: "rejected",
    });
    
    onAction(order.id, "rejected");
    toast.error(`Order ${order.id} rejected. User notified via email.`);
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "User Email", "Mobile", "Brand", "Amount", "UTR", "Date", "Status", "Gift Card Code"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.email,
      o.mobile,
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
    a.download = "giftkart-admin-orders.csv";
    a.click();
    toast.success("Orders exported to CSV!");
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Secure access to the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@giftkart.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-1"
              />
            </div>
            <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={handleAdminLogin}>
              Login to Admin Panel
            </Button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Demo credentials: admin@giftkart.com / admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    revenue: orders.filter((o) => o.status === "approved").reduce((sum, o) => sum + o.amount, 0),
    users: new Set(orders.map((o) => o.email)).size,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage orders and gift card deliveries</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" onClick={() => setIsAdminLoggedIn(false)}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.total, icon: Package, color: "bg-blue-500" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "bg-amber-500" },
          { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "bg-green-500" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-500" },
          { label: "Revenue", value: `₹${stats.revenue}`, icon: IndianRupee, color: "bg-purple-500" },
          { label: "Users", value: stats.users, icon: Users, color: "bg-teal-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by order ID, email, or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Order Management</CardTitle>
          <CardDescription>Review and process customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({filteredOrders.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filteredOrders.filter((o) => o.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({filteredOrders.filter((o) => o.status === "approved").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({filteredOrders.filter((o) => o.status === "rejected").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AdminOrderTable orders={filteredOrders} onApprove={handleApprove} onReject={handleReject} />
            </TabsContent>
            <TabsContent value="pending">
              <AdminOrderTable orders={filteredOrders.filter((o) => o.status === "pending")} onApprove={handleApprove} onReject={handleReject} />
            </TabsContent>
            <TabsContent value="approved">
              <AdminOrderTable orders={filteredOrders.filter((o) => o.status === "approved")} onApprove={handleApprove} onReject={handleReject} />
            </TabsContent>
            <TabsContent value="rejected">
              <AdminOrderTable orders={filteredOrders.filter((o) => o.status === "rejected")} onApprove={handleApprove} onReject={handleReject} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Order</DialogTitle>
            <DialogDescription>
              Enter the gift card code to send to the customer
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Order: <span className="font-mono">{selectedOrder.id}</span></p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer: {selectedOrder.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Brand: {selectedOrder.brand}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Amount: ₹{selectedOrder.amount}</p>
              </div>
              <div>
                <Label htmlFor="gift-code">Gift Card Code</Label>
                <Input
                  id="gift-code"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  placeholder="Enter the gift card code"
                  className="mt-1 font-mono"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This code will be sent to <strong>{selectedOrder.email}</strong> via email
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmApprove}>
              Approve & Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminOrderTable({
  orders,
  onApprove,
  onReject,
}: {
  orders: Order[];
  onApprove: (order: Order) => void;
  onReject: (order: Order) => void;
}) {
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
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Order ID</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Customer</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Brand</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">UTR</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{order.id}</td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{order.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">+91 {order.mobile}</p>
                </div>
              </td>
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
                {order.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(order)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => onReject(order)}>
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    {order.status === "approved" ? "Processed" : "Closed"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}