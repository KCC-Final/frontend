'use client';

import { botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from '@/components/common/profile/image.module.scss';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

interface UserProfileImageProps {
  userId: string;
  profileImage?: string | null;
  size?: number;
}

function UserProfileImage({ userId, profileImage, size = 27 }: UserProfileImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const generateAvatar = (seed: string, imgSize: number): string => {
    const avatar = createAvatar(botttsNeutral, {
      seed: seed,
      size: imgSize,
      radius: 50
    });
    return avatar.toDataUri();
  };

  useEffect(() => {
    const userImage = changeImageUrlFromBase64(profileImage);
    if (userImage) {
      // 사용자가 등록한 이미지가 있으면 우선 사용
      setImageSrc(userImage);
    } else if (userId) {
      // 등록한 이미지가 없으면 userId로 아바타 생성
      const dataUri = generateAvatar(userId, size);
      setImageSrc(dataUri);
    } else {
      // 둘 다 없으면 null 처리
      setImageSrc(null);
    }
  }, [profileImage, userId, size]); // 의존성 배열

  return (
    <div className={styles.image} style={{ width: size, height: size }}>
      {imageSrc ? (
        <Image src={imageSrc} alt="프로필 이미지" width={size} height={size} />
      ) : (
        <User size={(size * 2) / 3} color="#333333" />
      )}
    </div>
  );
}

export default UserProfileImage;
