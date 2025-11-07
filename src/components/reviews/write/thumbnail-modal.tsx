'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

import styles from './thumbnail-modal.module.scss';

import { getCroppedImg } from '@/utils/cropImage';

// react-easy-crop 타입 정의
interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ThumbnailModalProps {
  currentThumbnail?: string | null;
  onClose: () => void;
  onConfirm: (thumbnail: string) => void;
}

export default function ThumbnailModal({ currentThumbnail, onClose, onConfirm }: ThumbnailModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(currentThumbnail || null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // 파일 업로드 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 크롭 완료 콜백
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 크롭된 이미지 저장
  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(croppedImage);
      onClose();
    } catch (error) {
      console.error('이미지 크롭 실패:', error);
      alert('이미지 크롭에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>썸네일 미리보기</h2>

        {/* 이미지가 아직 없으면 업로드 버튼 */}
        {!imageSrc ? (
          <div className={styles.uploadPlaceholder}>
            <label htmlFor="fileInput" className={styles.uploadLabel}>
              <span>이미지 업로드</span>
            </label>
            <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        ) : (
          <>
            {/* 크롭 컨테이너 */}
            <div className={styles.cropContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
                cropShape="rect"
              />
            </div>

            {/* 줌 컨트롤 */}
            <div className={styles.zoomControl}>
              <label>
                줌:
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={styles.zoomSlider}
                />
              </label>
            </div>
          </>
        )}

        {/* 액션 버튼 */}
        <div className={styles.actions}>
          {imageSrc && (
            <button onClick={handleRemoveImage} className={styles.removeBtn}>
              다시 선택
            </button>
          )}
          <button onClick={onClose} className={styles.cancelBtn}>
            취소
          </button>
          {imageSrc && (
            <button onClick={handleConfirm} className={styles.confirmBtn}>
              등록
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
