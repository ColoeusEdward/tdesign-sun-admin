import React, { lazy } from 'react';
import { BrowserRouterProps } from 'react-router-dom';

// 把modules文件夹下的所有ts文件自动生成映射关系
const modules = import.meta.globEager('./modules/**.{ts,tsx}')
const moduleRouterList: IRouter[] = []
const env = import.meta.env.MODE

Object.keys(modules).forEach((key: string) => {
  const nameMatch: string[] | null = key.match(/^\.\/modules\/(.+)\.(ts|tsx)/)

  if (!nameMatch) {
    return
  }
  // 如果页面以Index命名，则使用父文件夹作为name
  // const indexMatch: string[] | null = nameMatch[1].match(/(.*)\/Index$/i)

  let name: string = nameMatch[1]

    ;[name] = name.split('/').splice(-1)
  moduleRouterList.push(...modules[key].default)
})

export interface IRouter {
  path: string;
  redirect?: string;
  Component?: React.FC<BrowserRouterProps> | (() => any);
  noMargin?: boolean;      //是否没有margin和面包条
  /**
   * 当前路由是否全屏显示
   */
  isFullPage?: boolean;
  /**
   * meta未赋值 路由不显示到菜单中
   */
  meta?: {
    title?: string;
    Icon?: React.FC;
  };
  children?: IRouter[];
}

const routes: IRouter[] = [
  {
    path: '/login',
    Component: lazy(() => import('pages/Login')),
    isFullPage: true,
  },
  {
    path: '/',
    redirect: env == 'electron' ? '/radio' : '/home',
  },
];

const otherRoutes: IRouter[] = [
  {
    path: '/403',
    Component: lazy(() => import('pages/Result/403')),
  },
  {
    path: '/500',
    Component: lazy(() => import('pages/Result/500')),
  },
  {
    path: '*',
    Component: lazy(() => import('pages/Result/404')),
  },
];

// const allRoutes = [...routes, ...dashboard, ...list, ...form, ...detail, ...result, ...user, ...login, ...otherRoutes];
const allRoutes = [...routes, ...moduleRouterList, ...otherRoutes]
// console.log("🚀 ~ file: index.ts ~ line 28 ~ Object.keys ~ moduleRouterList", moduleRouterList)
export default allRoutes;
