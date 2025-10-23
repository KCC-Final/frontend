import GlobalLayout from '@/components/common/layout';

interface ReadingGroupPageLayoutProps {
  children: React.ReactNode;
}

function ReadingGroupPageLayout({ children }: ReadingGroupPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default ReadingGroupPageLayout;
