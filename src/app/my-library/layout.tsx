import GlobalLayout from '@/components/layout/global';

interface MyLibraryPageLayoutProps {
  children: React.ReactNode;
}

function MyLibraryPageLayout({ children }: MyLibraryPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyLibraryPageLayout;
