import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
    </>
  );
}

export default SearchPageLayout;
