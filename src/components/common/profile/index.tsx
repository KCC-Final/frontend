import { User } from 'lucide-react';
import Image from 'next/image';
import { useShallow } from 'zustand/shallow';

import BasicButton from '@/components/common/button/basic';
import styles from '@/components/common/profile/profile.module.scss';
import useBoundStore from '@/stores';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

function UserProfileCard() {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo! })));

  return (
    <section className={styles.container}>
      <div className={styles.image}>
        {changeImageUrlFromBase64(myInfo?.profileImage) ? (
          <Image
            src={changeImageUrlFromBase64(myInfo.profileImage)}
            alt="user profile image"
            width={180}
            height={180}
          />
        ) : (
          <User size={85} color="#333333" />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.name}>
            <span className={styles.nickname}>{myInfo.nickname}</span>
            <span className={styles.userId}>@{myInfo.userId}</span>
          </div>
          <BasicButton name="팔로우" />
        </div>
        <div className={styles.follow}>
          <button>
            <div className={styles.count}>3</div>
            <div className={styles.label}>팔로잉</div>
          </button>
          <button>
            <div className={styles.count}>56</div>
            <div className={styles.label}>팔로워</div>
          </button>
        </div>
        <div className={styles.introduction}>{myInfo.introduction || '소개글이 없습니다.'}</div>
      </div>
    </section>
  );
}

export default UserProfileCard;
