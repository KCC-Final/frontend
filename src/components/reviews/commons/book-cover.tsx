import { useEffect, useState } from 'react';

import { fetchAladin } from '@/apis/aladin';

interface BookCoverProps {
  isbn: string;
  title: string;
  className?: string;
  imageClassName?: string;
  noImageClassName?: string;
}

export default function BookCover({
  isbn,
  title,
  className = '',
  imageClassName = '',
  noImageClassName = ''
}: BookCoverProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookCover = async () => {
      if (!isbn) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        setError(false);
        const data = await fetchAladin.getBookDetails(isbn);

        if (data.item && data.item[0] && data.item[0].cover) {
          setImageUrl(data.item[0].cover);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookCover();
  }, [isbn]);

  if (loading) {
    return (
      <div className={className}>
        <div className={noImageClassName}>
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={title}
          className={imageClassName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <div className={noImageClassName}>
          <span>표지 없음</span>
        </div>
      )}
    </div>
  );
}
