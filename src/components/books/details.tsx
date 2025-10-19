import styles from '@/components/books/details.module.scss';
import { AladinBookDetailsItem } from '@/types';

interface BookDetailsProps {
  bookInfo: AladinBookDetailsItem;
  ref?: React.Ref<HTMLElement>;
  id?: string;
}

function BookDetails({ bookInfo, ref, id }: BookDetailsProps) {
  const ratingPercentage = (bookInfo.customerReviewRank / 10) * 100;

  return (
    <section className={styles.book_details} ref={ref} id={id}>
      <h2 className={styles.title}>도서 상세정보</h2>
      <div className={styles.info_section}>
        <h3 className={styles.sub_title}>기본 정보</h3>
        <div className={styles.info_table}>
          <div className={styles.info_item}>
            <span className={styles.label}>제목</span>
            <span className={styles.value}>{bookInfo.title}</span>
          </div>
          <div className={styles.info_items}>
            <span className={styles.label}>저자</span>
            <span className={styles.value}>{bookInfo.author}</span>
            <span className={styles.label}>ISBN</span>
            <span className={styles.value}>{bookInfo.isbn13}</span>
          </div>
          <div className={styles.info_items}>
            <span className={styles.label}>출판사</span>
            <span className={styles.value}>{bookInfo.publisher}</span>
            <span className={styles.label}>출간일</span>
            <span className={styles.value}>{bookInfo.pubDate}</span>
          </div>
          <div className={styles.info_items}>
            <span className={styles.label}>카테고리</span>
            <span className={styles.value}>{bookInfo.categoryName}</span>
            <span className={styles.label}>쪽수</span>
            <span className={styles.value}>{bookInfo.subInfo.itemPage}쪽</span>
          </div>
          {bookInfo.subInfo.subTitle && (
            <div className={styles.info_item}>
              <span className={styles.label}>작품 소개</span>
              <span className={styles.value}>{bookInfo.subInfo.subTitle}</span>
            </div>
          )}
          <div className={styles.info_item}>
            <span className={styles.label}>작품 설명</span>
            <p className={styles.value}>{bookInfo.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.info_section}>
        <h3 className={styles.sub_title}>추가 정보</h3>
        <div className={styles.info_table}>
          <div className={styles.info_items}>
            <span className={styles.label}>작성된 독후감</span>
            <span className={styles.value}>1,243개</span>
            <span className={styles.label}>스크랩 수</span>
            <span className={styles.value}>512회</span>
          </div>
          <div className={styles.info_items}>
            <span className={styles.label}>알라딘 리뷰</span>
            <span className={`${styles.value} ${styles.rating_display}`}>
              <div className={styles.stars}>
                <div className={styles.background}>★★★★★</div>
                <div className={styles.fill} style={{ width: `${ratingPercentage}%` }}>
                  ★★★★★
                </div>
              </div>
              <span className={styles.score_text}>{(bookInfo.customerReviewRank / 2).toFixed(1)}</span>
            </span>
            <span className={styles.label}>도서 가격</span>
            <span className={`${styles.value} ${styles.price}`}>
              <span className={styles.standard_price}>{bookInfo.priceStandard.toLocaleString()}원</span>
              <span className={styles.sales_price}>{bookInfo.priceSales.toLocaleString()}원</span>
            </span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.label}>상품 페이지</span>
            <span className={styles.value}>
              <a
                href={bookInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.aladin_link}>
                알라딘에서 상품 확인
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
