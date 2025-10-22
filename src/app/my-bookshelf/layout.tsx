import GlobalLayout from '@/components/layout/global';

interface MybookshelfProps {
  children: React.ReactNode;
}

function Mybookshelf({ children }: MybookshelfProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default Mybookshelf;
