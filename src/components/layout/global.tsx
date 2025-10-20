import Footer from '@/components/layout/footer';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

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
