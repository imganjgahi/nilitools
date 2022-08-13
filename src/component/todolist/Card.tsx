import React, { useState } from 'react'
import { BoardStore } from '../../context'

interface IProps {
    id: string
    title: string
    data: any
}
function Card({
    id,
    title,
    data
}: IProps) {

    const store = BoardStore()
    const [diff, setDiff] = useState(null)
    const [pos, setPos] = useState(null)

    function dragStartHandler(e: any) {
        const target = e.target
        e.dataTransfer.setData('card_id', target.id)
        // e.dataTransfer.setDragImage(new Image(), 0, 0);
        // e.preventDefault()
        console.log("ID: ", target.id)
        setTimeout(() => {
            // target.style.display = 'none'
            store.toggleIsDragning(id)
        }, 10);
    }
    function dragOverHandler(e: any) {
        // e.stopPropagation()
    }

    return (
        <div
            draggable={true}
            className='todoCard'
            id={id}
            onDragStart={dragStartHandler}
            onDragOver={dragOverHandler}
            onDragEnd={e => {
                store.toggleIsDragning("")
                e.currentTarget.style.display = 'block'
            }}
        >
            {title}
        </div>
    )
}

export default Card