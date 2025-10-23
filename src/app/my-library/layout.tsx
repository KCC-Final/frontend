import GlobalLayout from '@/components/common/layout';

interface MyLibraryPageLayoutProps {
  children: React.ReactNode;
}

function MyLibraryPageLayout({ children }: MyLibraryPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default MyLibraryPageLayout;
