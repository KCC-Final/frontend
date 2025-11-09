'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './write.module.scss';

import { group as groupApi } from '@/apis/groo/group';
import BookInfo from '@/components/reviews/write/book-info-card';
import BookSearchModal from '@/components/reviews/write/book-search-modal';
import { regionList } from '@/types/common/region';
import { GroupRequestBody } from '@/types/groups';
import { AladinBook } from '@/types/reviews';

function ReadingGroupWrite() {
  const router = useRouter();

  const [formData, setFormData] = useState<GroupRequestBody>({
    groupName: '',
    bookTitle: '',
    isbn: '',
    headcountMin: 2,
    headcountMax: 6,
    content: '',
    style: '독서',
    status: true,
    endDate: '',
    codeId: 11
  });

  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [intro, setIntro] = useState('');
  const [keywords, setKeywords] = useState('');
  const [participation, setParticipation] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ?? prev[name as keyof GroupRequestBody]) : value
    }));
  };

  const handleSelectBook = (book: AladinBook) => {
    setSelectedBook(book);
    setFormData((prev) => ({ ...prev, bookTitle: book.title, isbn: book.isbn13 }));
    setShowBookModal(false);
  };

  const handleRemoveBook = () => {
    setSelectedBook(null);
    setFormData((prev) => ({ ...prev, bookTitle: '', isbn: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const combinedContent = `
모임 소개
${intro.trim()}

토론 키워드
${keywords.trim()}

참여 방법
${participation.trim()}
      `.trim();

      const payload = { ...formData, content: combinedContent };

      await groupApi.createGroup(payload);
      alert('독서모임이 등록되었습니다!');
      router.push('/groups');
    } catch (err) {
      console.error(err);
      setError('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.groupWriteContainer}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ArrowLeft size={18} /> 뒤로가기
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.inputTitle}
          name="groupName"
          value={formData.groupName}
          onChange={handleChange}
          placeholder="모임명을 입력해주세요"
          required
        />

        {selectedBook ? (
          <div className={styles.bookSection}>
            <BookInfo bookInfo={selectedBook} loading={false} onEdit={() => setShowBookModal(true)} />
          </div>
        ) : (
          <button type="button" className={styles.bookSelectBtn} onClick={() => setShowBookModal(true)}>
            도서 선택
          </button>
        )}

        <div className={styles.metaGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="style">진행 방식</label>
            <select id="style" name="style" value={formData.style} onChange={handleChange}>
              <option value="독서">독서</option>
              <option value="토론">토론</option>
              <option value="자유">자유</option>
            </select>
          </div>

          <div className={styles.headcountRow}>
            <div className={styles.formGroup}>
              <label htmlFor="headcountMin">최소 인원</label>
              <input
                id="headcountMin"
                type="number"
                name="headcountMin"
                value={formData.headcountMin}
                onChange={handleChange}
                min={1}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="headcountMax">최대 인원</label>
              <input
                id="headcountMax"
                type="number"
                name="headcountMax"
                value={formData.headcountMax}
                onChange={handleChange}
                min={formData.headcountMin}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">모집 마감일</label>
            <input id="endDate" type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="region">지역</label>
            <select id="region" name="codeId" value={formData.codeId} onChange={handleChange}>
              {regionList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.textareaGroup}>
          <label htmlFor="intro">모임 소개</label>
          <textarea
            id="intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="모임 소개를 입력해주세요."
          />
        </div>

        <div className={styles.textareaGroup}>
          <label htmlFor="keywords">토론 키워드</label>
          <textarea
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="토론 키워드를 입력해주세요."
          />
        </div>

        <div className={styles.textareaGroup}>
          <label htmlFor="participation">참여 방법</label>
          <textarea
            id="participation"
            value={participation}
            onChange={(e) => setParticipation(e.target.value)}
            placeholder="참여 방법을 입력해주세요."
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>

      {showBookModal && (
        <BookSearchModal onSelect={handleSelectBook} onClose={() => setShowBookModal(false)} />
      )}
    </main>
  );
}

export default ReadingGroupWrite;
