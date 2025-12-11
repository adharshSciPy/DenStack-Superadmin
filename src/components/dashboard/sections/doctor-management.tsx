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
    Hospital, Calendar, User, CircleDashed, UserPen
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useAppSelector } from "../../../redux/hooks.js"
import axios, { AxiosResponse } from 'axios';
import BASE_URLS from "../../../inventoryUrl.js";

export interface DoctorStats {
    activeDoctors: number;
    inactiveDoctors: number;
    pendingDoctors: number;
    independentDoctors: number;
    clinicDoctors: number;
    totalDoctors: number;
}



interface ClinicData {
    _id: string;
    name: string;
    email: string;
    phoneNumber: number;
    licenseNumber: string;
    uniqueId: string;

    role: string;          // "601"
    status: string;        // "Pending"
    approve: boolean;      // true
    isClinicOnboard: boolean;
    isIndependent: boolean;

    clinicId: string | null;

    password?: string;     // hashed, optional if not needed on FE

    createdAt: string;
    updatedAt: string;

    // extra fields might come later, so keep optional
    description?: string;
    specialization: string;
}

interface ClinicSubscriptionStats {
    plan: string,
    count: number
}



const subscriptionPlans = [
    { name: 'Trial', color: 'bg-yellow-500', count: 23 },
    { name: 'Standard', color: 'bg-blue-500', count: 89 },
    { name: 'Premium', color: 'bg-green-500', count: 56 },
    { name: 'Enterprise', color: 'bg-purple-500', count: 32 }
];

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months start at 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export function DoctorManagement() {
    const [doctorStats, setDoctorStats] = useState<DoctorStats>({
        activeDoctors: 0,
        inactiveDoctors: 0,
        pendingDoctors: 0,
        independentDoctors: 0,
        clinicDoctors: 0,
        totalDoctors: 0,
    });

    const [clinicsData, setClinicData] = useState<ClinicData[]>([]);

    const [selectedClinics, setSelectedClinics] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [clinicSubsStats, setClinicSubsStats] = useState<ClinicSubscriptionStats[]>([])
    const [statusFilter, setStatusFilter] = useState("All");



    const token = useAppSelector((state) => state.auth.token)
    const fetchClinic = async () => {
        try {
            const countRes = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/doctor/doctorStats`)
            const res = await axios.get(`${BASE_URLS.AUTH}api/v1/auth/doctor/doctors`);

            console.log("doc", res)
            setClinicData(res.data.doctors)
            setDoctorStats(countRes.data.stats)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchClinic()
    }, [token])

    const clinicStats = [
        {
            label: "Total Doctors",
            value: doctorStats.totalDoctors,
            icon: Building2,
            color: "text-primary"
        },
        {
            label: "Active Doctors",
            value: doctorStats.activeDoctors,
            icon: CheckCircle,
            color: "text-green-500"
        },
        {
            label: "Inactive Doctors",
            value: doctorStats.inactiveDoctors,
            icon: AlertTriangle,
            color: "text-red-500"
        },
        {
            label: "Independent Doctors",
            value: doctorStats.independentDoctors,
            icon: User,
            color: "text-primary-500"
        },
        {
            label: "Clinic Doctors",
            value: doctorStats.clinicDoctors,
            icon: UserPen,
            color: "text-green-500"
        },
        {
            label: "Pending Doctors",
            value: doctorStats.pendingDoctors,
            icon: CircleDashed,
            color: "text-yellow-500"
        }
    ];


    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-green-500 text-white hover:bg-green-600 border-none"
                    >
                        Active
                    </Badge>
                );

            case "inactive":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-red-500 text-white hover:bg-red-600 border-none"
                    >
                        Inactive
                    </Badge>
                );

            case "pending":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-500 text-white hover:bg-orange-600 border-none"
                    >
                        Pending
                    </Badge>
                );

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

    const filteredClinics = clinicsData.filter((clinic) => {
        const search = searchTerm.trim().toLowerCase();

        // Safe conversions
        const name = String(clinic?.name || "").toLowerCase();
        const email = String(clinic?.email || "").toLowerCase();

        const matchesSearch =
            search === "" ||
            name.includes(search) ||
            email.includes(search);

        const matchesStatus =
            statusFilter === "All"
                ? true
                : clinic.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });



    const getDoctorType = (clinic: ClinicData) => {
        if (clinic.isClinicOnboard) return "Clinic Doctor";
        if (clinic.isIndependent) return "Doctor";
        return "N/A"; // optional
    };






    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-primary">Doctor Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage all registered doctors
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Doctor
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
                    <TabsTrigger value="overview">Doctor Overview</TabsTrigger>
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
                                <Select onValueChange={(value: string) => setStatusFilter(value)}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Status</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>


                            </div>
                        </CardContent>
                    </Card>

                    {/* Clinics Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Doctors</CardTitle>
                            <CardDescription>Complete list of registered doctors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Doctor Details</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Specialization</TableHead>
                                        <TableHead>Doctor Type</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead>License Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClinics.map((clinic) => (
                                        <TableRow key={clinic._id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{clinic.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(clinic.createdAt)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {clinic.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(clinic.status)}</TableCell>


                                            <TableCell>
                                                <Badge className="bg-blue-500 text-white">
                                                    {clinic.specialization}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{getDoctorType(clinic)}</TableCell>


                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{clinic.phoneNumber}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{clinic.licenseNumber}</span>
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
                                {clinicSubsStats.map((plan) => (
                                    <Card key={plan.plan} className="text-center">
                                        <CardContent className="p-6">
                                            <div className={`w-4 h-4 ${plan.count} rounded-full mx-auto mb-2`}></div>
                                            <h3 className="font-medium">
                                                {(plan?.plan ?? "N/A")
                                                    .toString()
                                                    .charAt(0)
                                                    .toUpperCase() + (plan?.plan ?? "N/A").toString().slice(1)}
                                            </h3>

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
                            <CardDescription>Apply settings to multiple doctors at once</CardDescription>
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