import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Activity, 
  Server, 
  Database,
  Wifi,
  Cpu,
  HardDrive,
  Users,
  Globe,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const systemMetrics = [
  { label: 'Server Uptime', value: '99.8%', status: 'good', icon: Server },
  { label: 'Database Health', value: '98.2%', status: 'good', icon: Database },
  { label: 'API Response Time', value: '145ms', status: 'good', icon: Wifi },
  { label: 'Active Sessions', value: '1,247', status: 'normal', icon: Users }
];

const performanceData = [
  { time: '00:00', cpu: 45, memory: 62, requests: 1250 },
  { time: '04:00', cpu: 38, memory: 58, requests: 980 },
  { time: '08:00', cpu: 72, memory: 75, requests: 2840 },
  { time: '12:00', cpu: 85, memory: 82, requests: 3560 },
  { time: '16:00', cpu: 78, memory: 79, requests: 3120 },
  { time: '20:00', cpu: 65, memory: 71, requests: 2340 }
];

const systemServices = [
  { name: 'Authentication Service', status: 'running', uptime: '99.9%', response: '45ms' },
  { name: 'Database Service', status: 'running', uptime: '99.8%', response: '12ms' },
  { name: 'File Storage Service', status: 'running', uptime: '99.5%', response: '156ms' },
  { name: 'Email Service', status: 'running', uptime: '98.9%', response: '234ms' },
  { name: 'SMS Service', status: 'warning', uptime: '97.2%', response: '567ms' },
  { name: 'Backup Service', status: 'running', uptime: '99.1%', response: '89ms' }
];

export function SystemActivity() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-secondary text-secondary-foreground">Running</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHealthScore = () => {
    const runningServices = systemServices.filter(s => s.status === 'running').length;
    return Math.round((runningServices / systemServices.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">System Activity</h1>
          <p className="text-muted-foreground">
            Monitor system performance and infrastructure health
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <span className="text-2xl text-primary">{metric.value}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <p className="text-xs text-muted-foreground capitalize">{metric.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU & Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>CPU and memory utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#1E4D2B" strokeWidth={2} name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#3FA796" strokeWidth={2} name="Memory %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Request Volume */}
            <Card>
              <CardHeader>
                <CardTitle>API Request Volume</CardTitle>
                <CardDescription>Number of requests processed per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#3FA796" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Current Resource Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current System Status</CardTitle>
              <CardDescription>Real-time resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      <span className="text-sm">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground">8 cores, average load</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span className="text-sm">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground">52GB / 80GB available</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      <span className="text-sm">Disk Usage</span>
                    </div>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <p className="text-xs text-muted-foreground">420GB / 1TB used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Services Status</CardTitle>
              <CardDescription>Health and performance of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'running' ? 'bg-green-500' : 
                        service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="text-sm font-medium">{service.response}</p>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Overall System Health</CardTitle>
              <CardDescription>Aggregate health score based on all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">{getHealthScore()}%</div>
                <div className="space-y-2">
                  <Progress value={getHealthScore()} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {systemServices.filter(s => s.status === 'running').length} of {systemServices.length} services running normally
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bandwidth Usage</span>
                  <span className="text-primary">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>1.5 Gbps</span>
                  <span>2.0 Gbps limit</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection Pool</span>
                  <span className="text-primary">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>170 / 200 connections</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hit Rate</span>
                  <span className="text-primary">94.2%</span>
                </div>
                <Progress value={94} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Very Good</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Logs</CardTitle>
              <CardDescription>Latest system events and error logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">System Logs</h3>
                <p className="text-muted-foreground mb-4">
                  View detailed system logs and error traces
                </p>
                <Button variant="outline">
                  View Log Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}