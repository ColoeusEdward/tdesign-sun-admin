import { uniqueId } from 'lodash';
import KeepAlive from 'react-activation';
import { useParams } from 'react-router-dom';
export default function withKeepAlive(Component: any) {

  const KeepAliveComponent = () => {
    let { id } = useParams()
    const pr: Record<string, string> = {}
    id && (pr.id = id)
    return (
      <KeepAlive  {...pr} >
        <Component />
      </KeepAlive>
    );
  }
  return KeepAliveComponent;
}