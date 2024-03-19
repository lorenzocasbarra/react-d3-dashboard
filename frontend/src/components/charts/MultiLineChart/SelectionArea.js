export const SelectionArea = ({cursorPosition,mouseDown}) => {
  const x = mouseDown.x < cursorPosition.x ? mouseDown.x : cursorPosition.x
  const y = mouseDown.y < cursorPosition.y ? mouseDown.y : cursorPosition.y
  const width = mouseDown.x < cursorPosition.x ? (- mouseDown.x + cursorPosition.x):(+ mouseDown.x - cursorPosition.x)
  const height = mouseDown.y < cursorPosition.y ? (- mouseDown.y + cursorPosition.y):(+ mouseDown.y - cursorPosition.y)

  return(
    <rect
      key={"selection-box"}
      rx="4"
      ry="4"
      x={x}
      y={y}
      opacity="0.4"
      width={width}
      height={height}
    >
    </rect>)
}