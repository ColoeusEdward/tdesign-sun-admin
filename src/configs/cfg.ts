

// export const messageOpt = {
//   className:'msg-animation-active rounded-md',
//   // onDurationEnd:() => {

//   // },
//   // onCloseBtnClick:() => {

//   // }
// }

export const getMsgOpt = (dur=3000) => {
  return {
    className:'msg-animation-active  rounded-md',
    style:{
      animationDuration:`${dur/1000}s`
    }
  }
}