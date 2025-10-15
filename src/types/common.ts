export type CommonResDTO<D = unknown> = {
  message: string;
  data: D;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};
