import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.js';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import {
  Search,
  Plus,
  Star,
  Package,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  IndianRupee, X
} from 'lucide-react';
import axios from "axios"
import inventoryUrl from "../../../inventoryUrl.js"
import { useAppSelector } from "../../../redux/hooks.js"



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

interface VendorCounts {
  totalVendors: string,
  activeVendors: string,
  avgRating: string,
  totalRevenue: string
}

interface AddVendorFormData {
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
}


export function VendorManagement() {
  const [vendors, setVendor] = useState<Vendor[]>([]);
  const [vendorCounts, setVendorCounts] = useState<VendorCounts>({
    totalVendors: "0",
    activeVendors: "0",
    avgRating: "0",
    totalRevenue: "0",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddVendorFormData>({
    name: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    address: '',
    status: 'Active'
  });

  const token = useAppSelector((state) => state.auth.token)
  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${inventoryUrl}api/v1/vendor/allVendor`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const vendorCountRes = await axios.get(
        `${inventoryUrl}api/v1/vendor/vendorCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("count", vendorCountRes)

      setVendorCounts(vendorCountRes.data.data);

      setVendor(res.data.data)
      console.log("res", res)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchVendors()
  }, [token])




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.companyName || !formData.email ||
      !formData.phoneNumber || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log(token)
      console.log("form", formData)
      await axios.post(`${inventoryUrl}api/v1/vendor/createVendor`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the vendors list
      await fetchVendors();

      // Reset form and close modal
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        address: '',
        status: 'Active'
      });
      setIsAddModalOpen(false);
      alert('Vendor Added Successfully');

    } catch (error) {
      console.log('Error adding vendor:', error);
      alert('Failed to add vendor. Please try again.');
    }
  };

  const vendorStats: {
    label: string;
    value: string;
    icon: any;
    change: string;
  }[] = [
      {
        label: "Total Vendors",
        value: vendorCounts.totalVendors,
        icon: Users,
        change: "+12%",
      },
      {
        label: "Active Vendors",
        value: vendorCounts.activeVendors,
        icon: Package,
        change: "+5%",
      },
      {
        label: "Avg Rating",
        value: vendorCounts.avgRating,
        icon: Star,
        change: "+2%",
      },
      {
        label: "Total Revenue",
        value: `₹${vendorCounts.totalRevenue}`,
        icon: IndianRupee,
        change: "+8%",
      },
    ];

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

  const categories = [
    { name: 'Imaging Equipment', vendors: 12, revenue: 234500 },
    { name: 'Surgical Instruments', vendors: 18, revenue: 189300 },
    { name: 'Consumables', vendors: 28, revenue: 145600 },
    { name: 'Digital Solutions', vendors: 8, revenue: 298700 },
    { name: 'Sterilization', vendors: 15, revenue: 89400 }
  ];

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

          {/* Add Vendor Modal */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              backgroundColor: 'rgba(112, 53, 160, 1)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(112, 53, 160, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(112, 53, 160, 1)'}
          >
            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Add Vendor
          </button>
          {/* Modal Overlay */}
          {isAddModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px'
              }}
              onClick={() => setIsAddModalOpen(false)}
            >
              {/* Modal Content */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  maxWidth: '672px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  position: 'relative'
                }}
              >
                {/* Modal Header */}
                <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                        Add New Vendor
                      </h2>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        Enter vendor details to register a new supplier
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#6b7280',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      <X style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {/* Vendor Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="name" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Vendor Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter vendor name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>

                    {/* Company Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="companyName" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Company Name *
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="email" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vendor@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>

                    {/* Phone Number */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="phoneNumber" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Phone Number *
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>

                    {/* Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="status" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Status
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">InActive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    {/* Address - Full Width */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                      <label htmlFor="address" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmit()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: '#ac66e6ff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(112, 53, 160, 1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(112, 53, 160, 1)'}
                    >
                      <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Add Vendor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                          ₹{vendor.totalRevenue}
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