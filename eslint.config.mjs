import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  // Next.js 기본 설정
  ...compat.extends('next/core-web-vitals'),

  // TypeScript 규칙
  {
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      ...typescriptEslint.configs['recommended'].rules, // 기본 추천 규칙
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // React 및 Hooks 규칙
  {
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      ...react.configs.recommended.rules, // React 기본 추천 규칙
      ...reactHooks.configs.recommended.rules, // React hooks 기본 추천 규칙
      'react/react-in-jsx-scope': 'off', // 최근 React와 Next.js에서는 import React가 불필요
      'react/prop-types': 'off' // TypeScript에서 props의 타입검사하므로 불필요
    },
    settings: {
      react: {
        version: 'detect' // 설치된 React 버전을 자동으로 감지
      }
    }
  },

  // 웹 접근성(a11y) 규칙 추가
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules, // 기본 추천 규칙
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off'
    }
  },

  // Import 순서 및 경로 규칙
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], 'object', 'type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            }
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-unresolved': 'off' // Next.js의 경로 alias(@/)와 충돌할 수 있어 비활성화
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    }
  },

  // Next.js 플러그인 직접 설정 (compat 대신)
  // next/core-web-vitals에 이미 포함되어 있지만, 명시적으로 보여주기 위함
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules
    }
  },

  // Prettier 연동
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },

  // Prettier 충돌 방지 설정
  prettierConfig,

  // 무시할 파일 및 디렉토리 설정 (기본 설정)
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
  }
];

export default eslintConfig;
