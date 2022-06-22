import MySkeleton from "components/MySkeleton";
import MyUploader from "components/MyUploader/MyUploader";
import { MacScrollbar } from "mac-scrollbar";
import { ElementRef, forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState, RefAttributes, useEffect } from "react";
import { Drawer, Pagination } from "tdesign-react";
import { TdUploadFile } from "tdesign-react/es/upload/types";
import { postData } from 'types/index'
import { isLowResolution } from "utils/util";

type IPostProp = {
  curItem: postData | undefined
}
interface PostHandle {
  show: () => void
}
const Post: React.FC<IPostProp & RefAttributes<PostHandle>> = forwardRef(({ curItem }, ref) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const show = () => {
    setVisible(true)
  }
  const hide = useCallback(() => {
    setVisible(false)
  }, [])
  const getData = () => {
    console.log(`getdata`,);
  }
  const curPageChange = () => {

  }
  const submit = useCallback(() => {

  }, [])

  useEffect(() => {
    getData()
  }, [curItem])

  useImperativeHandle(ref, () => ({
    // compClick
    show
  }))
  const renderRow = () => {
    return (
      <div></div>
    )
  }
  const renderBody = () => {

    return (
      <MySkeleton loading={loading}>
        <MacScrollbar skin={'dark'} className={'w-full h-full'} >
          {renderRow()}
        </MacScrollbar>
      </MySkeleton>
    )
  }
  const renderFooter = () => {
    return (
      <Pagination
        total={10}
        defaultPageSize={30}
        onCurrentChange={curPageChange}
        showPageSize={false}
      />
    )
  }

  return (
    <Drawer
      header={curItem?.title}
      body={renderBody()}
      footer={renderFooter()}
      visible={visible}
      onClose={hide}
      size={isLowResolution() ? '90vw' : '700px'}
    >
    </Drawer>
  )

})

export default memo(Post);