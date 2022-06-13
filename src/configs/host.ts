export default {
  mock: {
    // 本地mock数据
    API: '',
  },
  development: {
    // 开发环境接口请求
    API: '/dev',
    target: 'https://meamoe.ml'
  },
  test: {
    // 测试环境接口地址
    API: 'https://service-exndqyuk-1257786608.gz.apigw.tencentcs.com',
  },
  production: {
    // 正式环境接口地址
    API: 'https://meamoe.ml',
  },
};
