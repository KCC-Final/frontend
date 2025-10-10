import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

interface FeedPageLayoutProps {
  children: React.ReactNode;
}

function FeedPageLayout({ children }: FeedPageLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
    </>
  );
}

export default FeedPageLayout;
