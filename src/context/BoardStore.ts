import createStore from "zustand";

interface ICards {
    id: string
    title: string
    boardId: string
}
interface IState {
    boards: {
        id: string
        title: string
    }[]
    cards: ICards[]
    isDraging: string
    toggleIsDragning: (status: string) => void
    modifyCards: (cardId: string, boardId: string) => void
}
const BoardStore = createStore<IState>((set, get) => {
    return {
        boards: [
            {
                id: 'todoBorad',
                title: 'todoBorad',
            },
            {
                id: 'inProgressBorad',
                title: 'inProgressBorad',
            },
        ],
        cards: [
            {
                id: 'card1',
                boardId: 'todoBorad',
                title: 'Card 1'
            },
            {
                id: 'card2',
                boardId: 'todoBorad',
                title: 'Card 2'
            },
            {
                id: 'card4',
                boardId: 'todoBorad',
                title: 'Card 4'
            },
            {
                id: 'card3',
                boardId: 'inProgressBorad',
                title: 'Card 3'
            },
        ],
        isDraging: "",
        toggleIsDragning: (status: string) => {
            set({isDraging: status})
        },
        modifyCards: (cardId: string, boardId: string) => {
            set({ cards: get().cards.map(x => {
                if(x.id === cardId){ 
                    return {
                        ...x,
                        boardId
                    }
                }
                return x
            }) })
        }
    }
})

export default BoardStore