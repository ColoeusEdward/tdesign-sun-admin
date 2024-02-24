export const browserGadioPlayFirst = (view:any,data:any) => { 
  // audio.currentTime = ${data.time} 
  view.webContents.executeJavaScript(`
  var sleep = (ms) => {
    return new Promise((reslove) => {
      setTimeout(reslove, ms)
    })
  }
    var audio = document.querySelector('audio');
    audio.playbackRate = 1.75
    document.querySelector('.gpf_controls_play.gpf_controls_circle').click()
  `)

}

export const browserGadioPlay = (view:any) => { 
  view.webContents.executeJavaScript(`
    var audio = document.querySelector('audio');
    if(audio.paused){
      var loopState = true
      document.querySelector('.gpf_controls_play.gpf_controls_circle').click()
    }else{
      var loopState = false
      document.querySelector('.gpf_controls_play.gpf_controls_circle').click()
    }
  `)
}
export const setLoopState = (view:any,state:string) =>{
  view.webContents.executeJavaScript(`
    var loopState = ${state}
  `)
}
export const loopSavePlayLog = (view:any) => {
  view.webContents.executeJavaScript(`
  var audio = document.querySelector('audio');
  var loopState = true
  const loop = ()=>{
    sleep(2000).then(()=>{
      if(loopState){
        window.ipc.send('broSavePlayLog',audio.currentTime)
      }
      loop() 
    })
  }
  loop()
`)
}

export const sleep = (ms: number) => {
  return new Promise((reslove) => {
    setTimeout(reslove, ms)
  })
}