import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import BASE_URLS from '../../../inventoryUrl.js';
import { useAppSelector } from "../../../redux/hooks.js"

// const orders = [
//   {
//     id: 'ORD-2024-001',
//     clinic: 'SmileCare Dental Center',
//     items: [
//       { name: 'Digital X-Ray Sensor', qty: 2, price: 2499 },
//       { name: 'Composite Filling Material', qty: 5, price: 149 }
//     ],
//     total: 5743,
//     status: 'delivered',
//     orderDate: '2024-06-15',
//     deliveryDate: '2024-06-18',
//     vendor: 'TechDental Solutions',
//     priority: 'standard'
//   },
//   {
//     id: 'ORD-2024-002',
//     clinic: 'Elite Orthodontics',
//     items: [
//       { name: 'Dental Implant Kit', qty: 3, price: 899 },
//       { name: 'Surgical Instruments Set', qty: 1, price: 1299 }
//     ],
//     total: 3996,
//     status: 'in-transit',
//     orderDate: '2024-06-20',
//     deliveryDate: '2024-06-23',
//     vendor: 'Premium Dental Supply',
//     priority: 'urgent'
//   },
//   {
//     id: 'ORD-2024-003',
//     clinic: 'Family Dental Group',
//     items: [
//       { name: 'Sterilization Pouches', qty: 10, price: 25 },
//       { name: 'Disposable Gloves', qty: 20, price: 15 }
//     ],
//     total: 550,
//     status: 'pending',
//     orderDate: '2024-06-22',
//     deliveryDate: '2024-06-25',
//     vendor: 'DentalCare Products',
//     priority: 'standard'
//   },
//   {
//     id: 'ORD-2024-004',
//     clinic: 'Modern Dentistry',
//     items: [
//       { name: 'Intraoral Camera', qty: 1, price: 1899 },
//       { name: 'LED Curing Light', qty: 2, price: 299 }
//     ],
//     total: 2497,
//     status: 'processing',
//     orderDate: '2024-06-23',
//     deliveryDate: '2024-06-26',
//     vendor: 'TechDental Solutions',
//     priority: 'high'
//   }
// ];


interface OrderStats {
  totalOrders: number,
  processing: number,
  shipped: number,
  delivered: number,
  cancelled: number
}

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface OrderData {
  _id: string;
  orderId: string;
  date: string;
  clinic: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: "PROCESSING" | "DELIVERED" | "CANCELLED" | "SHIPPED";
  priority: string;
}

export interface DashboardApiResponse {
  success: boolean;
  dashboard: DashboardData;
}

export interface DashboardData {
  orderVolume: MetricValue;
  averageOrderValue: MetricWithGrowth;
  fulfillmentRate: MetricStringValue;
}

export interface MetricValue {
  label: string;
  value: number;
}

export interface MetricWithGrowth {
  label: string;
  value: number;
  growthPercent: number;
}

export interface MetricStringValue {
  label: string;
  value: string;
}


export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months start at 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};



export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  })

  const [orders, setOrders] = useState<OrderData[]>([])
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [orderAnalytics, setOrderAnalytics] = useState<DashboardData | null>(null);



  const token = useAppSelector((state) => state.auth.token)
  const fetchOrders = async () => {
    try {
      const statsRes = await axios.get(`${BASE_URLS.INVENTORY}api/v1/order/orderStats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const response = await axios.get(`${BASE_URLS.INVENTORY}api/v1/order/recentOrders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const analyticsRes = await axios.get(`${BASE_URLS.INVENTORY}api/v1/order/dashboard-analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderStats(statsRes.data.stats)
      setOrders(response.data.data)
      setOrderAnalytics(analyticsRes.data.dashboard);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [token])

  const computedStats = [
    { label: "Total Orders", value: orderStats.totalOrders, icon: Package },
    { label: "Processing", value: orderStats.processing, icon: RefreshCw },
    { label: "Shipped", value: orderStats.shipped, icon: Truck },
    { label: "Delivered", value: orderStats.delivered, icon: CheckCircle },
    { label: "Cancelled", value: orderStats.cancelled, icon: AlertCircle },
  ];


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge className="bg-secondary text-secondary-foreground">Delivered</Badge>;
      case 'SHIPPED':
        return <Badge className="bg-primary text-primary-foreground">Shipped</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-accent text-accent-foreground">Processing</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Badge variant="destructive">Low</Badge>;
      case 'HIGH':
        return <Badge className="bg-yellow-500 text-white">High</Badge>;
      case 'STANDARD':
        return <Badge variant="outline">Standard</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order.orderId?.toString().toLowerCase() || "";
    const clinic = order.clinic?.toString().toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      orderId.includes(search) || clinic.includes(search);

    // 🔄 Status filter
    const matchesStatus =
      statusFilter === "All"
        ? true
        : order.orderStatus === statusFilter;

    // ⭐ Priority filter
    const matchesPriority =
      priorityFilter === "All"
        ? true
        : order.priority?.toUpperCase() === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage e-commerce orders across all clinics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Orders
          </Button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {computedStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Order Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders by ID, clinic, or product..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priority</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>

              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Complete order history and status tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.orderId}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.clinic}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-xs">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-medium">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.orderStatus)}
                          {getStatusBadge(order.orderStatus)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(order.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Truck className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking Dashboard</CardTitle>
              <CardDescription>Real-time tracking of all orders in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredOrders.filter(order => order.orderStatus === 'SHIPPED' || order.orderStatus === 'PROCESSING').map((order) => (
                  <Card key={order._id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{order._id}</h3>
                          <p className="text-sm text-muted-foreground">{order.clinic}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-medium">${order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Order Status</span>
                          {getStatusBadge(order.orderStatus)}
                        </div>

                        <div className="w-full bg-accent rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{
                              width: order.orderStatus === 'PROCESSING' ? '25%' :
                                order.orderStatus === 'SHIPPED' ? '75%' :
                                  order.orderStatus === 'DELIVERED' ? '100%' : '0%'
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>In Transit</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Volume</CardTitle>
                <CardDescription>Orders per day this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-3xl text-primary">{orderAnalytics?.orderVolume.value ?? 0}</span>
                  <p className="text-sm text-muted-foreground">{orderAnalytics?.orderVolume.label}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Mean transaction value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-3xl text-primary">₹{orderAnalytics?.averageOrderValue.value.toLocaleString()}</span>
                  <p className="text-sm text-muted-foreground">{orderAnalytics?.averageOrderValue.growthPercent}% vs last month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fulfillment Rate</CardTitle>
                <CardDescription>On-time delivery percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-3xl text-primary">{orderAnalytics?.fulfillmentRate.value}%</span>
                  <p className="text-sm text-muted-foreground">delivery success</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}