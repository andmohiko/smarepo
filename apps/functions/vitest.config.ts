/**
 * Vitestの設定ファイル
 * TypeScriptのパスエイリアスをテスト環境でも使用できるようにする
 */
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@smarepo/common': path.resolve(__dirname, '../../packages/common/src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    sequence: {
      concurrent: false,
    },
    setupFiles: ['./test/setup.ts'],
  },
})
