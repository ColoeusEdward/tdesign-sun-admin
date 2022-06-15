import React, { Suspense, memo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, NavigateFunction } from 'react-router-dom';
import { Button, Layout, Loading } from 'tdesign-react';
import routers, { IRouter } from 'router';
import { resolve } from 'utils/path';
import Page from './Page';
import Style from './AppRouter.module.less';
import KeepAlive, { useAliveController } from 'react-activation';

const { Content } = Layout;


// 封装一层 专门负责显示页面标题
const DomTitle = ({ route, children }: { route: IRouter, children: any }) => {
  route.meta?.title && (document.title = route.meta!.title);
  return children
}

type TRenderRoutes = (routes: IRouter[], parentPath?: string, breadcrumbs?: string[]) => React.ReactNode[];
/**
 * 渲染应用路由
 * @param routes
 * @param parentPath
 * @param breadcrumb
 */
const renderRoutes: TRenderRoutes = (routes, parentPath = '', breadcrumb = []) => {
  return routes.map((route, index: number) => {
    const { Component, children, redirect, meta } = route;
    const currentPath = resolve(parentPath, route.path);
    let currentBreadcrumb = breadcrumb;

    if (meta?.title) {
      currentBreadcrumb = currentBreadcrumb.concat([meta?.title]);
    }

    if (redirect) {
      // 重定向
      return <Route key={index} path={currentPath} element={<Navigate to={redirect} replace />} />;
    }

    if (Component) {
      // 有路由菜单
      return (
        <Route
          key={index}
          path={currentPath}
          element={
            <DomTitle route={route}>
              <Page isFullPage={route.isFullPage} route={route} breadcrumbs={currentBreadcrumb}>
                {/* <KeepAlive key={currentPath}></KeepAlive> */}
                <Component />
              </Page>
            </DomTitle>
          }
        />
      );
    }
    // 无路由菜单
    return children ? renderRoutes(children, currentPath, currentBreadcrumb) : null;
  });
}
const AppRouter = () => {
  return (
    <Content className={Style.panel}>
      <Suspense
        fallback={
          <div className={Style.loading}>
            <Loading />
          </div>
        }
      >
        <Routes>{renderRoutes(routers)}</Routes>
      </Suspense>
    </Content>
  );
}

export default memo(AppRouter);
