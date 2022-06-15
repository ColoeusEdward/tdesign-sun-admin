import { useMemoizedFn } from "ahooks";
import { Loading, Tabs } from "tdesign-react";
import _ from "lodash";
import memoized from "nano-memoize";
import React, { Suspense, useEffect, useRef } from "react";
// import Lru from "@/utils/lru";
import type { Location } from "react-router-dom";
// import { useWhyDidYouUpdate } from 'ahooks';
import {
  generatePath,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";

// import { DynamicRouteType } from "@/config/routes";


interface TabObjectType {
  name: string;
  key: string;
  page: React.ReactElement | null;
  location: Location;
  params: Record<string, any>;
}

const { TabPanel: TabPane } = Tabs;

const getTabPath = (tab: TabObjectType) =>
  generatePath(tab.location.pathname, tab.params);

// tab的select key = location.pathname + , + matchpath
// 以此解决 微端情况下 tab 的 key 相同导致页面可能丢失的问题。
const generTabKey = memoized(
  (location: Location, matchpath: string) =>
    `${location.pathname},${matchpath}`,
);

// 从key中返回 ,号后面的字符
const getTabMapKey = memoized((key: string) =>
  key.substring(key.indexOf(",") + 1, key.length),
);

interface Props {
  routeConfig: any;
  matchPath: string;
}

const TabRoute: React.FC<Props> = ({ routeConfig, matchPath }) => {
  // 使用map代替array 后 ，lru暂时不用了...
  // 主要是 map 好remove key
  // const keyLruSquence = useCreation(() => new Lru(25));

  const ele = useOutlet();

  const location = useLocation();

  const params = useParams();

  const navigate = useNavigate();

  // tabList 使用 ref ，避免二次render。
  // const [tabList, setTabList] = useSafeState([]);
  // tablist 结构为 key:matchPath,value:tabObject ;
  // key == location.pathname
  // tabObject中记录当下location。
  const tabList = useRef<Map<string, TabObjectType>>(new Map());

  // 确保tab
  /*
   * const updateTabList =
   */
  useEffect(() => {
    const tab = tabList.current.get(matchPath);
    const newTab: TabObjectType = {
      name: routeConfig.name,
      key: generTabKey(location, matchPath),
      page: ele,
      // access:routeConfig.access,
      location,
      params,
    };
    // console.log("tabList is",tabList);
    // console.log("cur tab is:",tab);
    // console.log('match matchPath is',matchPath);
    // console.log('params is',params);
    // console.log('location is',location);
    // console.log('ele is',ele);
    if (tab) {
      // 处理微前端情况，如发生路径修改则替换
      // 还要比较参数
      // 微端路由更新 如果key不更新的话。会导致页面丢失..
      if (tab.location.pathname !== location.pathname) {
        tabList.current.set(matchPath, newTab);
      }
    } else {
      tabList.current.set(matchPath, newTab);
    }
  }, [location]);

  const closeTab = useMemoizedFn((selectKey) => {
    // 记录原真实路由,微前端可能修改
    // keyLruSquence.newest.value.curPath = window.location.pathname
    // navigate(keyLruSquence.get(selectKey).curPath,{replace:true});
    if (tabList.current.size >= 2) {
      tabList.current.delete(getTabMapKey(selectKey));
      const nextKey = _.last(Array.from(tabList.current.keys()));
      if (nextKey) {
        navigate(getTabPath(tabList.current.get(nextKey)!), { replace: true });
      }
    }
  });

  const selectTab = useMemoizedFn((selectKey) => {
    // 记录原真实路由,微前端可能修改
    navigate(getTabPath(tabList.current.get(getTabMapKey(selectKey))!), {
      replace: true,
    });
  });

  // useWhyDidYouUpdate('useWhyDidYouUpdateTabRoutes', { ...props, ele,location,tabList });
  return (
    <Tabs
      // className={styles.tabs}
      value={generTabKey(location, matchPath)}
      onChange={(key) => selectTab(key)}
      // tabBarExtraContent={operations}
      placement="top"
    >
      {[...tabList.current.values()].map((item) => (
        <TabPane label={item.name} key={item.key}>
          <Suspense fallback={
            <div className={'flex items-center justify-center h-full w-full'}>
              <Loading />
            </div>
          }>{item.page}</Suspense>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default TabRoute;