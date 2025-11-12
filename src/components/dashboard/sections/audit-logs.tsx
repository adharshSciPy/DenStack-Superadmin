import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { 
  Search, 
  Filter, 
  Download,
  FileText,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

const auditLogs = [
  {
    id: 'AUD-001',
    timestamp: '2024-06-23 14:32:15',
    user: 'super.admin@mediadmin.com',
    action: 'Clinic Created',
    resource: 'Family Dental Group',
    ip: '192.168.1.100',
    status: 'success',
    details: 'New clinic registration completed'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-06-23 13:45:22',
    user: 'admin@smilecare.com', 
    action: 'Subscription Updated',
    resource: 'SmileCare Dental Center',
    ip: '10.0.0.45',
    status: 'success',
    details: 'Upgraded to Premium plan'
  },
  {
    id: 'AUD-003',
    timestamp: '2024-06-23 12:18:33',
    user: 'system@mediadmin.com',
    action: 'Payment Failed',
    resource: 'Dental Care Plus',
    ip: 'system',
    status: 'failed',
    details: 'Credit card declined - insufficient funds'
  },
  {
    id: 'AUD-004',
    timestamp: '2024-06-23 11:22:44',
    user: 'super.admin@mediadmin.com',
    action: 'User Role Changed',
    resource: 'john.doe@eliteortho.com',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Role changed from User to Admin'
  }
];

export function AuditLogs() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-secondary text-secondary-foreground">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Created') || action.includes('Added')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (action.includes('Failed') || action.includes('Deleted')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (action.includes('Updated') || action.includes('Changed')) {
      return <Activity className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Audit Logs</h1>
          <p className="text-muted-foreground">
            System activity tracking and security monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Security Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">12,487</span>
              <p className="text-xs text-muted-foreground">last 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Failed Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">23</span>
              <p className="text-xs text-muted-foreground">requiring attention</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">1,247</span>
              <p className="text-xs text-muted-foreground">unique users today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <span className="text-2xl text-primary">5</span>
              <p className="text-xs text-muted-foreground">this week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs by user, action, or resource..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login/Logout</SelectItem>
                <SelectItem value="crud">Create/Update/Delete</SelectItem>
                <SelectItem value="payment">Payment Events</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Chronological record of all system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div>{log.timestamp.split(' ')[0]}</div>
                      <div className="text-muted-foreground">{log.timestamp.split(' ')[1]}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{log.resource}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{log.ip}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{log.details}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}