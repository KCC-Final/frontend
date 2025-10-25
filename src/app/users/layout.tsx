import GlobalLayout from '@/components/common/layout';

interface UserFeedLayoutProps {
  children: React.ReactNode;
}

function UserFeedLayout({ children }: UserFeedLayoutProps) {
  return <GlobalLayout>{children}</GlobalLayout>;
}

export default UserFeedLayout;
