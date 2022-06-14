import { lazy } from 'react';
import { UserCircleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';
import { TbWindmill } from 'react-icons/tb';
const result: IRouter[] = [
  {
    path: '/home',
    Component: lazy(() => import('pages/MyHome')),
    noMargin:true,
    meta: {
      title: 'V App',
      Icon: TbWindmill,
    },
    // children: [
    //   {
    //     path: 'index',
    //     Component: lazy(() => import('pages/User')),
    //     meta: {
    //       title: '个人中心',
    //     },
    //   },
    // ],
  },
];

export default result;
