import { lazy, memo } from 'react';
import { UserCircleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';
import { TbWindmill, TbBrandDiscord } from 'react-icons/tb';
import { FiRadio } from 'react-icons/fi';
import { RiRadioButtonLine } from 'react-icons/ri';
import { ImRadioChecked } from 'react-icons/im';
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
  {
    path: '/v8',
    Component: lazy(() => import('pages/V8')),
    noMargin: true,
    meta: {
      title: 'V8',
      Icon: () => <TbBrandDiscord style={{ fontSize: '20px' }} />,
    },
  },
  {
    path: '/radio',
    Component: lazy(() => import('pages/Radio')),
    noMargin: true,
    meta: {
      title: 'Radio',
      Icon: () => <FiRadio style={{ fontSize: '20px' }} />,
    },
  },
  {
    path: '/gadioBro',
    Component: lazy(() => import('pages/GadioBrowser')),
    noMargin: true,
    meta: {
      title: 'GadioBro',
      Icon: () => <ImRadioChecked style={{ fontSize: '20px' }} />,
    },
  },
  // {
  //   path: '/gRadio',
  //   Component: lazy(() => import('pages/GRadio')),
  //   noMargin: true,
  //   meta: {
  //     title: 'GRadio',
  //     Icon: () => <RiRadioButtonLine  style={{ fontSize: '20px' }} />,
  //   },
  // },
];

export default result;
