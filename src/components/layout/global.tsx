import Footer from '@/components/layout/footer';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  );
}

export default GlobalLayout;
