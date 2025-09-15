import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

interface MyLibraryPageLayoutProps {
  children: React.ReactNode;
}

function MyLibraryPageLayout({ children }: MyLibraryPageLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
    </>
  );
}

export default MyLibraryPageLayout;
