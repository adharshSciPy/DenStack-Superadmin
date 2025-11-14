import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Star,
  Eye,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from "axios";
import inventoryUrl from '../../../inventoryUrl.js';
import { useAppSelector } from "../../../redux/hooks.js";

interface Product {
  _id: string;
  name: string;
  brand: string | { brandName?: string }; // API sometimes sends id, sometimes full object
  category: { _id: string };
  description: string;
  price: number;
  stock: number;
  image: string[];
  expiryDate: string;
  status: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}



const categories = [
  { name: 'Imaging Equipment', count: 45, icon: '📷' },
  { name: 'Surgical Instruments', count: 128, icon: '🔧' },
  { name: 'Consumables', count: 289, icon: '📦' },
  { name: 'Digital Solutions', count: 67, icon: '💻' },
  { name: 'Sterilization', count: 34, icon: '🧪' },
  { name: 'Orthodontics', count: 89, icon: '🦷' }
];

const marketplaceStats = [
  { label: 'Total Products', value: '1,247', change: '+23', icon: Package },
  { label: 'Monthly Orders', value: '456', change: '+18%', icon: ShoppingCart },
  { label: 'Active Vendors', value: '89', change: '+5', icon: Users },
  { label: 'Revenue', value: '$28,450', change: '+12%', icon: DollarSign }
];

export function EcommerceMarketplace() {
  const { token } = useAppSelector((state) => state.auth);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      console.log("token", token)
      const productDetails = await axios.get(`${inventoryUrl}api/v1/product/productsDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProducts(productDetails.data.data)
      console.log("products", productDetails)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const featuredProducts = products;



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">E-commerce Marketplace</h1>
          <p className="text-muted-foreground">
            Manage your integrated dental products marketplace
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Manage Categories
          </Button>
          <Button size="sm">
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketplaceStats.map((stat) => (
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
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Product Catalog</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Product Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products, vendors, SKUs..." className="pl-10" />
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
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Access Levels</SelectItem>
                    <SelectItem value="admin">Clinic Admin Only</SelectItem>
                    <SelectItem value="dentist">Dentist Access</SelectItem>
                    <SelectItem value="assistant">Assistant Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Top-performing products in the marketplace</CardDescription>
            </CardHeader>

            <CardContent>
              {featuredProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No featured products available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <Card key={product._id} className="hover:shadow-lg transition-shadow">

                      {/* IMAGE */}
                      <div className="aspect-video bg-accent rounded-t-lg overflow-hidden">
                        
                        <img
                          src={
                            product.image?.[0]
                              ? `${inventoryUrl}${product.image[0]}`
                              : "/placeholder.png"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <CardContent className="p-4 space-y-3">

                        {/* NAME + STATUS */}
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {product.status}
                          </Badge>
                        </div>

                        {/* CATEGORY */}
                        <p className="text-xs text-muted-foreground">
                          Category: {product.category?._id}
                        </p>

                        {/* STOCK */}
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </p>

                        {/* PRICE */}
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-primary">${product.price}</span>
                          <span className="text-xs text-muted-foreground">
                            {typeof product.brand === "string" ? product.brand : product.brand?.brandName}
                          </span>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage product categories and organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count} products</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>Configure what products different user roles can access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-secondary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Clinic Admin</CardTitle>
                    <CardDescription>Full marketplace access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>All Categories</span>
                      <Badge className="bg-secondary text-secondary-foreground">Full Access</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bulk Ordering</span>
                      <Badge className="bg-secondary text-secondary-foreground">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price Negotiation</span>
                      <Badge className="bg-secondary text-secondary-foreground">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Dentist</CardTitle>
                    <CardDescription>Professional equipment access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Surgical Instruments</span>
                      <Badge className="bg-primary text-primary-foreground">Full Access</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Imaging Equipment</span>
                      <Badge className="bg-primary text-primary-foreground">Full Access</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Consumables</span>
                      <Badge variant="outline">View Only</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Dental Assistant</CardTitle>
                    <CardDescription>Limited product access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Consumables</span>
                      <Badge className="bg-accent text-accent-foreground">Order Access</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sterilization</span>
                      <Badge className="bg-accent text-accent-foreground">Order Access</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Equipment</span>
                      <Badge variant="outline">View Only</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}