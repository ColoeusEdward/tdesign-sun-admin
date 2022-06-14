import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ETheme } from 'types/index.d';
import { CHART_COLORS, defaultColor } from 'configs/color';
import { RootState } from '../store';
import { version } from '../../../package.json';

const namespace = 'global';

export enum ELayout {
  side = 1,
  top,
  mix,
  fullPage,
}

export interface IGlobalState {
  loading: boolean;
  collapsed: boolean;
  /**
   * 是否显示面包屑导航
   */
  setting: boolean;
  version: string;
  color: string;
  theme: ETheme;
  layout: ELayout;
  isFullPage: boolean;
  showHeader: boolean;
  showBreadcrumbs: boolean;
  showFooter: boolean;
  chartColors: Record<string, string>;
}

const defaultTheme = ETheme.dark;
let localCollapsed = localStorage.getItem('menuCollapsed') && JSON.parse(localStorage.getItem('menuCollapsed')!)

const initialState: IGlobalState = {
  loading: true,
  collapsed: localCollapsed || window.innerWidth < 1000, // 宽度小于1000 菜单闭合
  setting: false,
  version,
  theme: defaultTheme,
  layout: ELayout.side,
  isFullPage: false,
  color: defaultColor?.[0],
  showHeader: true,
  showBreadcrumbs: true,
  showFooter: false,
  chartColors: CHART_COLORS[defaultTheme],
};

// 创建带有命名空间的reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    toggleMenu: (state, action) => {
      if (action.payload === null) {
        state.collapsed = !state.collapsed;
      } else {
        state.collapsed = !!action.payload;
      }
      localStorage.setItem('menuCollapsed', JSON.stringify(state.collapsed))
    },
    toggleSetting: (state) => {
      state.setting = !state.setting;
    },
    toggleShowHeader: (state) => {
      state.showHeader = !state.showHeader;
    },
    toggleShowBreadcrumbs: (state) => {
      state.showBreadcrumbs = !state.showBreadcrumbs;
    },
    toggleShowFooter: (state) => {
      state.showFooter = !state.showFooter;
    },
    switchTheme: (state, action: PayloadAction<ETheme>) => {
      let finalTheme = action?.payload;
      if (!finalTheme) {
        // 跟随系统
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          finalTheme = media.matches ? ETheme.dark : ETheme.light;
        }
      }
      // 切换 chart 颜色
      state.chartColors = CHART_COLORS[finalTheme];
      // 切换主题颜色
      state.theme = finalTheme;
      document.documentElement.setAttribute('theme-mode', finalTheme);
    },
    switchColor: (state, action) => {
      if (action?.payload) {
        state.color = action?.payload;
        document.documentElement.style.setProperty(`--td-brand-color-8`, action?.payload);
      }
    },
    switchLayout: (state, action) => {
      if (action?.payload) {
        state.layout = action?.payload;
      }
    },
    switchFullPage: (state, action) => {
      state.isFullPage = !!action?.payload;
    },
  },
  extraReducers: () => { },
});

export const selectGlobal = (state: RootState) => state.global;

export const {
  toggleMenu,
  toggleSetting,
  toggleShowHeader,
  toggleShowBreadcrumbs,
  toggleShowFooter,
  switchTheme,
  switchColor,
  switchLayout,
  switchFullPage,
} = globalSlice.actions;

export default globalSlice.reducer;
