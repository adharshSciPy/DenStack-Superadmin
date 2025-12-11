import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  ShoppingCart,
  Package,
  TrendingUp,
  FileText,
  Bell,
  Activity,
  Store,
  BriefcaseMedical
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'clinics',
    label: 'Clinic Management',
    icon: Building2,
    badge: null
  },
   {
    id: 'doctors',
    label: 'Doctor Management',
    icon: BriefcaseMedical,
    badge: null
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
    badge: '3'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: null
  }
];

const ecommerceItems = [
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    badge: null
  },
  {
    id: 'products',
    label: 'Product Catalog',
    icon: Package,
    badge: null
  },
  {
    id: 'orders',
    label: 'Order Management',
    icon: ShoppingCart,
    badge: '12'
  },
  {
    id: 'vendors',
    label: 'Vendor Management',
    icon: Users,
    badge: null
  },
  {
    id: 'sales',
    label: 'Sales Analytics',
    icon: TrendingUp,
    badge: null
  }
];

const systemItems = [
  {
    id: 'communications',
    label: 'Communications',
    icon: MessageSquare,
    badge: '5'
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: FileText,
    badge: null
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badge: '8'
  },
  {
    id: 'activity',
    label: 'System Activity',
    icon: Activity,
    badge: null
  },
  {
    id: 'settings',
    label: 'Global Settings',
    icon: Settings,
    badge: null
  }
];

export function Sidebar({ activeSection, onSectionChange, collapsed, isMobile }: SidebarProps) {
  const renderMenuItem = (item: any) => (
    <Button
      key={item.id}
      variant={activeSection === item.id ? 'default' : 'ghost'}
      className={`w-full justify-start gap-3 mb-1 transition-all duration-200 ${
        activeSection === item.id 
          ? 'gradient-primary text-white shadow-md border-0' 
          : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent hover:backdrop-blur-sm'
      } ${collapsed ? 'px-2' : 'px-4'}`}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge 
              variant="secondary" 
              className="glass text-xs px-2 py-1 backdrop-blur-sm"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  );

  return (
    <div 
      className={`sidebar-glass transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-lg"
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 
                className="font-medium"
                style={{ 
                  background: 'var(--primary)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                DenStack
              </h2>
              <p className="text-xs text-muted-foreground">Superadmin Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          {!collapsed && (
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3 px-2">
              Main
            </h3>
          )}
          <div className="space-y-1">
            {sidebarItems.map(renderMenuItem)}
          </div>
        </div>

        <Separator />

        {/* E-commerce */}
        <div>
          {!collapsed && (
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3 px-2">
              E-commerce
            </h3>
          )}
          <div className="space-y-1">
            {ecommerceItems.map(renderMenuItem)}
          </div>
        </div>

        <Separator />

        {/* System */}
        <div>
          {!collapsed && (
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3 px-2">
              System
            </h3>
          )}
          <div className="space-y-1">
            {systemItems.map(renderMenuItem)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-xs text-accent-foreground">SA</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@denstack.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}