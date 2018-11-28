export const drawLine = ({ ctx, width, color, startX, startY, endX, endY }) => {
  ctx.save()

  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  ctx.restore()
}
