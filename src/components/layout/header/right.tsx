'use client';

import { Bell, Search, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import styles from '@/components/layout/header/header.module.scss';
import AlertModal from '@/components/layout/modal/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useModalState } from '@/hooks/useModal';
import useBoundStore from '@/stores';
import { devLogger } from '@/utils/dev-logger';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

function RightNavigation() {
  const router = useRouter();

  const { myInfo, setMyInfo } = useBoundStore(
    useShallow((state) => ({ myInfo: state.myInfo, setMyInfo: state.setMyInfo }))
  );

  const [isNotificationModalOpen, setNotificationModalOpen, openNotificationModal] = useModalState(false);

  const routePageHandler = (url: string) => () => {
    router.push(url);
  };

  const logoutHandler = async () => {
    try {
      await fetchGroo.auth.logout();
      setMyInfo(null);
      router.push('/login');
    } catch (error) {
      devLogger('로그아웃 실패');
      devLogger(error);
    }
  };

  return (
    <nav className={styles.function}>
      <Link href="/search">
        <div className={styles.search}>
          <div>검색어를 입력하세요.</div>
          <span>
            <Search size="20px" color="#333333" />
          </span>
        </div>
      </Link>
      <div className={styles.user}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={openNotificationModal}>
              <Bell size={26} color="#333333" />
            </button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.user_avatar_button}>
              {changeImageUrlFromBase64(myInfo?.profileImage) ? (
                <Image
                  src={changeImageUrlFromBase64(myInfo?.profileImage)}
                  alt="user profile image"
                  width={38}
                  height={38}
                />
              ) : (
                <User size={26} color="#333333" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[12rem]">
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-feeds')}>
              내 피드
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-library')}>
              내 책장
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-activities')}>
              내 활동
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-info')}>
              계정 설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[1.4rem] px-[1rem] py-[0.8rem]">
              <button onClick={logoutHandler}>로그아웃</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertModal
          open={isNotificationModalOpen}
          onOpenChange={setNotificationModalOpen}
          title={<div className={styles.profile_title}>현재 구현되지 않은 기능입니다.</div>}
          description={
            <div className={styles.profile_description}>사용자에게 온 알림 정보를 확인할 수 있습니다.</div>
          }
          button={<button className={styles.profile_confirm}>확인</button>}
        />
      </div>
    </nav>
  );
}

export default RightNavigation;
