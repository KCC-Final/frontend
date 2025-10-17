import GlobalLayout from '@/components/layout/global';

interface BookDataPageLayoutProps {
  children: React.ReactNode;
}

function BookDataPageLayout({ children }: BookDataPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default BookDataPageLayout;
