import GlobalLayout from '@/components/common/layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default DashboardLayout;
