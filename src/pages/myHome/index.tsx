import React, { memo, useEffect, useState } from 'react';
import { Button } from 'tdesign-react';
import { CheckCircleIcon } from 'tdesign-icons-react';
import { useParams } from 'react-router-dom';
import withKeepAlive from 'hooks/withKeepAlive';
import GridLayout from "react-grid-layout";

const MyHome = () => {
  const [num, setNum] = useState(0)
  let { id } = useParams()
  useEffect(() => {
    // console.log(`ee`,);

    // clear()
  }, [])
  return (
    <div className={'w-full text-cyan-100 text-lg'} style={{ minHeight: '320px' }} >
      <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
        <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2, static: true }}>
          a
        </div>
        <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>
          b
        </div>
        <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }}>
          c
        </div>
      </GridLayout>
    </div>
  );
}

export default memo(withKeepAlive(MyHome));
