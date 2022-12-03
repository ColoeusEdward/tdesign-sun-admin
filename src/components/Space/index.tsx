import { useSize } from "ahooks";
import classNames from "classnames";
import { CSSProperties, FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Skeleton, Textarea, TextareaValue } from "tdesign-react";

type ISpaceProp = {
  children: ReactNode[]
  align?: 'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-end' | 'flex-start'
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  inline?: boolean
  vertical?: boolean
  size?: number | [number, number]     //水平垂直间距大小
  itemStyle?: string | CSSProperties
  wrap?: boolean                       //换行
  rtlEnable?: boolean                  //从右至左显示
  height?: string                      //手动设定高度
}

const Space: FC<ISpaceProp> = ({ children, ...props }) => {
  const conRef = useRef(null)
  const lastIndex = children.length  - 1
  const isJustifySpace = props.justify!.startsWith('space-')
  const margin = useMemo(() => {
    const { size } = props
    if (Array.isArray(size)) {
      return {
        horizontal: size[0],
        vertical: size[1]
      }
    }
    if (typeof size === 'number') {
      return {
        horizontal: size,
        vertical: size
      }
    }
  }, [props.size])
  let horizontalMargin = `${margin!.horizontal}px`
  let semiHorizontalMargin = `${margin!.horizontal / 2}px`
  let verticalMargin = `${margin!.vertical}px`
  let semiVerticalMargin = `${margin!.vertical / 2}px`

  const buildStyle = (index: number) => {
    let obj = {}
    let list = [
      props.itemStyle,
      {
        maxWidth: '100%'
      },
      props.vertical
        ? {
          marginBottom: index !== lastIndex ? verticalMargin : ''
        }
        : props.rtlEnable
          ? {
            marginLeft: isJustifySpace
              ? props.justify === 'space-between' && index === lastIndex
                ? ''
                : semiHorizontalMargin
              : index !== lastIndex
                ? horizontalMargin
                : '',
            marginRight: isJustifySpace
              ? props.justify === 'space-between' && index === 0
                ? ''
                : semiHorizontalMargin
              : '',
            paddingTop: semiVerticalMargin,
            paddingBottom: semiVerticalMargin
          }
          : {
            marginRight: isJustifySpace
              ? props.justify === 'space-between' && index === lastIndex
                ? ''
                : semiHorizontalMargin
              : index !== lastIndex
                ? horizontalMargin
                : '',
            marginLeft: isJustifySpace
              ? props.justify === 'space-between' && index === 0
                ? ''
                : semiHorizontalMargin
              : '',
            paddingTop: semiVerticalMargin,
            paddingBottom: semiVerticalMargin
          }
    ]
    list.forEach(e => {
      Object.assign(obj, e)
    })
    return obj
  }
  useEffect(() => {

  }, [])
  return (
    <div className={'h-full'} ref={conRef}
      style={{
        display: props.inline ? 'inline-flex' : 'flex',
        flexDirection: props.vertical ? 'column' : 'row',
        justifyContent: ['start', 'end'].includes(props.justify!)
          ? 'flex-' + props.justify
          : props.justify,
        flexWrap: !props.wrap || props.vertical ? 'nowrap' : 'wrap',
        marginTop: props.vertical ? '' : `-${semiVerticalMargin}`,
        marginBottom: props.vertical ? '' : `-${semiVerticalMargin}`,
        alignItems: props.align,
        height: props.height || ''
      }} >
      {children.map((child, index) => {
        return (
          <div style={buildStyle(index)} key={index}>
            {child}
          </div>
        )
      })}
    </div>
  )

}

Space.defaultProps = {
  justify: 'start'
  , size: 10
  , wrap: true
  , rtlEnable: false
  , align: 'start'
}

export default memo(Space);