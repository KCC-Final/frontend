import axiosGroo from '@/apis/groo/config';
import { SearchResDTO } from '@/types/search/dto';

export const search = {
  searchAll: async (keyword: string): Promise<SearchResDTO> => {
    const response = await axiosGroo.get<SearchResDTO>('/search', {
      params: { q: keyword }
    });
    return response.data;
  }
};
