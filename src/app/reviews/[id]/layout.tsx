import GlobalLayout from '@/components/common/layout';

interface ReviewsPageLayoutProps {
  children: React.ReactNode;
}

function ReviewsPageLayout({ children }: ReviewsPageLayoutProps) {
  return <GlobalLayout size="sm">{children}</GlobalLayout>;
}

export default ReviewsPageLayout;
