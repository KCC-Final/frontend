import GlobalLayout from '@/components/layout/global';

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default SearchPageLayout;
