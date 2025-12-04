import { useState, useEffect } from 'react';
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
  Filter,
  Building2,
  Users,
  ShieldX,
  MapPin,
  Hotel,
  Mail,
  Eye,
  Edit,
  MoreHorizontal,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hospital
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useAppSelector } from "../../../redux/hooks.js"
import axios from 'axios';
import BASE_URLS from "../../../inventoryUrl.js";

interface ClinicCount {
  totalClinics: number,
  activeClinics: number,
  expiredClinics: number
}

const clinicsData = [
  {
    id: 1,
    name: 'SmileCare Dental Center',
    location: 'New York, NY',
    status: 'Active',
    subscription: 'Premium',
    users: 24,
    lastActive: '2 hours ago',
    joinDate: '2024-01-15',
    revenue: 2450,
    phone: '+1 (555) 123-4567',
    email: 'admin@smilecare.com',
    expiryDate: '2024-12-15'
  },
  {
    id: 2,
    name: 'Dental Care Plus',
    location: 'Los Angeles, CA',
    status: 'Expired',
    subscription: 'Standard',
    users: 18,
    lastActive: '5 days ago',
    joinDate: '2023-08-22',
    revenue: 1890,
    phone: '+1 (555) 987-6543',
    email: 'contact@dentalcareplus.com',
    expiryDate: '2024-08-22'
  },
  {
    id: 3,
    name: 'Elite Orthodontics',
    location: 'Chicago, IL',
    status: 'Active',
    subscription: 'Enterprise',
    users: 42,
    lastActive: '1 hour ago',
    joinDate: '2023-11-03',
    revenue: 3680,
    phone: '+1 (555) 456-7890',
    email: 'info@eliteortho.com',
    expiryDate: '2024-11-03'
  },
  {
    id: 4,
    name: 'Family Dental Group',
    location: 'Houston, TX',
    status: 'Trial',
    subscription: 'Trial',
    users: 8,
    lastActive: '30 minutes ago',
    joinDate: '2024-06-01',
    revenue: 0,
    phone: '+1 (555) 321-0987',
    email: 'hello@familydental.com',
    expiryDate: '2024-07-01'
  }
];

const subscriptionPlans = [
  { name: 'Trial', color: 'bg-yellow-500', count: 23 },
  { name: 'Standard', color: 'bg-blue-500', count: 89 },
  { name: 'Premium', color: 'bg-green-500', count: 56 },
  { name: 'Enterprise', color: 'bg-purple-500', count: 32 }
];

export function ClinicManagement() {
  const [clinicCounts, setClinicCounts] = useState<ClinicCount>({
    totalClinics: 0,
    activeClinics: 0,
    expiredClinics: 0
  });

  const [selectedClinics, setSelectedClinics] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const token = useAppSelector((state) => state.auth.token)
  const fetchClinic = async () => {
    try {
      const countRes = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/clinic/clicnicCount`)
      console.log("countClinic", countRes)
      console.log("data", clinicCounts)


      setClinicCounts(countRes.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchClinic()
  }, [token])

  const clinicStats = [
    {
      label: "Total Clinics",
      value: clinicCounts.totalClinics,
      icon: Building2,
      color: "text-primary"
    },
    {
      label: "Active Clinics",
      value: clinicCounts.activeClinics,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      label: "Expired Clinics",
      value: clinicCounts.expiredClinics,
      icon: AlertTriangle,
      color: "text-red-500"
    }
  ];


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-secondary text-secondary-foreground">Active</Badge>;
      case 'Expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'Trial':
        return <Badge variant="outline">Trial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Trial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Clinic Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all registered clinics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Clinic
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clinicStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>

            <CardContent>
              <div className="space-y-1">
                <span className="text-2xl text-primary">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Clinic Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
          <TabsTrigger value="settings">Bulk Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clinics by name, location, or email..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clinics Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Clinics</CardTitle>
              <CardDescription>Complete list of registered healthcare facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicsData.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{clinic.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {clinic.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {clinic.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(clinic.status)}
                          {getStatusBadge(clinic.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{clinic.subscription}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {clinic.users}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary">${clinic.revenue.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{clinic.lastActive}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Clinic
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Users
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Suspend Clinic
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Current subscription plan breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.name} className="text-center">
                    <CardContent className="p-6">
                      <div className={`w-4 h-4 ${plan.color} rounded-full mx-auto mb-2`}></div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-2xl text-primary mt-2">{plan.count}</p>
                      <p className="text-sm text-muted-foreground">clinics</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>Apply settings to multiple clinics at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Global Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable E-commerce</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Communication Credits</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics Dashboard</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Bulk Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Send Renewal Notices
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Update Terms of Service
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Generate Usage Reports
                    </Button>
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