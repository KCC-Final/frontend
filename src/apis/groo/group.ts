import axiosGroo from '@/apis/groo/config';
import {
  GroupData,
  GroupCommentData,
  GroupScrapData,
  GroupRequestBody,
  GroupCommentRequestBody,
  GroupMutateResDTO,
  GroupListResDTO,
  GroupDetailResDTO,
  GroupCommentResDTO,
  GroupScrapResDTO,
  GroupScrapListResDTO
} from '@/types/groups';

export const group = {
  //group contents
  //create group
  createGroup: async (data: GroupRequestBody): Promise<GroupMutateResDTO> => {
    const response = await axiosGroo.post<GroupMutateResDTO>('/groups', data);
    return response.data;
  },

  //update group
  updateGroup: async (groupId: number, data: GroupRequestBody): Promise<GroupMutateResDTO> => {
    const response = await axiosGroo.put<GroupMutateResDTO>(`/groups/${groupId}`, data);
    return response.data;
  },

  //delete group
  deleteGroup: async (groupId: number): Promise<GroupMutateResDTO> => {
    const response = await axiosGroo.delete<GroupMutateResDTO>(`/groups/${groupId}`);
    return response.data;
  },

  //get detail
  getGroupDetail: async (groupId: number): Promise<GroupDetailResDTO['data']> => {
    const response = await axiosGroo.get<GroupDetailResDTO>(`/groups/${groupId}`);
    return response.data.data;
  },

  //get list
  getAllGroups: async (params?: {
    style?: 'discussion' | 'reading' | 'free';
    status?: boolean;
    location?: number;
    scrap?: boolean;
    search?: string;
    page?: number;
  }): Promise<GroupListResDTO['data']> => {
    const response = await axiosGroo.get<GroupListResDTO>('/groups', { params });
    return response.data.data;
  },

  //comments
  //create comment
  createComment: async (groupId: number, data: GroupCommentRequestBody): Promise<GroupCommentResDTO> => {
    const response = await axiosGroo.post<GroupCommentResDTO>(`/groups/comments/${groupId}`, data);
    return response.data;
  },

  //update comment
  updateComment: async (commentId: number, data: GroupCommentRequestBody): Promise<GroupCommentResDTO> => {
    const response = await axiosGroo.put<GroupCommentResDTO>(`/groups/comments/${commentId}`, data);
    return response.data;
  },

  //delete comment
  deleteComment: async (commentId: number): Promise<GroupCommentResDTO> => {
    const response = await axiosGroo.delete<GroupCommentResDTO>(`/groups/comments/${commentId}`);
    return response.data;
  },

  //get comments
  // get comments
  getCommentsByGroupId: async (groupId: number): Promise<GroupCommentData[]> => {
    const response = await axiosGroo.get(`/groups/comments/${groupId}`);
    return response.data.data;
  },

  //scraps
  //create scrap
  createScrap: async (groupId: number): Promise<GroupScrapResDTO> => {
    const response = await axiosGroo.post<GroupScrapResDTO>(`/groups/scrap/${groupId}`);
    return response.data;
  },

  //get scrap status
  getScrapStatus: async (groupId: number): Promise<GroupScrapResDTO> => {
    const response = await axiosGroo.get<GroupScrapResDTO>(`/groups/scrap/${groupId}`);
    return response.data;
  },

  //delete scrap
  deleteScrap: async (groupId: number): Promise<GroupScrapResDTO> => {
    const response = await axiosGroo.delete<GroupScrapResDTO>(`/groups/scrap/${groupId}`);
    return response.data;
  },

  //get scrap list
  getMyScrapGroups: async (): Promise<GroupScrapListResDTO['data']> => {
    const response = await axiosGroo.get<GroupScrapListResDTO>('/groups/scrap');
    return response.data.data;
  }
};
