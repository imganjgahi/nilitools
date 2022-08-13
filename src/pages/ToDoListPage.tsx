import { Board } from '../component'
import { BoardStore } from '../context'

function ToDoListPage() {
    const store = BoardStore()
    return (
        <div className='toDoListPage'>
            <div className="pageTitle">
                To Do List Page
            </div>
            <p> {"DRAG: " + store.isDraging} </p>
            <div className="boards">
                {
                    store.boards.map(b => {
                        return <Board
                            id={b.id}
                            cards={store.cards.filter(x => x.boardId === b.id)}
                            onCardDropHandler={cardId => {
                                store.modifyCards(cardId, b.id)
                            }} />
                    })
                }
            </div>
        </div>
    )
}

export default ToDoListPage