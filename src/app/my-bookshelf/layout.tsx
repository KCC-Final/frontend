import GlobalLayout from '@/components/common/layout';

interface MybookshelfProps {
  children: React.ReactNode;
}

function Mybookshelf({ children }: MybookshelfProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default Mybookshelf;
