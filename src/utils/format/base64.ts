/** Base64 문자열을 이미지 Data URL로 변환 */
export const changeImageUrlFromBase64 = (base64String: string | null | undefined): string => {
  if (!base64String) {
    return '';
  }

  if (base64String.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${base64String}`;
  } else if (base64String.startsWith('iVBOR')) {
    return `data:image/png;base64,${base64String}`;
  } else if (base64String.startsWith('R0lGOD')) {
    return `data:image/gif;base64,${base64String}`;
  } else if (base64String.startsWith('UklGR')) {
    return `data:image/webp;base64,${base64String}`;
  } else if (base64String.startsWith('data:image')) {
    return base64String;
  } else {
    return base64String;
  }
};
