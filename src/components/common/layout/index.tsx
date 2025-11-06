import Footer from '@/components/common/layout/footer';
import HeaderLayout from '@/components/common/layout/header';
import MainLayout from '@/components/common/layout/main';

interface GlobalLayoutProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function GlobalLayout({ children, size = 'md' }: GlobalLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout size={size}>{children}</MainLayout>
      <Footer />
    </>
  );
}

export default GlobalLayout;
