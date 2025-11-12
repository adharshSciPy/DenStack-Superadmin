import { useState } from 'react';
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

const orders = [
  {
    id: 'ORD-2024-001',
    clinic: 'SmileCare Dental Center',
    items: [
      { name: 'Digital X-Ray Sensor', qty: 2, price: 2499 },
      { name: 'Composite Filling Material', qty: 5, price: 149 }
    ],
    total: 5743,
    status: 'delivered',
    orderDate: '2024-06-15',
    deliveryDate: '2024-06-18',
    vendor: 'TechDental Solutions',
    priority: 'standard'
  },
  {
    id: 'ORD-2024-002',
    clinic: 'Elite Orthodontics',
    items: [
      { name: 'Dental Implant Kit', qty: 3, price: 899 },
      { name: 'Surgical Instruments Set', qty: 1, price: 1299 }
    ],
    total: 3996,
    status: 'in-transit',
    orderDate: '2024-06-20',
    deliveryDate: '2024-06-23',
    vendor: 'Premium Dental Supply',
    priority: 'urgent'
  },
  {
    id: 'ORD-2024-003',
    clinic: 'Family Dental Group',
    items: [
      { name: 'Sterilization Pouches', qty: 10, price: 25 },
      { name: 'Disposable Gloves', qty: 20, price: 15 }
    ],
    total: 550,
    status: 'pending',
    orderDate: '2024-06-22',
    deliveryDate: '2024-06-25',
    vendor: 'DentalCare Products',
    priority: 'standard'
  },
  {
    id: 'ORD-2024-004',
    clinic: 'Modern Dentistry',
    items: [
      { name: 'Intraoral Camera', qty: 1, price: 1899 },
      { name: 'LED Curing Light', qty: 2, price: 299 }
    ],
    total: 2497,
    status: 'processing',
    orderDate: '2024-06-23',
    deliveryDate: '2024-06-26',
    vendor: 'TechDental Solutions',
    priority: 'high'
  }
];

const orderStats = [
  { label: 'Total Orders', value: '1,247', change: '+23', icon: Package },
  { label: 'In Transit', value: '45', change: '+5', icon: Truck },
  { label: 'Delivered', value: '1,156', change: '+18', icon: CheckCircle },
  { label: 'Pending', value: '46', change: '-2', icon: Clock }
];

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-secondary text-secondary-foreground">Delivered</Badge>;
      case 'in-transit':
        return <Badge className="bg-primary text-primary-foreground">In Transit</Badge>;
      case 'processing':
        return <Badge className="bg-accent text-accent-foreground">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-yellow-500 text-white">High</Badge>;
      case 'standard':
        return <Badge variant="outline">Standard</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

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
        {orderStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{stat.value}</span>
                <Badge className="bg-secondary text-secondary-foreground">{stat.change}</Badge>
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
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
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
                    <TableHead>Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {order.orderDate}
                          </div>
                          <p className="text-xs text-muted-foreground">{order.vendor}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.clinic}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-xs">
                              {item.qty}x {item.name}
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
                          ${order.total.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(order.priority)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {order.deliveryDate}
                        </span>
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
                {orders.filter(order => order.status === 'in-transit' || order.status === 'processing').map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.clinic}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-medium">${order.total.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Expected: {order.deliveryDate}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Order Status</span>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="w-full bg-accent rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: order.status === 'processing' ? '25%' : 
                                     order.status === 'in-transit' ? '75%' : 
                                     order.status === 'delivered' ? '100%' : '0%'
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
                  <span className="text-3xl text-primary">42</span>
                  <p className="text-sm text-muted-foreground">avg orders/day</p>
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
                  <span className="text-3xl text-primary">$1,247</span>
                  <p className="text-sm text-muted-foreground">+12% vs last month</p>
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
                  <span className="text-3xl text-primary">94.2%</span>
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