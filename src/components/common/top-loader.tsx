import React, { forwardRef, useImperativeHandle } from 'react'
import LoadingBar from 'react-top-loading-bar'

export interface TopLoaderRef {
  start: () => void
  complete: () => void
  progress: (progress: number) => void
}

const TopLoader = forwardRef<TopLoaderRef>((props, ref) => {
  const [progress, setProgress] = React.useState(0)

  useImperativeHandle(ref, () => ({
    start: () => setProgress(30),
    complete: () => setProgress(100),
    progress: (value: number) => setProgress(value)
  }))

  return (
    <LoadingBar
      color='#29d'
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
      height={3}
      shadow={true}
    />
  )
})

TopLoader.displayName = 'TopLoader'

export default TopLoader
