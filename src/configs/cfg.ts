

// export const messageOpt = {
//   className:'msg-animation-active rounded-md',
//   // onDurationEnd:() => {

//   // },
//   // onCloseBtnClick:() => {

//   // }
// }

const env = import.meta.env.MODE || 'development';
export const config = {
  // root: '/site/sun/',
  // root:'/'
  wsUrl: 'wss://'+ ((env=='development'|| env=='electron') ? 'meamoe.one' :  window.location.host)
}

export const getMsgOpt = (dur=3000) => {
  return {
    offset:[0,0],
    className:'msg-animation-active  rounded-md',
    duration:dur, 
    style:{
      animationDuration:`${dur/1000}s`
    }
  }
}