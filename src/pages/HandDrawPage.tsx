import React, { useLayoutEffect, useState } from 'react'

interface shapeInterFace {
    id: string
    x1: number
    y1: number
    x2: number
    y2: number
    offsetX?: number
    offsetY?: number
    shapeType: string
}
function HandDrawPage() {
    const [action, setAction] = useState('ready')
    const [elements, setElements] = useState<shapeInterFace[]>([])
    const [shapeType, setShapeType] = useState("line")
    const [selectedElement, setSelectedElement] = useState<shapeInterFace | null>(null)


    useLayoutEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const ctx = (canvas as HTMLCanvasElement).getContext('2d');
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = 3;
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            elements.forEach(shape => {
                const { x1, y1, x2, y2, shapeType } = shape
                if (shapeType === 'clear') {
                    ctx?.clearRect(x1, y1, x2 - x1, y2 - y1);
                } else if (shapeType === 'rect') {
                    ctx?.strokeRect(x1, y1, x2 - x1, y2 - y1);
                } else if (shapeType === 'line') {
                    ctx?.beginPath();
                    ctx?.moveTo(x1, y1);
                    ctx?.lineTo(x2, y2);
                    ctx?.stroke();
                } else if (shapeType === 'circle') {
                    const radius = getDistance(x1, y1, x2, y2)
                    ctx?.beginPath();
                    ctx?.arc(x1, y1, radius, 0, 2 * Math.PI);
                    ctx?.stroke();
                } else if (shapeType === 'triangle') {
                    const radius = getDistance(x1, y1, x2, y2)
                    ctx?.beginPath();
                    ctx?.arc(x1, y1, radius, 0, 2 * Math.PI);
                    ctx?.stroke();
                }
            })
            // if(ctx) {
            //     ctx.fillStyle = "#FFCC00";
            // }
            // ctx?.fill();
            ctx?.beginPath();
            ctx?.moveTo(100, 100);
            ctx?.lineTo(100, 300);
            ctx?.lineTo(300, 300);
            ctx?.closePath();
            ctx?.stroke();
            // ctx?.strokeRect(10, 10, 150, 100);
            // ctx?.beginPath();       // Start a new path
            // ctx?.moveTo(30, 50);    // Move the pen to (30, 50)
            // ctx?.lineTo(150, 100);  // Draw a line to (150, 100)
            // ctx?.stroke();
        }

    })

    function updateElement(index: number, id: string, x1: number, y1: number, x2: number, y2: number, type: string) {
        const updatedElement = createElement(id, x1, y1, x2, y2, type)
        const elementsCopy = [...elements]
        elementsCopy[index] = updatedElement
        setElements([...elementsCopy])
    }

    // function updateElement(index: number, x:number, y:number) {
    //     const updatedElement = createElement(elements[index].id, elements[index].x1, elements[index].y1, x, y, elements[index].shapeType)
    //     const elementsCopy = [...elements]
    //     elementsCopy[index] = updatedElement
    //     setElements([...elementsCopy])
    // }
    function getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number) {
        return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2))
    }

    function createElement(id: string, x1: number, y1: number, x2: number, y2: number, type: string) {
        return { id, x1, y1, x2, y2, shapeType: type }
    }

    function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }
    function isInBondry(x: number, y: number, element: shapeInterFace) {
        const { shapeType, x1, y1, x2, y2 } = element
        switch (shapeType) {
            case 'rect':
                const minX = Math.min(x1, x2)
                const maxX = Math.max(x1, x2)
                const minY = Math.min(y1, y2)
                const maxY = Math.max(y1, y2)
                return x >= minX && x <= maxX && y >= minY && y <= maxY
            case 'line':
                const a = { x: x1, y: y1 }
                const b = { x: x2, y: y2 }
                const c = { x, y }
                const offset = distance(a, b) - (distance(a, c) + distance(b, c))
                return Math.abs(offset) < 1
            case 'circle':
                break
        }
    }
    function getElementAtPosition(x: number, y: number, elements: shapeInterFace[]) {
        return elements.find(el => isInBondry(x, y, el))
    }
    function handleMouseDown(e: any) {
        const { clientX, clientY } = e
        if(shapeType === "clear") {
            setAction('clear')
        } else if (action === 'ready') {
            setAction('drawing')
            const newElement = createElement("id" + Date.now(), clientX, clientY, clientX, clientY, shapeType)
            setElements([...elements, newElement])
        } else {
            const element = getElementAtPosition(clientX, clientY, elements)
            if (element) {
                const offsetX = clientX - element.x1
                const offsetY = clientY - element.y1
                setSelectedElement({
                    ...element,
                    offsetX,
                    offsetY
                })
                setAction('moving')
            }
        }
    }
    console.log('State: ', action)
    function handleMouseMove(e: any) {
        const { clientX, clientY } = e
        if(action === 'clear') {
            e.target.style.cursor = 'grabbing'
            const newElement = createElement("id" + Date.now(), clientX - 25, clientY - 25, clientX + 25, clientY + 25, shapeType)
            setElements([...elements, newElement])
        } else if (action === 'selection') {
            e.target.style.cursor = getElementAtPosition(clientX, clientY, elements) ? "move" : "default"
        } else if (action === 'ready') {
            e.target.style.cursor = 'crosshair'
        } else if (action === 'drawing') {
            const index = elements.length - 1
            // console.log(clientX, clientY)
            const { id, x1, y1, shapeType } = elements[index]
            updateElement(index, id, x1, y1, clientX, clientY, shapeType)
        } else if (action === 'moving' && selectedElement) {
            const { id, offsetX, offsetY, } = selectedElement
            const index = elements.findIndex(x => x.id === id)
            if (index > -1) {
                const { id, x1, y1, x2, y2, shapeType } = elements[index]
                const width = x2 - x1
                const height = y2 - y1
                const newX = clientX - (offsetX as number)
                const newY = clientY - (offsetY as number)
                // updateElement(index, id, newX, newY, newX + width, newY + height, shapeType)
                updateElement(index, id, newX, newY, newX + width, newY + height, shapeType)
            }
        }

    }
    function handleMouseUp(e: any) {
        e.target.style.cursor = 'default'
        if (action === 'moving') {
            setAction('selection')
        } else if (action !== 'selection') {
            e.target.style.cursor = 'crosshair'
            setAction('ready')
            setSelectedElement(null)
        }
    }

    return (
        <div>
            <div className="shapePanel">
                <div className={action === "selection" ? "shape active" : "shape"} onClick={() => {
                    setAction('selection')
                    setShapeType("")
                }}>Select Items</div>
                <div className={shapeType === "line" ? "shape active" : "shape"} onClick={() => {
                    setAction('ready')
                    setShapeType('line')
                }}>Line</div>
                <div className={shapeType === "rect" ? "shape active" : "shape"} onClick={() => {
                    setAction('ready')
                    setShapeType('rect')
                }}>Rectangle</div>
                <div className={shapeType === "circle" ? "shape active" : "shape"} onClick={() => {
                    setAction('ready')
                    setShapeType('circle')
                }}>Circle</div>
                <div className={shapeType === "clear" ? "shape active" : "shape"} onClick={() => {
                    setAction('ready')
                    setShapeType('clear')
                }}>Clear</div>
            </div>
            <canvas
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >canvas</canvas>
        </div>
    )
}

export default HandDrawPage
