interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = (imageSrc: string, cropArea: CropArea): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context를 생성할 수 없습니다.'));
        return;
      }

      // 16:9 비율에 맞춰 캔버스 크기 설정
      const targetWidth = cropArea.width;
      const targetHeight = cropArea.height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 크롭 영역을 캔버스에 그리기
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // base64로 변환 (JPEG 포맷, 품질 0.9)
      try {
        const base64String = canvas.toDataURL('image/jpeg', 0.9);
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      reject(new Error('이미지를 로드할 수 없습니다.'));
    };

    image.src = imageSrc;
  });
};
