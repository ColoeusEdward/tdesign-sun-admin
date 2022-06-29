import { useSize } from "ahooks";
import classNames from "classnames";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Button, Form, Input, Select, Skeleton, Textarea, TextareaValue, SubmitContext, Divider, SelectProps, FormRule } from "tdesign-react";
import FormItem from "tdesign-react/es/form/FormItem";
import Option from "tdesign-react/es/select/base/Option";

interface formItem {
  label: string,
  prop: string,
  type: string,
  opt?: { value: string, label: string }[]
  rules?: FormRule[]

}
export type IMyFormFormItem = formItem
type IMyFormWrapProp = {
  children?: ReactNode
  loading: boolean
  className?: string
  onValuesChange: (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void
  labelWidth?: string
  itemList?: formItem[]
  layout?: 'inline' | 'vertical'
  onSubmit: (context: SubmitContext) => void
}

const MyFormWrap: FC<IMyFormWrapProp & RefAttributes<unknown>> = forwardRef(({ children, labelWidth, loading, className, onValuesChange, itemList, layout, onSubmit }, ref) => {
  const formRef = useRef<any>(null)
  const [lineCount, setLineCount] = useState(1)
  const submit = (e: any) => {
    formRef.current.validate()
      .then((res: any) => { if (res !== true) throw res; return res })
      .then(() => {
        return onSubmit(e)
      })
      .then(() => {
        formRef.current?.reset()
      })
  }
  useImperativeHandle(ref, () => ({
    // cleanVal
  }))


  const fItems = useMemo(() => {
    const obj: any = {
      input: () => <Input clearable />,
      select: (e: formItem) => {
        return <Select placeholder={e.label} >
          {e.opt && e.opt.map(e => {
            return <Option key={e.label} label={e.label} value={e.value} />
          })}
        </Select>
      }
    }
    if (!itemList) return
    return itemList.map(e => {
      return (
        <FormItem label={e.label} name={e.prop} rules={e.rules}  >
          {obj[e.type] && obj[e.type](e)}
        </FormItem>
      )
    })
  }, [itemList])
  return (
    <Form className={'w-full h-full'} ref={formRef} layout={layout || 'vertical'} onSubmit={submit} labelWidth={labelWidth || 80} onValuesChange={onValuesChange}>
      {fItems}
      {children}
      <Divider></Divider>
      <div className={'flex justify-center'}>
        <Button className={' w-4/5'} loading={loading} shape="round" type="submit" >提 交</Button>
      </div>
    </Form>
  )

})

export default memo(MyFormWrap);

