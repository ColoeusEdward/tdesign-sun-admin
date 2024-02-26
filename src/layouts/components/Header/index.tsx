import React, { memo } from 'react';
import { Layout, Button, Row, Col } from 'tdesign-react';
import { CdIcon, RefreshIcon, ToolsIcon, ViewListIcon } from 'tdesign-icons-react';
import { useAppDispatch, useAppSelector } from 'modules/store';
import { selectGlobal, toggleMenu } from 'modules/global';
import HeaderIcon from './HeaderIcon';
import { HeaderMenu } from '../Menu';
import Search from './Search';
import Style from './index.module.less';
import { useAtom } from 'jotai';
import { radioBroFastInitCountAtom, radioFastInitCountAtom } from 'jtStore/home';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImRadioChecked } from 'react-icons/im';
import { TbRadioactiveOff } from 'react-icons/tb';
import { RiSpeedLine } from 'react-icons/ri';

const { Header } = Layout;

export default memo((props: { showMenu?: boolean }) => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const location = useLocation()
  const [, setFastCount] = useAtom(radioFastInitCountAtom)
  const [, setBroFastCount] = useAtom(radioBroFastInitCountAtom)

  if (!globalState.showHeader) {
    return null;
  }
  const invokeDevTool = () => {
    window.ipc.send('devTools', 'open');
  }
  const fastOpenRadio = () => {
    if (location.pathname != '/radio') {
      navigate('/radio')
    }
    setFastCount((val) => {

      return val + 1;
    })
  }

  const openGadioBro = () => {
    // 
    if (location.pathname != '/radio') {
      navigate('/radio')
    }
    setBroFastCount((val) => {
      return val + 1;
    })
  }

  const closeGadioBro = () => {
    window.ipc.send('closeGadioBro')
  }
  const setPlaySpeed = () => {
    window.ipc.send('setPlaySpeed')
  }

  let HeaderLeft;
  if (props.showMenu) {
    HeaderLeft = (
      <div>
        <HeaderMenu />
      </div>
    );
  } else {
    HeaderLeft = (
      <Row gutter={16} align='middle'>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={() => dispatch(toggleMenu(null))}>
            <ViewListIcon />
          </Button>
        </Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={() => window.location.reload()}>
            <RefreshIcon />
          </Button>
          {/* <Search /> */}
        </Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={invokeDevTool}>
            <ToolsIcon />
          </Button>
          {/* <Search /> */}
        </Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={fastOpenRadio}>
            <CdIcon />
          </Button>
          {/* <Search /> */}
        </Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={openGadioBro}>
            <ImRadioChecked />
          </Button>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={setPlaySpeed}>
            <RiSpeedLine />
          </Button>
        </Col>
        <Col>
          <Button className={'noElectronDrag'} shape='square' size='large' variant='text' onClick={closeGadioBro}>
            <TbRadioactiveOff />
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Header className={Style.panel}>
      {HeaderLeft}
      <HeaderIcon />
    </Header>
  );
});
