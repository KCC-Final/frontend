import MyFeedsList from '@/components/my-feeds/my-feeds-list';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 피드 | 그루',
  description: '내가 작성한 독후감과 좋아요한 독후감'
};

export default function MyFeedsPage() {
  return (
    <div>
      <MyFeedsList />
    </div>
  );
}
