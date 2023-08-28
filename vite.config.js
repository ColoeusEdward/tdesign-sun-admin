import path, { resolve } from 'path';
import { viteMockServe } from 'vite-plugin-mock';
import react from '@vitejs/plugin-react';
import svgr from '@honkhonk/vite-plugin-svgr';
import host from './src/configs/host'
import define, { setRoot } from './src/configs/define'
function getBase(params) {
  setRoot(params.mode)
  // console.log("🚀 ~ file: vite.config.js ~ line 8 ~ getBase ~ params", params)
  // console.log(`host`,host[params.mode]);
  // var env = params.mode || 'development';
  var root = define.root
  return root
}
export default (params) => ({
  base: getBase(params),
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      configs: path.resolve(__dirname, './src/configs'),
      layouts: path.resolve(__dirname, './src/layouts'),
      modules: path.resolve(__dirname, './src/modules'),
      pages: path.resolve(__dirname, './src/pages'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
      services: path.resolve(__dirname, './src/services'),
      router: path.resolve(__dirname, './src/router'),
      hooks: path.resolve(__dirname, './src/hooks'),
      types: path.resolve(__dirname, './src/types'),
      jtStore: path.resolve(__dirname, './src/jtStore'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 如需自定义组件其他 token, 在此处配置
        },
      },
    },
  },

  plugins: [
    svgr(),
    // react({
    //   babel:{
    //     babelrc:true
    //   }
    // }),
    react(),
    params.mode === 'mock' &&
    viteMockServe({
      mockPath: './mock',
      localEnabled: true,
    }),
  ],
  publicDir: 'public',
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        book: resolve(__dirname, 'bookPage/index.html')
      }
    }
  },

  server: {
    strictPort: true, // * 固定端口(如果端口被占用则中止)
    host: '0.0.0.0',
    port: 8820,
    proxy: {
      '/dev': {
        // 用于开发环境下的转发请求
        // 更多请参考：https://vitejs.dev/config/#server-proxy
        target: host[params.mode].target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, '')
      },
    },
  },
});

