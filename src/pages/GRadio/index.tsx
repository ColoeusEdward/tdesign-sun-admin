import withKeepAlive from "hooks/withKeepAlive";
import { forwardRef, ReactNode, useState } from "react";
import { Button } from "tdesign-react";


type IGRadioProp = {
  children?: ReactNode
  name: string,

}
const GRadio: React.FC<IGRadioProp> = forwardRef(({ children }, ref) => {
  const [isFull, setIsFull] = useState<boolean>(false)
  const [url, setUrl] = useState('https://www.gcores.com/radios')
  const test = () => {
    setUrl('https://www.baidu.com')
  }
  
  return (
    <div className={'h-full w-full flex-col items-center justify-center pt-1 bg-[#181818] ' + (isFull ? 'absolute top-0 left-0 w-screen h-screen z-[250]' : 'relative')} style={{ height: !isFull ? 'calc(100vh - 64px)' : '100vh' }} >
      <div className=" h-10">
        <Button onClick={test}>test</Button>
      </div>
      <div className="h-full flex-shrink">
        <iframe className="w-full h-full" src={url} />
      </div>
    </div>
  );
});

export default withKeepAlive(GRadio);
