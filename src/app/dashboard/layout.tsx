import GlobalLayout from '@/components/layout/global';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default DashboardLayout;
