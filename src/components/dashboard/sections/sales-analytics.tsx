import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  BarChart3, IndianRupee
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import axios from "axios"
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import BASE_URLS from '../../../inventoryUrl';

interface SalesStats {
  totalRevenue: number,
  totalOrders: number,
  avgOrderValue: number,
  growthRate: number
}

const categoryData = [
  { name: 'Imaging Equipment', value: 35.2, revenue: 14890, color: '#1E4D2B' },
  { name: 'Surgical Instruments', value: 28.7, revenue: 12140, color: '#3FA796' },
  { name: 'Consumables', value: 18.9, revenue: 7990, color: '#6B7280' },
  { name: 'Digital Solutions', value: 12.4, revenue: 5240, color: '#D1FAE5' },
  { name: 'Others', value: 4.8, revenue: 2040, color: '#F9FAF9' }
];

const topProducts = [
  { name: 'Digital X-Ray Sensor', sales: 45, revenue: 112455, growth: 23.5 },
  { name: 'Dental Implant Kit', sales: 38, revenue: 34162, growth: 18.2 },
  { name: 'Intraoral Camera', sales: 22, revenue: 41778, growth: 15.7 },
  { name: 'LED Curing Light', sales: 67, revenue: 20033, growth: 12.4 },
  { name: 'Composite Filling Material', sales: 156, revenue: 23244, growth: 8.9 }
];

const clinicPerformance = [
  { clinic: 'SmileCare Dental', orders: 45, revenue: 8920, avgOrder: 198.2, growth: 15.3 },
  { clinic: 'Elite Orthodontics', orders: 38, revenue: 9870, avgOrder: 259.7, growth: 22.1 },
  { clinic: 'Modern Dentistry', orders: 42, revenue: 7830, avgOrder: 186.4, growth: 8.7 },
  { clinic: 'Family Dental Group', orders: 29, revenue: 5420, avgOrder: 186.9, growth: 12.8 },
  { clinic: 'Dental Care Plus', orders: 35, revenue: 6260, avgOrder: 178.9, growth: -2.4 }
];

export function SalesAnalytics() {
  const token = useAppSelector((state) => state.auth.token)
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    growthRate: 0
  })

  const [revenueTrend, setRevenueTrend] = useState([]);
  const [orderVolume, setOrderVolume] = useState([]);



  useEffect(() => {
    const fetchSales = async () => {
      try {
        const statsRes = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/super-admin/metrics`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const res = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/super-admin/trends`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setOrderVolume(res.data.trends.orderVolume)
        setRevenueTrend(res.data.trends.revenueTrend)
        console.log("res", res)

        setSalesStats(statsRes.data.metrics)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSales()
  }, [token])


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Sales Analytics</h1>
          <p className="text-muted-foreground">
            E-commerce performance metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">₹{salesStats.totalRevenue.toLocaleString()}</span>
                <Badge className="bg-secondary text-secondary-foreground">+18%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">last 6 months</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{salesStats.totalOrders}</span>
                <Badge className="bg-secondary text-secondary-foreground">+15%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">completed orders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">₹{Math.round(salesStats.avgOrderValue)}</span>
                <Badge className="bg-secondary text-secondary-foreground">+2.3%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">per transaction</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{salesStats.growthRate}%</span>
                <Badge className="bg-secondary text-secondary-foreground">MoM</Badge>
              </div>
              <p className="text-xs text-muted-foreground">month over month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="clinics">Clinic Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#1E4D2B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>

              </CardContent>
            </Card>

            {/* Order Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Order Volume</CardTitle>
                <CardDescription>Number of orders processed monthly</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3FA796" />
                  </BarChart>
                </ResponsiveContainer>

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue and volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-primary font-medium">${product.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-green-500">+{product.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Performance Analysis</CardTitle>
              <CardDescription>E-commerce activity by clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Clinic</th>
                      <th className="text-left p-3">Orders</th>
                      <th className="text-left p-3">Revenue</th>
                      <th className="text-left p-3">Avg Order</th>
                      <th className="text-left p-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicPerformance.map((clinic, index) => (
                      <tr key={index} className="border-b hover:bg-accent/50">
                        <td className="p-3 font-medium">{clinic.clinic}</td>
                        <td className="p-3">{clinic.orders}</td>
                        <td className="p-3 text-primary">${clinic.revenue.toLocaleString()}</td>
                        <td className="p-3">${clinic.avgOrder.toFixed(0)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`h-3 w-3 ${clinic.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
                            <span className={`text-sm ${clinic.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {clinic.growth > 0 ? '+' : ''}{clinic.growth}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-primary">${item.revenue.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({item.value}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
                <CardDescription>Growth and performance by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.value}%</span>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.value}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${category.revenue.toLocaleString()}</span>
                      <span>+{Math.round(Math.random() * 20)}% growth</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}