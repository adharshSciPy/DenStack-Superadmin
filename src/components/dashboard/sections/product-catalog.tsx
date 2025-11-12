import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Switch } from '../../ui/switch';
import { 
  Search, 
  Plus, 
  Package, 
  Edit, 
  Eye, 
  Star,
  Filter,
  Grid,
  List,
  Tag,
  DollarSign
} from 'lucide-react';

const products = [
  {
    id: 'PRD-001',
    name: 'Digital X-Ray Sensor',
    category: 'Imaging Equipment',
    vendor: 'TechDental Solutions',
    price: 2499,
    cost: 1899,
    stock: 45,
    rating: 4.8,
    reviews: 24,
    status: 'active',
    clinicAccess: ['Clinic Admin', 'Dentist'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 'PRD-002',
    name: 'Dental Implant Kit',
    category: 'Surgical Instruments',
    vendor: 'Premium Dental Supply',
    price: 899,
    cost: 679,
    stock: 23,
    rating: 4.9,
    reviews: 18,
    status: 'active',
    clinicAccess: ['Clinic Admin', 'Dentist'],
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 'PRD-003',
    name: 'Composite Filling Material',
    category: 'Consumables',
    vendor: 'DentalCare Products',
    price: 149,
    cost: 89,
    stock: 156,
    rating: 4.6,
    reviews: 45,
    status: 'active',
    clinicAccess: ['Clinic Admin', 'Dentist', 'Dental Assistant'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 'PRD-004',
    name: 'Intraoral Camera',
    category: 'Imaging Equipment',
    vendor: 'TechDental Solutions',
    price: 1899,
    cost: 1299,
    stock: 8,
    rating: 4.7,
    reviews: 32,
    status: 'low-stock',
    clinicAccess: ['Clinic Admin', 'Dentist'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center'
  }
];

const categories = [
  { name: 'Imaging Equipment', count: 45, revenue: 123450 },
  { name: 'Surgical Instruments', count: 128, revenue: 234560 },
  { name: 'Consumables', count: 289, revenue: 89340 },
  { name: 'Digital Solutions', count: 67, revenue: 156780 },
  { name: 'Sterilization', count: 34, revenue: 45230 },
  { name: 'Orthodontics', count: 89, revenue: 198760 }
];

export function ProductCatalog() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-secondary text-secondary-foreground">Active</Badge>;
      case 'low-stock':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Low Stock</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMargin = (price: number, cost: number) => {
    return Math.round(((price - cost) / price) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Product Catalog</h1>
          <p className="text-muted-foreground">
            Manage your dental product inventory and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">1,247</span>
              <p className="text-xs text-muted-foreground">across all categories</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">4.7</span>
              <p className="text-xs text-muted-foreground">customer satisfaction</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
            <Tag className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">23</span>
              <p className="text-xs text-muted-foreground">need restocking</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">$2.1M</span>
              <p className="text-xs text-muted-foreground">inventory value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Control</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products by name, SKU, or vendor..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="imaging">Imaging Equipment</SelectItem>
                    <SelectItem value="surgical">Surgical Instruments</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Complete product catalog with pricing and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product.vendor}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-primary font-medium">${product.price}</span>
                          <p className="text-xs text-muted-foreground">Cost: ${product.cost}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {getMargin(product.price, product.cost)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? 'text-yellow-600' : 'text-foreground'}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.clinicAccess.slice(0, 2).map((access) => (
                            <Badge key={access} variant="outline" className="text-xs">
                              {access.split(' ')[0]}
                            </Badge>
                          ))}
                          {product.clinicAccess.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{product.clinicAccess.length - 2}</Badge>
                          )}
                        </div>
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

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage product organization and category performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{category.name}</h3>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Products</span>
                            <span className="text-primary">{category.count}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Revenue</span>
                            <span className="text-primary">${category.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          View Products
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Management</CardTitle>
              <CardDescription>Control pricing strategies and margin optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Global Pricing Rules</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-pricing enabled</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dynamic pricing</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volume discounts</span>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Margin Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Margin</span>
                        <span className="text-primary">34.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Best Category</span>
                        <span className="text-primary">Digital Solutions (45%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lowest Margin</span>
                        <span className="text-yellow-600">Consumables (18%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Control</CardTitle>
              <CardDescription>Monitor stock levels and automated reordering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-medium text-yellow-700">Low Stock Alert</h3>
                      <p className="text-2xl text-yellow-700 mt-2">23</p>
                      <p className="text-sm text-muted-foreground">products need restocking</p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-medium text-red-700">Out of Stock</h3>
                      <p className="text-2xl text-red-700 mt-2">5</p>
                      <p className="text-sm text-muted-foreground">products unavailable</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-medium text-green-700">Well Stocked</h3>
                      <p className="text-2xl text-green-700 mt-2">1,219</p>
                      <p className="text-sm text-muted-foreground">products in stock</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Automated Reorder Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-reorder enabled</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low stock notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vendor notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Demand forecasting</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}