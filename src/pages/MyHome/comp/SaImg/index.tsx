import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { SiPixiv } from "react-icons/si";
import { post_sa_image } from "services/nt";
import { Button, Input, InputValue, Row, Textarea, TextareaValue, Dialog } from "tdesign-react";
import TextareaToList from "../TextareaToList";
import request from 'utils/request';
import { sleep } from "utils/util";

type SaImgProp = {
  children?: ReactNode
  name: string
}

const SaImg: React.FC<SaImgProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')
  const [visible, setVisible] = useState<boolean>(false)
  // const ifRef = useRef<HTMLIFrameElement | null>(null)
  // const ifRefCallBack =  useCallback((node:any) => {
  //   console.log("🚀 ~ file: index.tsx:18 ~ ifRefCallBack ~ node", node)
  //   if(node && visible) {
  //     confirm(node)
  //   }
  // }, [visible]);

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    // if(e.key != 'Enter') return
    let file = ''
    let myWindow = window.open('', '_blank', 'width:100%,height:100%');
    const addCss = () => {
      var cssId = 'myCss';  // you could encode the css path itself to generate id..
      if (!myWindow!.document.getElementById(cssId)) {
        var head = myWindow!.document.getElementsByTagName('head')[0];
        var link = myWindow!.document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://saucenao.com/css/saucenao-new.css';
        link.media = 'all';
        head.appendChild(link);
      }
    }
    // let imgInput:HTMLInputElement = myWindow!.document.getElementById('urlInput') as HTMLInputElement
    // imgInput!.value = url as string

    myWindow!.focus();
    post_sa_image({ url: url as string }).then(res => {
      myWindow!.document.write(res) //info为html的字符串
      addCss()
      myWindow!.document.close()//必须关闭流，否则表单不生效
    })
    console.log("🚀 ~ file: index.tsx ~ line 20 ~ submit ~ file", file)

    // post_sa_image()
    // window.open(`https://www.google.com/searchbyimage?image_url=${url}`)
    setUrl('')
  }

  const confirm = () => {
    if (!url) return

    var iframe = document.getElementById("myIf") as HTMLIFrameElement;
    // console.log("🚀 ~ file: index.tsx:62 ~ confirm ~ iframe", iframe)

    // var iframe = ifRef.current as HTMLIFrameElement;
    let file = ''
    let myWindow = iframe.contentWindow;
    // console.log("🚀 ~ file: index.tsx:67 ~ confirm ~ myWindow", myWindow)
    const addCss = () => {
      var cssId = 'myCss';  // you could encode the css path itself to generate id..
      if (!myWindow!.document.getElementById(cssId)) {
        var head = myWindow!.document.getElementsByTagName('head')[0];
        var link = myWindow!.document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://saucenao.com/css/saucenao-new.css';
        link.media = 'all';
        head.appendChild(link);
      }
    }
    // let imgInput:HTMLInputElement = myWindow!.document.getElementById('urlInput') as HTMLInputElement
    // imgInput!.value = url as string

    // myWindow!.focus();
    post_sa_image({ url: url as string }).then(res => {
      myWindow!.document.write(res) //info为html的字符串
      addCss()
      myWindow!.document.close()//必须关闭流，否则表单不生效
    })
    console.log("🚀 ~ file: index.tsx ~ line 20 ~ submit ~ file", file)
    setUrl('')

  }

  useImperativeHandle(ref, () => ({

  }))

  // useEffect(() => {
  //   if(visible){

  //     confirm()
  //   }
  // },[visible])

  return (
    <div className={'h-full flex items-center'}  >
      {/* {children} */}

      <Row className="px-3 w-full"><Input prefixIcon={<SiPixiv />} type={'search'} onEnter={() => { setVisible(true) }} value={url} onChange={(e) => { setUrl(e) }} placeholder={'输入图片url'} clearable /></Row>
      <img src={url as string} width={'10px'} height={'10px'}  ></img>
      <Dialog visible={visible} width={'50%'} footer={false} onOpened={() => {
        sleep(50).then(() => {
          confirm()
        })
      }} closeOnOverlayClick={true} zIndex={10000} onCloseBtnClick={() => { setVisible(false) }} >
        <div style={{ height: '700px' }} className={'pt-6'}>
          <iframe id="myIf" src={''} className={'w-full h-full'}></iframe>
        </div>
      </Dialog>
    </div>
  )

})

export default memo(SaImg);