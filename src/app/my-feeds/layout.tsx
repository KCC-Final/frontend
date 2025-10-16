import GlobalLayout from '@/components/layout/global';

interface MyFeedPageLayoutProps {
  children: React.ReactNode;
}

function MyFeedPageLayout({ children }: MyFeedPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyFeedPageLayout;
