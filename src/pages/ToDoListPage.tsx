import { Board } from '../component'
import { BoardStore } from '../context'

function ToDoListPage() {
    const boardStore = BoardStore()

    const { boards, cards, modifyCards } = boardStore
    return (
        <div className='rootPage toDoListPage'>
            <div className="pageTitle">
                To Do List Page
            </div>
            <div className="boards">
                {
                    boards.map(b => {
                        return <Board
                            id={b.id}
                            cards={cards.filter(x => x.boardId === b.id)}
                            onCardDropHandler={cardId => {
                                modifyCards(cardId, b.id)
                            }} />
                    })
                }
            </div>
        </div>
    )
}

export default ToDoListPage