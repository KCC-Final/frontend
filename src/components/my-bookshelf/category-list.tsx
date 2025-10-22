'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';

import styles from './my-bookshelf.module.scss';

import type { Bookshelf } from '@/types/bookshelf/bookshelf';

interface CategoryListProps {
  bookshelves: Bookshelf[];
  selectedBookshelf: number | null;
  onSelectBookshelf: (id: number) => void;
  onAddBookshelf: () => void;
  onEditBookshelf: (bookshelf: Bookshelf) => void;
  onDeleteBookshelf: (id: number) => void;
}

function CategoryList({
  bookshelves,
  selectedBookshelf,
  onSelectBookshelf,
  onAddBookshelf,
  onEditBookshelf,
  onDeleteBookshelf
}: CategoryListProps) {
  return (
    <div className={styles.category_area}>
      <div className={styles.category_header}>
        <h3>카테고리 목록</h3>
      </div>

      <div className={styles.category_list}>
        {bookshelves.map((bookshelf) => (
          <div
            key={bookshelf.bookshelfId}
            className={`${styles.category_item} ${selectedBookshelf === bookshelf.bookshelfId ? styles.active : ''}`}>
            <button className={styles.category_name} onClick={() => onSelectBookshelf(bookshelf.bookshelfId)}>
              {bookshelf.name}
            </button>
            <div className={styles.category_actions}>
              <button
                className={styles.icon_button}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBookshelf(bookshelf);
                }}>
                <Pencil size={16} />
              </button>
              <button
                className={styles.icon_button}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBookshelf(bookshelf.bookshelfId);
                }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <button className={styles.add_category_button} onClick={onAddBookshelf}>
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

export default CategoryList;
