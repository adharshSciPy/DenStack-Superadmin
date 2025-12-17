import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Download,
  Filter
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks.js';
import BASE_URLS from '../../../inventoryUrl';

interface DashboardMetric {
  count?: number;
  percentage?: number;
  score?: number;
}

interface DashboardStats {
  totalAppointments: DashboardMetric;
  activeUsers: DashboardMetric;
  systemEfficiency: DashboardMetric;
  avgSatisfaction: DashboardMetric;
}


const performanceData = [
  { clinic: 'SmileCare Dental', users: 245, revenue: 12500, satisfaction: 4.8, efficiency: 92 },
  { clinic: 'Elite Orthodontics', users: 189, revenue: 9800, satisfaction: 4.6, efficiency: 88 },
  { clinic: 'Dental Care Plus', users: 156, revenue: 7200, satisfaction: 4.4, efficiency: 85 },
  { clinic: 'Family Dental', users: 134, revenue: 6800, satisfaction: 4.7, efficiency: 90 },
  { clinic: 'Modern Dentistry', users: 178, revenue: 8900, satisfaction: 4.5, efficiency: 87 }
];

const usageData = [
  { month: 'Jan', appointments: 12450, communications: 8920, ecommerce: 2340 },
  { month: 'Feb', appointments: 13200, communications: 9150, ecommerce: 2890 },
  { month: 'Mar', appointments: 11800, communications: 8750, ecommerce: 2650 },
  { month: 'Apr', appointments: 14500, communications: 10200, ecommerce: 3120 },
  { month: 'May', appointments: 15600, communications: 11100, ecommerce: 3450 },
  { month: 'Jun', appointments: 16800, communications: 12300, ecommerce: 3890 }
];

const communicationData = [
  { type: 'SMS', usage: 45600, limit: 50000, cost: 912 },
  { type: 'Email', usage: 23400, limit: 30000, cost: 234 },
  { type: 'WhatsApp', usage: 18900, limit: 25000, cost: 567 },
  { type: 'Voice Calls', usage: 7800, limit: 10000, cost: 780 }
];

const regionData = [
  { name: 'North America', value: 125, color: '#1E4D2B' },
  { name: 'Europe', value: 89, color: '#3FA796' },
  { name: 'Asia Pacific', value: 67, color: '#6B7280' },
  { name: 'Latin America', value: 34, color: '#D1FAE5' }
];

export function AnalyticsDashboard() {
  const token = useAppSelector((state) => state.auth.token)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/super-admin/appointmentStats`);
        console.log("res", res)
        setDashboardStats(res.data.dashboard);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };

    fetchDashboardStats();
  }, [token]);


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Cross-clinic performance metrics and insights
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
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{dashboardStats?.totalAppointments.count ?? 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{dashboardStats?.activeUsers.count ?? 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">across all clinics</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{dashboardStats?.systemEfficiency.percentage ?? 0}%</span>
              </div>
              <p className="text-xs text-muted-foreground">overall performance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">{dashboardStats?.avgSatisfaction.score ?? 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">out of 5.0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Clinic Performance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="regional">Regional Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Trends</CardTitle>
                <CardDescription>Monthly usage across core platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="appointments" stackId="1" stroke="#1E4D2B" fill="#1E4D2B" />
                    <Area type="monotone" dataKey="communications" stackId="1" stroke="#3FA796" fill="#3FA796" />
                    <Area type="monotone" dataKey="ecommerce" stackId="1" stroke="#6B7280" fill="#6B7280" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Usage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Current Month Breakdown</CardTitle>
                <CardDescription>Feature usage distribution for June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm">Appointments</span>
                    </div>
                    <span className="text-sm text-primary">16,800 (52%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-sm">Communications</span>
                    </div>
                    <span className="text-sm text-secondary">12,300 (38%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                      <span className="text-sm">E-commerce</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3,890 (10%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Clinic Performance Comparison</CardTitle>
              <CardDescription>Key metrics across top performing clinics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="clinic" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#1E4D2B" />
                  <Bar dataKey="revenue" fill="#3FA796" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Clinic</th>
                      <th className="text-left p-2">Users</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Satisfaction</th>
                      <th className="text-left p-2">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((clinic, index) => (
                      <tr key={index} className="border-b hover:bg-accent/50">
                        <td className="p-2 font-medium">{clinic.clinic}</td>
                        <td className="p-2">{clinic.users}</td>
                        <td className="p-2 text-primary">${clinic.revenue.toLocaleString()}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <span>{clinic.satisfaction}</span>
                            <span className="text-xs text-muted-foreground">/5</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {clinic.efficiency}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Credits Usage</CardTitle>
              <CardDescription>Current usage and costs across all communication channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communicationData.map((comm) => (
                  <Card key={comm.type}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{comm.type}</h3>
                          <Badge variant="outline">
                            ${comm.cost}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{comm.usage} / {comm.limit}</span>
                          </div>
                          <div className="w-full bg-accent rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(comm.usage / comm.limit) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((comm.usage / comm.limit) * 100)}% of limit used
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Clinic distribution by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {regionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Revenue and growth by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region) => (
                    <div key={region.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{region.name}</span>
                        <span className="text-sm text-muted-foreground">{region.value} clinics</span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(region.value / 315) * 100}%`,
                            backgroundColor: region.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}