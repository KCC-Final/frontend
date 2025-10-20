import GlobalLayout from '@/components/layout/global';

interface MyInfoPageLayoutProps {
  children: React.ReactNode;
}

function MyInfoPageLayout({ children }: MyInfoPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyInfoPageLayout;
