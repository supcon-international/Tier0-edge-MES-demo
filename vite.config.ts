import path from "path"
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const devProxy = {
  '/eventflow/home': {
    target: 'https://instance5.tier0.app:8443',
    changeOrigin: true,
    secure: true
  }
}

// 从basePath中提取最后一个有效的名字作为输出目录名
  const getOutDirName = (path: string) => {
    // 移除首尾的斜杠
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    // 如果是根路径或空路径，返回'default'
    if (!cleanPath) return 'default';
    // 按斜杠分割并返回最后一个非空部分
    const parts = cleanPath.split('/').filter(part => part.trim() !== '');
    return parts.length > 0 ? parts[parts.length - 1] : 'default';
  };

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 从环境变量获取basePath
  const basePath = env.VITE_BASE_PATH || '/';
  const outDirName = mode === 'preview' ? basePath : getOutDirName(basePath);
  const analyze = env.VITE_ANALYZE === 'true';

  return {
    base: basePath,
    build: {
      outDir: `dist/${outDirName}`,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            // React核心
            'vendor-react': [
              'react',
              'react-dom',
              'react-router-dom',
            ],
            // UI组件库
            'vendor-ui': [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
              'lucide-react',
              'cmdk',
              'sonner',
              'vaul',
              'next-themes'
            ],
            // 工具库
            'vendor-utils': [
              'clsx',
              'tailwind-merge',
              'dayjs',
              'nanoid',
            ],
            // 国际化
            'vender-i18n': [
              'i18next',
              'react-i18next'
            ],
          },
        }
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      analyze && visualizer({
        filename: `dist/${basePath}/stats.html`,
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        ...devProxy
      },
    },
    preview: {
      proxy: {
        ...devProxy
      },
    },
  }
})
