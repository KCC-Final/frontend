import GlobalLayout from '@/components/common/layout';

interface MyInfoPageLayoutProps {
  children: React.ReactNode;
}

function MyInfoPageLayout({ children }: MyInfoPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyInfoPageLayout;
