import { format } from 'date-fns';

import { fetchGroo } from '@/apis';
import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import { fetchNLLibrary } from '@/apis/nl-library';
import { AladinBookDetailsItem } from '@/types';
import { devLogger } from '@/utils/dev-logger';

/** 오늘의 한 문장 데이터를 가져옵니다.*/
export async function getDailyQuote() {
  try {
    const quoteData = await fetchGroo.book.getDailyQuote();
    return quoteData?.data || null;
  } catch (error) {
    devLogger(error, true);
    return null;
  }
}

/** 알라딘 베스트셀러 목록을 가져옵니다. */
export async function getBestsellers() {
  try {
    const response = await fetchAladin.getBestSellers(20);
    return response?.item || [];
  } catch (error) {
    devLogger(error, true);
    return [];
  }
}

/** 국립중앙도서관 사서 추천 도서 목록을 가져옵니다. */
export async function getLibrarianRecommends(): Promise<string[]> {
  try {
    const response = await fetchNLLibrary.getLibrarianRecommendBooks(1, 20);

    const bookList = response.channel.list;

    if (Array.isArray(bookList)) {
      const isbnList = bookList.map((entry) => entry.item.recomisbn);

      const uniqueIsbnList = [...new Set(isbnList.filter(Boolean))];
      return uniqueIsbnList;
    }

    return [];
  } catch (error) {
    devLogger(error, true);
    return [];
  }
}

/** 핫 트렌드 도서 목록을 가져옵니다. */
export async function getHotTrendBooks(): Promise<string[]> {
  const today = format(new Date(), 'yyyy-MM-dd');

  try {
    const response = await fetchLibrary.getHotTrendBooks(today);

    const isbnList = [
      ...new Set(
        response.response.results
          .flatMap((resultContainer) => resultContainer.result.docs)
          .map((docContainer) => docContainer.doc.isbn13)
      )
    ];
    return isbnList;
  } catch (error) {
    devLogger(error, true);
    return [];
  }
}

/** ISBN 목록으로 도서 상세 정보를 가져옵니다. */
export async function getBookDetailsListByIsbn(isbnList: string[]): Promise<AladinBookDetailsItem[]> {
  if (!isbnList || isbnList.length === 0) {
    return [];
  }

  try {
    const bookDetailsPromises = isbnList.map(async (isbn) => {
      const response = await fetchAladin.getBookDetails(isbn);

      if (response && response.item && response.item.length > 0) {
        return response.item[0];
      }

      throw new Error(`Book details not found for ISBN: ${isbn}`);
    });

    const results = await Promise.allSettled(bookDetailsPromises);

    const fulfilledBooks = results
      .filter(
        (result): result is PromiseFulfilledResult<AladinBookDetailsItem> => result.status === 'fulfilled'
      )
      .map((result) => result.value);

    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) => {
        devLogger(`Failed to fetch book details: ${result.reason}`, true);
      });

    return fulfilledBooks;
  } catch (error) {
    devLogger(error, true);
    return [];
  }
}
