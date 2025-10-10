'use client';

import { Bell, CircleUserRound, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AlertModal from './modal/alert';

import { fetchGroo } from '@/apis';
import styles from '@/components/layout/header.module.scss';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useModalState } from '@/hooks/useModal';
import { devLogger } from '@/utils/dev-logger';

function HeaderLayout() {
  const router = useRouter();

  // TODO: 기능 구현이 되지 않은 버튼들 알림 모달 열림 상태
  const [isNicknameModalOpen, setNicknameModalOpen, openNicknameModal] = useModalState(false);
  const [isMyFeedsModalOpen, setMyFeedsModalOpen, openMyFeedsModal] = useModalState(false);
  const [isMyLibraryModalOpen, setMyLibraryModalOpen, openMyLibraryModal] = useModalState(false);
  const [isMyActivitiesModalOpen, setMyActivitiesModalOpen, openMyActivitiesModal] = useModalState(false);

  /**
   * 페이지 이동시켜주는 함수
   * @param url 이동할 위치
   */
  const routePage = (url: string) => () => {
    router.push(url);
  };

  /**
   * 로그아웃 실행 함수
   */
  const logoutHandler = async () => {
    try {
      await fetchGroo.auth.logout();
      router.push('/login');
    } catch (error) {
      devLogger('로그아웃 실패');
      devLogger(error);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.gnb}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            그루
          </Link>
          <ul className={styles.pages}>
            <li>
              <Link href="/">도서 추천</Link>
            </li>
            <li>
              <Link href="/feeds">피드</Link>
            </li>
            <li>
              <Link href="/my-library">내 서재</Link>
            </li>
            <li>
              <Link href="/groups">독서 모임</Link>
            </li>
          </ul>
        </nav>
        <nav className={styles.function}>
          <button className={styles.search} onClick={routePage('/search')}>
            <span>검색어를 입력하세요</span>
            <span>
              <Search size="20px" color="#333333" />
            </span>
          </button>
          <div className={styles.user}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Bell />
                </button>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <CircleUserRound />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[12rem]">
                <DropdownMenuItem className="text-[1.4rem] px-[1rem] py-[0.8rem]" onClick={openNicknameModal}>
                  닉네임
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[1.4rem] px-[1rem] py-[0.8rem]" onClick={openMyFeedsModal}>
                  내 피드
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[1.4rem] px-[1rem] py-[0.8rem]"
                  onClick={openMyLibraryModal}>
                  내 책장
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[1.4rem] px-[1rem] py-[0.8rem]"
                  onClick={openMyActivitiesModal}>
                  내 활동
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[1.4rem] px-[1rem] py-[0.8rem]">
                  <button onClick={logoutHandler}>로그아웃</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertModal
              open={isNicknameModalOpen}
              onOpenChange={setNicknameModalOpen}
              title={<div className={styles.profile_title}>현재 구현되지 않은 기능입니다.</div>}
              description={
                <div className={styles.profile_description}>마이페이지(/my-info)로 이동하는 버튼입니다.</div>
              }
              button={<button className={styles.profile_confirm}>확인</button>}
            />
            <AlertModal
              open={isMyFeedsModalOpen}
              onOpenChange={setMyFeedsModalOpen}
              title={<div className={styles.profile_title}>현재 구현되지 않은 기능입니다.</div>}
              description={
                <div className={styles.profile_description}>내 피드(/my-feeds)로 이동하는 버튼입니다.</div>
              }
              button={<button className={styles.profile_confirm}>확인</button>}
            />
            <AlertModal
              open={isMyLibraryModalOpen}
              onOpenChange={setMyLibraryModalOpen}
              title={<div className={styles.profile_title}>현재 구현되지 않은 기능입니다.</div>}
              description={
                <div className={styles.profile_description}>내 책장(/my-library)로 이동하는 버튼입니다.</div>
              }
              button={<button className={styles.profile_confirm}>확인</button>}
            />
            <AlertModal
              open={isMyActivitiesModalOpen}
              onOpenChange={setMyActivitiesModalOpen}
              title={<div className={styles.profile_title}>현재 구현되지 않은 기능입니다.</div>}
              description={
                <div className={styles.profile_description}>
                  내 활동(/my-activities)로 이동하는 버튼입니다.
                </div>
              }
              button={<button className={styles.profile_confirm}>확인</button>}
            />
          </div>
        </nav>
      </header>
    </section>
  );
}

export default HeaderLayout;
