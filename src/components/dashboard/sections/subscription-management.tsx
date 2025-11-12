import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const subscriptionData = [
  { month: 'Jan', revenue: 45000, newSubs: 12, churned: 3 },
  { month: 'Feb', revenue: 52000, newSubs: 15, churned: 2 },
  { month: 'Mar', revenue: 48000, newSubs: 14, churned: 5 },
  { month: 'Apr', revenue: 61000, newSubs: 18, churned: 3 },
  { month: 'May', revenue: 68000, newSubs: 22, churned: 4 },
  { month: 'Jun', revenue: 75000, newSubs: 25, churned: 2 }
];

const planMetrics = [
  {
    name: 'Trial',
    count: 23,
    revenue: 0,
    color: 'bg-yellow-500',
    conversionRate: 78,
    avgDuration: '14 days'
  },
  {
    name: 'Standard',
    count: 89,
    revenue: 26700,
    color: 'bg-blue-500',
    conversionRate: 92,
    avgDuration: '12 months'
  },
  {
    name: 'Premium',
    count: 56,
    revenue: 33600,
    color: 'bg-green-500',
    conversionRate: 95,
    avgDuration: '18 months'
  },
  {
    name: 'Enterprise',
    count: 32,
    revenue: 44800,
    color: 'bg-purple-500',
    conversionRate: 98,
    avgDuration: '24 months'
  }
];

const expiringSubscriptions = [
  { clinic: 'SmileCare Dental', plan: 'Premium', expiryDate: '2024-07-15', value: '$600/mo', status: 'renewal-sent' },
  { clinic: 'Dental Care Plus', plan: 'Standard', expiryDate: '2024-07-18', value: '$300/mo', status: 'expired' },
  { clinic: 'Elite Orthodontics', plan: 'Enterprise', expiryDate: '2024-07-22', value: '$1400/mo', status: 'pending' },
  { clinic: 'Family Dental Group', plan: 'Standard', expiryDate: '2024-07-25', value: '$300/mo', status: 'auto-renew' }
];

export function SubscriptionManagement() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'renewal-sent':
        return <Badge className="bg-secondary text-secondary-foreground">Renewal Sent</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'auto-renew':
        return <Badge className="bg-primary text-primary-foreground">Auto-Renew</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Subscription Management</h1>
          <p className="text-muted-foreground">
            Monitor subscription plans, renewals, and revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Payments
          </Button>
          <Button size="sm">
            <DollarSign className="w-4 h-4 mr-2" />
            Revenue Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">$75,000</span>
                <Badge className="bg-secondary text-secondary-foreground">+12%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">200</span>
                <Badge className="bg-secondary text-secondary-foreground">+15</Badge>
              </div>
              <p className="text-xs text-muted-foreground">new this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">2.3%</span>
                <Badge variant="outline">-0.5%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">improved from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Renewals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-primary">12</span>
                <Badge variant="outline">7 days</Badge>
              </div>
              <p className="text-xs text-muted-foreground">expiring soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="plans">Plan Performance</TabsTrigger>
          <TabsTrigger value="renewals">Renewals & Expirations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Subscription Trends</CardTitle>
                <CardDescription>Monthly performance and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#1E4D2B" strokeWidth={2} />
                    <Line type="monotone" dataKey="newSubs" stroke="#3FA796" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Churn Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Health</CardTitle>
                <CardDescription>New subscriptions vs churned accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newSubs" fill="#3FA796" />
                    <Bar dataKey="churned" fill="#d4183d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan Performance</CardTitle>
              <CardDescription>Detailed metrics for each subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {planMetrics.map((plan) => (
                  <Card key={plan.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${plan.color} rounded-full`}></div>
                          <h3 className="font-medium">{plan.name} Plan</h3>
                        </div>
                        <Badge variant="outline">{plan.count} clinics</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                          <span className="text-primary">${plan.revenue.toLocaleString()}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Retention Rate</span>
                            <span className="text-sm">{plan.conversionRate}%</span>
                          </div>
                          <Progress value={plan.conversionRate} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Duration</span>
                          <span className="text-sm">{plan.avgDuration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Renewals & Expirations</CardTitle>
              <CardDescription>Subscriptions requiring attention in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringSubscriptions.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{sub.expiryDate}</span>
                      </div>
                      <div>
                        <p className="font-medium">{sub.clinic}</p>
                        <p className="text-sm text-muted-foreground">{sub.plan} Plan • {sub.value}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(sub.status)}
                      <Button size="sm" variant="outline">
                        Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button variant="outline">View All Renewals</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}