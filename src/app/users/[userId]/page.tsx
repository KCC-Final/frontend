import UserFeed from '@/components/user/feed';

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export const metadata: Metadata = {
  title: '내 피드 | 그루',
  description: '내가 작성한 독후감과 좋아요한 독후감'
};

async function UserFeedPage({ params }: PageProps) {
  const { userId } = await params;

  return <UserFeed userId={userId} />;
}

export default UserFeedPage;
