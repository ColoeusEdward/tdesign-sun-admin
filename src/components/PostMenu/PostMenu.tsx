import { ClickEvent, ControlledMenu, MenuItem, useMenuState } from "@szhsin/react-menu";
import { useAtom, useAtomValue } from "jotai";
import { anchorPointAtom } from "jtStore/home";
import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useState } from "react";
import { IconType } from "react-icons/lib";
import { menuClassName } from "utils/util";

export type buildMenuItemFn = (set: React.Dispatch<React.SetStateAction<myMenuItem[]>>) => void
export interface postMenuProp {
  menuClick: (event: ClickEvent) => void
  buildMenuItem?: buildMenuItemFn
  children?: ReactNode
}
export interface postMenuHandler {
  activeMenu: Function
  setCurMenuItemList: Function
}

interface myMenuItem {
  name: string;
  value: string;
  icon?: JSX.Element
}

const PostMenu = memo(forwardRef<postMenuHandler, postMenuProp>(({ menuClick, buildMenuItem, children }, ref) => {
  const [menuProps, toggleMenu] = useMenuState({ unmountOnClose: false, transition: true })
  const [anchorPoint, setAnchorPoint] = useAtom(anchorPointAtom);
  const [curMenuItemList, setCurMenuItemList] = useState<myMenuItem[]>([])

  const menuClose = useCallback(() => {
    toggleMenu(false)
  }, [])

  const activeMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    buildMenuItem && buildMenuItem(setCurMenuItemList)
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true)
  }
  useImperativeHandle(ref, () => ({
    activeMenu,
    setCurMenuItemList
  }))
  return (
    <ControlledMenu {...menuProps} anchorPoint={anchorPoint} menuClassName={'bg-slate-700 text-slate-300'} onClose={menuClose} onItemClick={menuClick} reposition={'initial'} position={'initial'} >
      {curMenuItemList && curMenuItemList.length > 0 && curMenuItemList.map(e => <MenuItem className={menuClassName} value={e.value} ><>{e.icon}{e.name}</></MenuItem>)}
      {children}
    </ControlledMenu>
  )
}))

export default PostMenu