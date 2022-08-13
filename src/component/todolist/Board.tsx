import React from 'react'
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

    function dropHandler(e: any) {
        e.preventDefault()
        const card_id = e.dataTransfer.getData('card_id')
        // const card: HTMLElement = document.getElementById(card_id)
        // console.log("CARD: ", card)
        // card.style.display = 'block'
        // e.target.appendChild(card)
        onCardDropHandler(card_id)
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
            title={c.title} />
        })}
    </div>
  )
}

export default Board