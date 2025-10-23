import GlobalLayout from '@/components/common/layout';

interface MyFeedPageLayoutProps {
  children: React.ReactNode;
}

function MyFeedPageLayout({ children }: MyFeedPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyFeedPageLayout;
