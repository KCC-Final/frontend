import Footer from '@/components/common/layout/footer';
import HeaderLayout from '@/components/common/layout/header';
import MainLayout from '@/components/common/layout/main';

interface GlobalLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

function GlobalLayout({ children, wide = false }: GlobalLayoutProps) {
  return (
    <>
      <HeaderLayout />
      <MainLayout wide={wide}>{children}</MainLayout>
      <Footer />
    </>
  );
}

export default GlobalLayout;
