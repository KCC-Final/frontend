import GlobalLayout from '@/components/layout/global';

interface ReadingGroupPageLayoutProps {
  children: React.ReactNode;
}

function ReadingGroupPageLayout({ children }: ReadingGroupPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default ReadingGroupPageLayout;
