import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Progress } from '../../ui/progress';
import { 
  MessageSquare, 
  Send, 
  Phone,
  Mail,
  Bell,
  Users,
  CreditCard,
  Plus,
  Settings
} from 'lucide-react';

const communicationStats = [
  { label: 'SMS Credits', used: 45600, total: 50000, cost: 912, icon: MessageSquare },
  { label: 'Email Credits', used: 23400, total: 30000, cost: 234, icon: Mail },
  { label: 'Voice Minutes', used: 7800, total: 10000, cost: 780, icon: Phone },
  { label: 'Push Notifications', used: 18900, total: 25000, cost: 0, icon: Bell }
];

const recentMessages = [
  {
    id: 1,
    type: 'broadcast',
    title: 'System Maintenance Notice',
    content: 'Scheduled maintenance on June 25th from 2-4 AM EST...',
    recipients: 176,
    status: 'sent',
    date: '2024-06-20',
    channel: 'email'
  },
  {
    id: 2,
    type: 'targeted',
    title: 'Subscription Renewal Reminder',
    content: 'Your subscription expires in 7 days. Renew now to avoid...',
    recipients: 8,
    status: 'sent',
    date: '2024-06-19',
    channel: 'sms'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'New Product Launch',
    content: 'Introducing the latest digital X-ray technology...',
    recipients: 145,
    status: 'scheduled',
    date: '2024-06-25',
    channel: 'email'
  }
];

const templates = [
  { name: 'Welcome Message', category: 'Onboarding', usage: 234 },
  { name: 'Payment Reminder', category: 'Billing', usage: 189 },
  { name: 'System Alert', category: 'Technical', usage: 156 },
  { name: 'Feature Update', category: 'Product', usage: 123 },
  { name: 'Maintenance Notice', category: 'Technical', usage: 98 }
];

export function CommunicationsCenter() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-secondary text-secondary-foreground">Sent</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'sms':
        return <MessageSquare className="h-3 w-3" />;
      case 'push':
        return <Bell className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Communications Center</h1>
          <p className="text-muted-foreground">
            Manage broadcasts, announcements, and communication credits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Communication Credits Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communicationStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{stat.used.toLocaleString()}</span>
                  <span className="text-muted-foreground">/ {stat.total.toLocaleString()}</span>
                </div>
                <Progress value={(stat.used / stat.total) * 100} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {Math.round((stat.used / stat.total) * 100)}% used
                  </span>
                  {stat.cost > 0 && (
                    <span className="text-primary">${stat.cost}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="broadcast" className="space-y-6">
        <TabsList>
          <TabsTrigger value="broadcast">Broadcast Center</TabsTrigger>
          <TabsTrigger value="messages">Message History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="credits">Credit Management</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Broadcast Message</CardTitle>
              <CardDescription>Send announcements to all clinics or targeted groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">General Announcement</SelectItem>
                        <SelectItem value="maintenance">Maintenance Notice</SelectItem>
                        <SelectItem value="feature">Feature Update</SelectItem>
                        <SelectItem value="billing">Billing Notice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipients</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clinics (176)</SelectItem>
                        <SelectItem value="active">Active Clinics (145)</SelectItem>
                        <SelectItem value="expired">Expired Subscriptions (8)</SelectItem>
                        <SelectItem value="trial">Trial Accounts (23)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Channel</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4 mr-2" />
                        Push
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Schedule</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Send timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Now</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Estimated Cost</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Recipients:</span>
                        <span>176 clinics</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email cost:</span>
                        <span>$1.76</span>
                      </div>
                      <div className="flex justify-between font-medium text-primary">
                        <span>Total:</span>
                        <span>$1.76</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Enter message subject..." />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message Content</label>
                  <Textarea 
                    placeholder="Type your message here..." 
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">Save as Draft</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
              <CardDescription>Recent broadcasts and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(message.channel)}
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{message.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{message.date}</span>
                          <span>{message.recipients} recipients</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(message.status)}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-built templates for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Used:</span>
                          <span className="text-primary">{template.usage} times</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Edit
                          </Button>
                          <Button size="sm" className="flex-1">
                            Use
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Packages</CardTitle>
                <CardDescription>Purchase additional communication credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { type: 'SMS', credits: 10000, price: 200 },
                    { type: 'Email', credits: 50000, price: 150 },
                    { type: 'Voice', credits: 5000, price: 500 }
                  ].map((package_) => (
                    <div key={package_.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{package_.type} Credits</h4>
                        <p className="text-sm text-muted-foreground">{package_.credits.toLocaleString()} credits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-medium">${package_.price}</p>
                        <Button size="sm" variant="outline">Purchase</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>Communication patterns and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Usage Hour</span>
                    <span className="text-primary">2:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Most Used Channel</span>
                    <span className="text-primary">Email (65%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Open Rate</span>
                    <span className="text-primary">78.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Spend</span>
                    <span className="text-primary">$1,926</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}