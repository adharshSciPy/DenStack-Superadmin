import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import {
  Search,
  Plus,
  Star,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import axios from "axios"
import inventoryUrl from "../../../inventoryUrl.js"
import { useAppSelector } from "../../../redux/hooks.js"


// const vendors = [
//   {
//     id: 'VND-001',
//     name: 'TechDental Solutions',
//     contact: 'John Smith',
//     email: 'sales@techdental.com',
//     phone: '+1 (555) 123-4567',
//     location: 'San Francisco, CA',
//     products: 45,
//     rating: 4.8,
//     reviews: 124,
//     totalSales: 125400,
//     status: 'active',
//     performance: 94,
//     category: 'Imaging Equipment',
//     joinDate: '2023-01-15'
//   },
//   {
//     id: 'VND-002',
//     name: 'Premium Dental Supply',
//     contact: 'Sarah Johnson',
//     email: 'contact@premiumdental.com',
//     phone: '+1 (555) 987-6543',
//     location: 'Chicago, IL',
//     products: 128,
//     rating: 4.6,
//     reviews: 89,
//     totalSales: 89300,
//     status: 'active',
//     performance: 87,
//     category: 'Surgical Instruments',
//     joinDate: '2023-03-22'
//   },
//   {
//     id: 'VND-003',
//     name: 'DentalCare Products',
//     contact: 'Mike Davis',
//     email: 'info@dentalcare.com',
//     phone: '+1 (555) 456-7890',
//     location: 'New York, NY',
//     products: 289,
//     rating: 4.4,
//     reviews: 156,
//     totalSales: 67200,
//     status: 'active',
//     performance: 82,
//     category: 'Consumables',
//     joinDate: '2022-11-08'
//   },
//   {
//     id: 'VND-004',
//     name: 'Digital Health Systems',
//     contact: 'Lisa Chen',
//     email: 'hello@digitalhealthsys.com',
//     phone: '+1 (555) 321-0987',
//     location: 'Austin, TX',
//     products: 67,
//     rating: 4.9,
//     reviews: 45,
//     totalSales: 156780,
//     status: 'pending',
//     performance: 91,
//     category: 'Digital Solutions',
//     joinDate: '2024-05-12'
//   }
// ];

interface ContactHistory {
  date: string;
  contactMethod: string;
  contactedBy: number;
  summary: string;
  notes: string;
}

interface Vendor {
  _id: string;
  vendorId: string;
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  rating: string;         // backend gives string
  performance: string;    // backend gives "74%"
  productsCount: number;
  totalRevenue: number;
  contactHistory: ContactHistory[];
  createdAt: string;
  updatedAt: string;
}



const vendorStats = [
  { label: 'Total Vendors', value: '89', change: '+5', icon: Users },
  { label: 'Active Vendors', value: '76', change: '+3', icon: Package },
  { label: 'Avg Rating', value: '4.6', change: '+0.2', icon: Star },
  { label: 'Total Revenue', value: '$438K', change: '+18%', icon: DollarSign }
];

const categories = [
  { name: 'Imaging Equipment', vendors: 12, revenue: 234500 },
  { name: 'Surgical Instruments', vendors: 18, revenue: 189300 },
  { name: 'Consumables', vendors: 28, revenue: 145600 },
  { name: 'Digital Solutions', vendors: 8, revenue: 298700 },
  { name: 'Sterilization', vendors: 15, revenue: 89400 }
];

export function VendorManagement() {
  const [vendors, setVendor] = useState<Vendor[]>([]);

  const token = useAppSelector((state) => state.auth.token)
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${inventoryUrl}api/v1/vendor/allVendor`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setVendor(res.data.data)
        console.log("res", res)
      } catch (error) {
        console.log(error)
      }
    }
    fetchVendors()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-secondary text-secondary-foreground">Active</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage supplier relationships and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Vendor Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendorStats.map((stat) => (
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
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">All Vendors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search vendors by name, category, or contact..." className="pl-10" />
                  </div>
                </div>
                <Button variant="outline">Filter by Category</Button>
                <Button variant="outline">Filter by Status</Button>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>Complete list of registered suppliers and partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{vendor.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{vendor.vendorId}</p>
                          <p className="text-xs text-muted-foreground">Joined {new Date(vendor.createdAt).toDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{vendor.email}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {vendor.phoneNumber}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {vendor.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary">{vendor.productsCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-medium">
                          ₹{vendor.totalRevenue.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{vendor.rating}</span>
                          {/* <span className="text-xs text-muted-foreground">({vendor.reviews})</span> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className={`text-sm font-medium`}>
                            {vendor.performance}
                          </span>
                          <Progress value={parseInt(vendor.performance)} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(vendor.status.toLowerCase())}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
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

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
                <CardDescription>Based on sales, ratings, and delivery performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors
                    .sort((a, b) =>
                      parseInt(b.performance) - parseInt(a.performance)
                    )
                    .slice(0, 5)
                    .map((vendor, index) => (
                      <div key={vendor._id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            {/* <p className="text-sm text-muted-foreground">{vendor.category}</p> */}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{vendor.performance}%</p>
                          {/* <p className="text-xs text-muted-foreground">${vendor.totalSales.toLocaleString()}</p> */}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Overall vendor ecosystem health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Delivery Time</span>
                    <span className="text-primary">2.4 days</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Quality Score</span>
                    <span className="text-primary">4.6/5.0</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">On-time Delivery</span>
                    <span className="text-primary">94.2%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-primary">4.7/5.0</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Categories</CardTitle>
              <CardDescription>Supplier distribution by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant="outline">{category.vendors} vendors</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Revenue</span>
                            <span className="text-primary">${category.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Avg per Vendor</span>
                            <span className="text-muted-foreground">
                              ${Math.round(category.revenue / category.vendors).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          Manage Vendors
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Vendor agreements and terms overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium text-green-700">Active Contracts</h3>
                    <p className="text-2xl text-green-700 mt-2">76</p>
                    <p className="text-sm text-muted-foreground">agreements in force</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium text-yellow-700">Expiring Soon</h3>
                    <p className="text-2xl text-yellow-700 mt-2">8</p>
                    <p className="text-sm text-muted-foreground">within 90 days</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium text-blue-700">Under Review</h3>
                    <p className="text-2xl text-blue-700 mt-2">5</p>
                    <p className="text-sm text-muted-foreground">pending approval</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  View All Contracts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}