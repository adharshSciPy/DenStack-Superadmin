import { DashboardOverview } from './sections/dashboard-overview';
import { ClinicManagement } from './sections/clinic-management';
import { SubscriptionManagement } from './sections/subscription-management';
import { AnalyticsDashboard } from './sections/analytics-dashboard';
import { EcommerceMarketplace } from './sections/ecommerce-marketplace';
import { ProductCatalog } from './sections/product-catalog';
import { OrderManagement } from './sections/order-management';
import { VendorManagement } from './sections/vendor-management';
import { SalesAnalytics } from './sections/sales-analytics';
import { CommunicationsCenter } from './sections/communications-center';
import { AuditLogs } from './sections/audit-logs';
import { NotificationCenter } from './sections/notification-center';
import { SystemActivity } from './sections/system-activity';
import { GlobalSettings } from './sections/global-settings';

interface DashboardContentProps {
  activeSection: string;
}

export function DashboardContent({ activeSection }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'clinics':
        return <ClinicManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'marketplace':
        return <EcommerceMarketplace />;
      case 'products':
        return <ProductCatalog />;
      case 'orders':
        return <OrderManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'sales':
        return <SalesAnalytics />;
      case 'communications':
        return <CommunicationsCenter />;
      case 'audit':
        return <AuditLogs />;
      case 'notifications':
        return <NotificationCenter />;
      case 'activity':
        return <SystemActivity />;
      case 'settings':
        return <GlobalSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}