import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Building2,
  Users,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  MessageSquare,
  Activity,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAppSelector } from '../../../redux/hooks.js';
import axios from 'axios';
import BASE_URLS from '../../../inventoryUrl';

interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
}

interface ClinicCount {
  totalClinics: number;
  expiredClinics: number;
  activeClinics: number;
}

interface ClinicPieData {
  name: string;
  value: number;
  color: string;
}

interface Stats {
  totalClinics: number;
  totalUsers: number;
  subscriptionRevenue: number;
  ecommerceRevenue: number;
}


const clinicData = [
  { name: 'Total', value: 23, color: '#FACC15' },
  { name: 'Active', value: 145, color: '#10B981' },
  { name: 'Expired', value: 8, color: '#EF4444' }
];

export function DashboardOverview() {
  const token = useAppSelector((state) => state.auth.token)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [clinicCount, setClinicCount] = useState<ClinicCount>({
    totalClinics: 0,
    expiredClinics: 0,
    activeClinics: 0
  });
  const [stats, setStats] = useState<Stats>({
    totalClinics: 0,
    totalUsers: 0,
    subscriptionRevenue: 0,
    ecommerceRevenue: 0
  })

  const [clinicPieData, setClinicPieData] = useState<ClinicPieData[]>([]);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/super-admin/getMonthlySummary`);
        const countRes = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/clinic/clicnicCount`);
        const statsRes = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/super-admin/dashStats`)

        const transformedData: RevenueData[] = res.data.data.map((item: any) => ({
          month: item.month,
          revenue: item.totalRevenue,
          subscriptions: item.totalSubscriptions,
        }));

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const sortedData = transformedData.sort(
          (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );

        const counts = countRes.data.data;

        setRevenueData(sortedData);
        setClinicCount(counts);
        setStats(statsRes.data)
        setClinicPieData([
          {
            name: 'Active',
            value: counts.activeClinics,
            color: '#10B981'
          },
          {
            name: 'Expired',
            value: counts.expiredClinics,
            color: '#EF4444'
          },
          {
            name: 'Total',
            value: counts.totalClinics,
            color: '#FACC15'
          }
        ]);

        console.log("stats", statsRes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchdata()
  }, [token])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-medium"
            style={{
              background: 'var(--primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            DenStack Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Monitor and manage your multi-clinic dental network
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="glass backdrop-blur-sm border-0 w-full sm:w-auto">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            size="sm"
            className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
          >
            <Activity className="w-4 h-4 mr-2" />
            System Health
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="glass rounded-xl p-4 sm:p-6 backdrop-blur-sm border-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Clinics</h3>
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalClinics}</span>
              <Badge className="gradient-secondary text-white border-0 px-2 py-1 text-xs">+12</Badge>
            </div>
            <p className="text-xs text-muted-foreground">145 active, 8 expired</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 sm:p-6 backdrop-blur-sm border-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Monthly Revenue</h3>
            <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">₹{stats.subscriptionRevenue}</span>
              <Badge className="gradient-secondary text-white border-0 px-2 py-1 text-xs">+12%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 sm:p-6 backdrop-blur-sm border-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Users</h3>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalUsers}</span>
              <Badge className="gradient-secondary text-white border-0 px-2 py-1 text-xs">+284</Badge>
            </div>
            <p className="text-xs text-muted-foreground">across all clinics</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 sm:p-6 backdrop-blur-sm border-0">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">E-commerce Sales</h3>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">₹{stats.ecommerceRevenue}</span>
              <Badge className="gradient-secondary text-white border-0 px-2 py-1 text-xs">+18%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">this month</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend */}
        <div className="glass rounded-xl backdrop-blur-sm border-0">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Revenue & Subscriptions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Monthly revenue and new subscriptions</p>
          </div>
          <div className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={2} />
                <Line type="monotone" dataKey="subscriptions" stroke="#764ba2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinic Status */}
        <div className="glass rounded-xl backdrop-blur-sm border-0">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Clinic Status Distribution</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Current status of all registered clinics</p>
          </div>
          <div className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={clinicPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clinicPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
              {clinicPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Alerts */}
        <div className="lg:col-span-2 glass rounded-xl backdrop-blur-sm border-0">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">System Alerts & Activities</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Recent important events requiring attention</p>
          </div>
          <div className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)' }}>
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Payment Failed</p>
                <p className="text-xs text-muted-foreground">Dental Care Plus subscription renewal failed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">New Clinic Registered</p>
                <p className="text-xs text-muted-foreground">SmileCare Dental just completed setup</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)' }}>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Revenue Milestone</p>
                <p className="text-xs text-muted-foreground">Monthly revenue exceeded $75K target</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl backdrop-blur-sm border-0">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Quick Actions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Common administrative tasks</p>
          </div>
          <div className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
            <Button className="w-full justify-start glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200 text-sm" variant="outline">
              <Building2 className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Add New Clinic</span>
            </Button>
            <Button className="w-full justify-start glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200 text-sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Broadcast Message</span>
            </Button>
            <Button className="w-full justify-start glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200 text-sm" variant="outline">
              <Users className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Manage User Roles</span>
            </Button>
            <Button className="w-full justify-start glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200 text-sm" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Generate Reports</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}