'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

import styles from './my-bookshelf.module.scss';

import type { Bookshelf } from '@/types/bookshelf/bookshelf';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  bookshelf: Bookshelf | null;
}

function CategoryModal({ isOpen, onClose, onSave, bookshelf }: CategoryModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (bookshelf) {
      setName(bookshelf.name);
    } else {
      setName('');
    }
  }, [bookshelf, isOpen]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal_backdrop} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <h3>{bookshelf ? '카테고리 수정' : '카테고리 추가'}</h3>
          <button className={styles.close_button} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modal_body}>
          <input
            type="text"
            className={styles.input}
            placeholder="카테고리명을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>

        <div className={styles.modal_footer}>
          <button className={styles.cancel_button} onClick={onClose}>
            취소
          </button>
          <button className={styles.save_button} onClick={handleSave} disabled={!name.trim()}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
