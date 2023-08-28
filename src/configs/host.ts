const hmap = {
  mock: {
    // 本地mock数据
    API: '',
  },
  development: {
    // 开发环境接口请求
    API: '/dev',
    target: 'https://meamoe.one'
  },
  test: {
    // 测试环境接口地址
    API: 'https://service-exndqyuk-1257786608.gz.apigw.tencentcs.com',
  },
  production: {
    // 正式环境接口地址
    API: 'https://meamoe.one',
    // API: 'https://'+window.location.host,
  },
  electron: {
    API: 'https://meamoe.one',
    target: 'https://meamoe.one'
  }
};

export default hmap
