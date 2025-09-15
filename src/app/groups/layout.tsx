import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

interface ReadingGroupPageLayoutProps {
  children: React.ReactNode;
}

function ReadingGroupPageLayout({ children }: ReadingGroupPageLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
    </>
  );
}

export default ReadingGroupPageLayout;
