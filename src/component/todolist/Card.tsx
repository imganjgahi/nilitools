import React from 'react'

interface IProps {
    id: string
    title: string
}
function Card({
    id,
    title
}: IProps) {

    function dragStartHandler(e: any) {
        const target = e.target
        e.dataTransfer.setData('card_id', target.id)
        console.log("ID: ", target.id)
        setTimeout(() => {
            target.style.display = 'none'
        }, 0);
        
    }
    function dragOverHandler(e: any) {
        e.stopPropagation()
        
    }
  return (
    <div
    draggable={true}
    className='todoCard'
    id={id}
    onDragStart={dragStartHandler}
    onDragOver={dragOverHandler}
    onDragEnd={e => e.currentTarget.style.display = 'block'}
    >
        {title}
    </div>
  )
}

export default Card