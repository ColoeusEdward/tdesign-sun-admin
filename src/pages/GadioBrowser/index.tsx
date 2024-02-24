import MySkeleton from "components/MySkeleton";

import { ElementRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Style from './index.module.less'
import { useAtom } from "jotai";
import { bookAtom } from "jtStore/book";
import withKeepAlive from "hooks/withKeepAlive";


type IGradioBrowserProp = {
  rowClick: Function
  curUrlRef: React.MutableRefObject<string>
}

const GradioBrowser: React.FC = () => {


  useEffect(() => {

  }, [])


  return (
    <div>
      
    </div>
  )
}

export default withKeepAlive(memo(GradioBrowser));