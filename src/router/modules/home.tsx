import { lazy, memo } from 'react';
import { UserCircleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';
import { TbWindmill } from 'react-icons/tb';
const Comp = lazy(() => import('pages/MyHome'))

const result: IRouter[] = [
  {
    path: '/home',
    // Component: memo(() => <KeepAlive ><Comp /></KeepAlive>),
    Component: Comp,
    noMargin: true,
    meta: {
      title: 'V App',
      Icon: () => <TbWindmill style={{ fontSize: '20px' }} />,
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
