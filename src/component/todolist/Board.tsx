import React from 'react'
import { BoardStore } from '../../context'
import Card from './Card'

interface IProps {
    id: string
    onCardDropHandler: (cardId: string) => void
    cards: {
        id: string
        title: string
    }[]
}
function Board({
    id,
    onCardDropHandler,
    cards,
}: IProps) {
    const store = BoardStore()
    function dropHandler(e: any) {
        e.preventDefault()
        const card_id = e.dataTransfer.getData('card_id')
        // const card: HTMLElement = document.getElementById(card_id)
        // console.log("CARD: ", card)
        // card.style.display = 'block'
        // e.target.appendChild(card)
        store.modifyCards(card_id, id)
        store.toggleIsDragning("")
    }

    function dragOverHandler(e: any) {
        e.preventDefault()
    }
    return (
        <div
            className='todoBorad'
            id={id}
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
        >
            {cards.map(c => {
                return <Card
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    data={c} />
            })}
        </div>
    )
}

export default Board