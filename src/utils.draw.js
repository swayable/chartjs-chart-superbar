export const drawLine = ({ ctx, width, color, startX, startY, endX, endY }) => {
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()
}

export const drawAnimatedLine = ({
  ctx,
  width,
  color,
  startX,
  startY,
  endX,
  endY,
  midX,
  midY,
  datum,
}) => {
  let diffX = 0,
    diffY = 2,
    midToStartY = midY,
    midToStartX = midX

  if (startY == midY) {
    diffX = 2
    diffY = 0
  }

  const animate = () => {
    ctx.beginPath()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(midX, midY)
    ctx.lineTo(midX - diffX, midY - diffY)
    ctx.stroke()
    ctx.moveTo(midToStartX, midToStartY)
    ctx.lineTo(midToStartX + diffX, midToStartY + diffY)
    ctx.stroke()
    midY = midY - diffY
    midX = midX - diffX

    midToStartY = midToStartY + diffY
    midToStartX = midToStartX + diffX
    if (midY > endY || midX > startX) {
      window.requestAnimationFrame(animate)
    } else datum._animate = false // disable further animations
  }

  setTimeout(animate, 1000)
}
