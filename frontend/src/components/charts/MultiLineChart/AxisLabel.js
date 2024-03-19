import {useEffect, useState} from "react"
export const AxisLabel = ({text,boundries,type,width,height}) => {

  const [rotation,setRotation] = useState("")
  const [translation,setTranslation] = useState("")
  const [x,setX] = useState(0)
  const [y,setY] = useState(0)

  useEffect(() =>{
    setRotation(type === "y" ? "rotate(-90)" : "")
    setTranslation(type === "y" ? `translate(-358,400)` : "")
    setX(type === "y" ? (width / 2 + 5) : (width / 2 + 10))
    setY(type === "y" ? height : (height - 5))
  },[width,height])

  return (
    <g transform={translation}>
      <text transform={rotation}  x={x} y={y} textAnchor="end">{text}</text>
    </g>
  )
}