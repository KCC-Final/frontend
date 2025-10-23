import GlobalLayout from '@/components/common/layout';

interface BookDataPageLayoutProps {
  children: React.ReactNode;
}

function BookDataPageLayout({ children }: BookDataPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default BookDataPageLayout;
