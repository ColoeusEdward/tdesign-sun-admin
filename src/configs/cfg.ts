

// export const messageOpt = {
//   className:'msg-animation-active rounded-md',
//   // onDurationEnd:() => {

//   // },
//   // onCloseBtnClick:() => {

//   // }
// }

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