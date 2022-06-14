import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../modules/store';
import { selectGlobal, switchFullPage } from '../../modules/global';
import { Layout, Breadcrumb } from 'tdesign-react';
import Style from './Page.module.less';
import { IRouter } from 'router';

const { Content } = Layout;
const { BreadcrumbItem } = Breadcrumb;

const Page = ({
  children,
  isFullPage,
  breadcrumbs,
  route
}: React.PropsWithChildren<{ isFullPage?: boolean; breadcrumbs?: string[]; route?: IRouter }>) => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(switchFullPage(isFullPage));
  }, [isFullPage]);

  if (isFullPage) {
    return <>{children}</>;
  }

  return (
    <Content className={Style.panel} style={route?.noMargin ? { margin: '0' } : {}}>
      {globalState.showBreadcrumbs && !route?.noMargin && (
        <Breadcrumb className={Style.breadcrumb}>
          {breadcrumbs?.map((item, index) => (
            <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}
      {children}
    </Content>
  );
};

export default React.memo(Page);
