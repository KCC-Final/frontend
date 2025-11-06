/**
 * @author uyh
 */
import { useEffect, useState } from 'react';

import { fetchAladin } from '@/apis/aladin';

interface BookCoverProps {
  isbn: string;
  title: string;
  reviewId?: number;
  className?: string;
  imageClassName?: string;
  noImageClassName?: string;
}

export default function BookCover({
  isbn,
  title,
  reviewId,
  className = '',
  imageClassName = '',
  noImageClassName = ''
}: BookCoverProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('BookCover reviewId:', reviewId);

    const fetchBookCover = async () => {
      if (!isbn) {
        setLoading(false);
        return;
      }

      try {
        setError(false);
        const data = await fetchAladin.getBookDetails(isbn);

        if (data.item && data.item[0] && data.item[0].cover) {
          setImageUrl(data.item[0].cover);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookCover();
  }, [isbn, reviewId]);

  // dicebear 배경 URL - 최신 버전 9.x 사용
  const dicebearUrl = reviewId ? `https://api.dicebear.com/9.x/glass/svg?seed=${reviewId}` : null;

  console.log('dicebearUrl:', dicebearUrl);

  if (loading) {
    return (
      <div className={className} style={{ position: 'relative' }}>
        {dicebearUrl && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${dicebearUrl})`,
              opacity: 0.9,
              zIndex: 0
            }}
          />
        )}
        <div className={noImageClassName} style={{ position: 'relative', zIndex: 2 }}>
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* dicebear 배경 - reviewId가 있으면 무조건 표시 */}
      {dicebearUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${dicebearUrl})`,
            opacity: 0.9,
            zIndex: 0
          }}
        />
      )}

      {/* reviewId 없으면 책 표지 블러 배경 */}
      {!dicebearUrl && imageUrl && !error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${imageUrl})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            zIndex: 0
          }}
        />
      )}

      {/* 책 표지 이미지 */}
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={title}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 1
          }}
        />
      ) : (
        <div className={noImageClassName} style={{ position: 'relative', zIndex: 2 }}>
          <span>표지 없음</span>
        </div>
      )}
    </div>
  );
}
