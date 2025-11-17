import axiosGroo from '@/apis/groo/config';

export interface RecommendationResponse {
  isbn: string;
  score: number;
  reason: string;
  similarUserCount: number;
}

/**
 * 사용자 맞춤 도서 추천 조회
 * @param limit 추천할 도서 개수
 * @returns 추천 도서 목록
 */
export const getRecommendations = async (limit: number = 10): Promise<RecommendationResponse[]> => {
  const response = await axiosGroo.get(`/recommendations`, {
    params: { limit }
  });
  return response.data.data;
};

/**
 * 인기 도서 추천 조회
 * @param limit 추천할 도서 개수
 * @returns 인기 도서 목록
 */
export const getPopularBooks = async (limit: number = 20): Promise<RecommendationResponse[]> => {
  const response = await axiosGroo.get(`/recommendations/popular`, {
    params: { limit }
  });
  return response.data;
};
