import GlobalLayout from '@/components/common/layout';

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return <GlobalLayout wide={true}>{children}</GlobalLayout>;
}

export default SearchPageLayout;
