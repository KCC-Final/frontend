import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/common/button/basic';
import styles from '@/components/common/button/button.module.scss';
import useBoundStore from '@/stores';
import { devLogger } from '@/utils/dev-logger';

interface FollowButtonProps {
  targetUserId: string;
}

function FollowButton({ targetUserId }: FollowButtonProps) {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo! })));
  const [isFollowing, setIsFollowing] = useState(false);

  const followHandler = async () => {
    try {
      await fetchGroo.follow.createFollow(targetUserId);
      setIsFollowing(true);
    } catch (error) {
      alert('팔로우에 실패했습니다.');
      devLogger(error, true);
      setIsFollowing(false);
    }
  };

  const unfollowHandler = async () => {
    try {
      await fetchGroo.follow.deleteFollow(targetUserId);
      setIsFollowing(false);
    } catch (error) {
      alert('언팔로우에 실패했습니다.');
      devLogger(error, true);
      setIsFollowing(true);
    }
  };

  useEffect(() => {
    const checkFollowingStatus = async () => {
      // 자기 자신인 경우 API 호출하지 않음
      if (myInfo.userId === targetUserId || !targetUserId) {
        setIsFollowing(false);
        return;
      }

      try {
        const response = await fetchGroo.follow.getFollowInfo(targetUserId);
        setIsFollowing(response.data !== null);
      } catch (error) {
        devLogger(error, true);
        setIsFollowing(false);
      }
    };

    checkFollowingStatus();
  }, [targetUserId, myInfo.userId]); // 의존성 배열에 myInfo.userId 추가

  // 자기 자신이면 아예 렌더링하지 않음
  if (myInfo.userId === targetUserId) return null;

  return (
    <>
      {isFollowing ? (
        <BasicButton name="언팔로우" handler={unfollowHandler} classname={styles.follow} />
      ) : (
        <BasicButton name="팔로우" handler={followHandler} classname={styles.follow} />
      )}
    </>
  );
}

export default FollowButton;
