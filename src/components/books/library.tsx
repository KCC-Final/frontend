'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { fetchLibrary } from '@/apis';
import styles from '@/components/books/library.module.scss';
import { DtlRegion, dtlRegionList, LibraryWithAvailability, Region, regionList } from '@/types';
import { devLogger } from '@/utils/dev-logger';

interface LibraryInformationProps {
  isbn: string;
  ref?: React.Ref<HTMLElement>;
  id?: string;
}

const LibraryInformation = ({ isbn, ref, id }: LibraryInformationProps) => {
  // 첫 렌더링 판별용 ref
  const isInitialMount = useRef(true);

  // 선택된 지역과 세부 지역 상태
  const [region, setRegion] = useState<Region>({ code: '11', name: '서울특별시' });
  const [dtlRegion, setDtlRegion] = useState<DtlRegion>({
    code: '11010',
    regionName: '서울특별시',
    dtlRegionName: '종로구'
  });

  // 선택할 수 있는 세부 지역 옵션
  const [dtlRegionOptions, setDtlRegionOptions] = useState<DtlRegion[]>([]);

  // 요청 결과 (도서관 정보, 로딩 상태, 에러 상태)
  const [libraries, setLibraries] = useState<LibraryWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // "대출 가능만 보기" 체크 상태
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // 아코디언 상태
  const [openLibraryCode, setOpenLibraryCode] = useState<string | null>(null);

  // 더보기 팝업 상태
  const [popup, setPopup] = useState<{ title: string; content: string } | null>(null);

  /** 아코디언 토글 핸들러 */
  const toggleAccordion = (libCode: string) => {
    setOpenLibraryCode((prevCode) => (prevCode === libCode ? null : libCode));
  };

  /** 지역 선택 핸들러 */
  const regionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionCode = event.target.value;
    setRegion(regionList.find((r) => r.code === selectedRegionCode) || region);
  };

  /** 세부 지역 선택 핸들러 */
  const dtlRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDtlRegionCode = event.target.value;
    setDtlRegion(dtlRegionOptions.find((d) => d.code === selectedDtlRegionCode) || dtlRegion);
  };

  /** 도서관 정보 및 대출 가능 여부 불러오기 */
  const getLibraryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const libResponse = await fetchLibrary.getLibrariesByISBN(isbn, region.code, dtlRegion.code);
      const fetchedLibraries = libResponse.response.libs?.map((item) => item.lib) || [];

      if (fetchedLibraries.length > 0) {
        const availabilityPromises = fetchedLibraries.map((lib) =>
          fetchLibrary.checkBookAvailability(lib.libCode, isbn)
        );
        const availabilityResponses = await Promise.all(availabilityPromises);
        const librariesWithAvailability = fetchedLibraries.map((lib, index) => ({
          ...lib,
          availability: availabilityResponses[index].response.result
        }));
        setLibraries(librariesWithAvailability);
      } else {
        setLibraries([]);
      }
    } catch (error) {
      setLibraries([]);
      setError('도서관 정보를 불러오는 데 실패했습니다.');
      devLogger(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 긴 텍스트를 자르고 더보기 버튼을 추가하는 헬퍼 함수
  const renderTruncatableText = (text: string, title: string, maxLength: number = 30) => {
    if (!text || text.length <= maxLength) {
      return <span>{text || '-'}</span>;
    }

    return (
      <span className={styles.truncatable_wrapper}>
        <span className={styles.truncated_text}>{`${text.substring(0, maxLength)}...`}</span>
        <button className={styles.read_more_button} onClick={() => setPopup({ title, content: text })}>
          더보기
        </button>
      </span>
    );
  };

  useEffect(() => {
    if (isInitialMount.current) {
      const filteredDtlRegions = dtlRegionList.filter((dtl) => dtl.regionName === region.name);
      setDtlRegionOptions(filteredDtlRegions);
      isInitialMount.current = false;
    } else {
      const filteredDtlRegions = dtlRegionList.filter((dtl) => dtl.regionName === region.name);
      setDtlRegionOptions(filteredDtlRegions);
      setDtlRegion(filteredDtlRegions[0]);
    }
  }, [region.name]);

  useEffect(() => {
    if (dtlRegion.code) getLibraryData();
  }, [dtlRegion.code]);

  // 대출 가능만 보기 필터링된 목록
  const filteredLibraries = showAvailableOnly
    ? libraries.filter((lib) => lib.availability?.loanAvailable === 'Y')
    : libraries;

  return (
    <section className={styles.book_library} ref={ref} id={id}>
      <h2 className={styles.title}>도서 소장 도서관 정보</h2>
      <div className={styles.region_selector}>
        <select value={region.code} onChange={regionHandler}>
          {regionList.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
        <select value={dtlRegion.code} onChange={dtlRegionHandler} disabled={dtlRegionOptions.length === 0}>
          {dtlRegionOptions.map((d) => (
            <option key={d.code} value={d.code}>
              {d.dtlRegionName}
            </option>
          ))}
        </select>

        {/* 대출 가능만 보기 체크박스 */}
        <label className={styles.checkbox_label}>
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          대출 가능만 보기
        </label>
      </div>
      {isLoading ? (
        <div className={styles.message_box}>
          <p>도서관 정보를 불러오는 중입니다...</p>
        </div>
      ) : error ? (
        <div className={styles.message_box}>
          <p>{error}</p>
        </div>
      ) : filteredLibraries.length > 0 ? (
        <ul className={styles.library_list}>
          {filteredLibraries.map((lib) => (
            <li key={lib.libCode} className={styles.library_card}>
              <div className={styles.accordion_header} onClick={() => toggleAccordion(lib.libCode)}>
                <div className={styles.header_main_content}>
                  <span className={styles.name}>{lib.libName}</span>
                  <div
                    className={`${styles.availability_status} ${
                      lib.availability?.loanAvailable === 'Y' ? styles.available : styles.unavailable
                    }`}>
                    <span>{lib.availability?.loanAvailable === 'Y' ? '🟢 대출 가능' : '🔴 대출 불가'}</span>
                  </div>
                </div>
                <div className={styles.accordion_toggle_button}>
                  <ChevronDown
                    size={24}
                    className={`${styles.chevron_icon} ${
                      openLibraryCode === lib.libCode ? styles.is_open : ''
                    }`}
                  />
                </div>
              </div>
              {openLibraryCode === lib.libCode && (
                <div className={styles.accordion_content}>
                  <div className={styles.info_grid}>
                    <div className={styles.info_item}>
                      <span>주소</span>
                      <span>{lib.address}</span>
                    </div>
                    <div className={styles.info_item}>
                      <span>연락처</span>
                      <span>{lib.tel}</span>
                    </div>
                    <div className={styles.info_item}>
                      <span>운영시간</span>
                      {renderTruncatableText(lib.operatingTime, '운영시간')}
                    </div>
                    <div className={styles.info_item}>
                      <span>휴관일</span>
                      {renderTruncatableText(lib.closed, '휴관일')}
                    </div>
                    {lib.homepage && (
                      <div className={styles.info_item}>
                        <span>홈페이지</span>
                        <span>
                          <a
                            href={lib.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.homepage_link}>
                            바로가기
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.message_box}>
          <p>해당 지역에 대출 가능한 도서관이 없습니다.</p>
        </div>
      )}
      {popup && (
        <div className={styles.text_popup_backdrop} onClick={() => setPopup(null)}>
          <div className={styles.text_popup_content} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popup_header}>
              <h4>{popup.title}</h4>
              <button onClick={() => setPopup(null)} className={styles.popup_close_button}>
                &times;
              </button>
            </div>
            <p className={styles.popup_body}>{popup.content}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default LibraryInformation;
