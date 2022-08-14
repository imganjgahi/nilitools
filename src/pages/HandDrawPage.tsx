import React, { useLayoutEffect, useRef, useState } from 'react'

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
    const [shapeType, setShapeType] = useState("triangle")
    const [selectedElement, setSelectedElement] = useState<shapeInterFace | null>(null)

    const ctx = useRef(null)
    useLayoutEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            ctx.current = (canvas as HTMLCanvasElement).getContext('2d');
            ctx.current.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            ctx.current.lineJoin = "round";
            ctx.current.lineCap = "round";
            ctx.current.lineWidth = 3;
            ctx.current?.clearRect(0, 0, canvas.width, canvas.height)
            elements.forEach(shape => {
                const { x1, y1, x2, y2, shapeType } = shape
                if (shapeType === 'clear') {
                    ctx.current?.clearRect(x1, y1, x2 - x1, y2 - y1);
                } else if (shapeType === 'rect') {
                    ctx.current?.strokeRect(x1, y1, x2 - x1, y2 - y1);
                } else if (shapeType === 'line') {
                    ctx.current?.beginPath();
                    ctx.current?.moveTo(x1, y1);
                    ctx.current?.lineTo(x2, y2);
                    ctx.current?.stroke();
                } else if (shapeType === 'circle') {
                    const radius = getDistance(x1, y1, x2, y2)
                    ctx.current?.beginPath();
                    ctx.current?.arc(x1, y1, radius, 0, 2 * Math.PI);
                    ctx.current?.stroke();
                } else if (shapeType === 'triangle') {
                    ctx.current?.beginPath();
                    ctx.current?.moveTo(x1, y1);
                    ctx.current?.lineTo(x2, y2);
                    ctx.current?.lineTo((x2 - (2 * (x2 - x1))), y2);
                    ctx.current?.closePath();
                    ctx.current?.stroke();
                }
            })
            // if(ctx) {
            //     ctx.fillStyle = "#FFCC00";
            // }
            // ctx?.fill();
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
                {
                    const minX = Math.min(x1, x2)
                    const maxX = Math.max(x1, x2)
                    const minY = Math.min(y1, y2)
                    const maxY = Math.max(y1, y2)
                    return x >= minX && x <= maxX && y >= minY && y <= maxY
                }
            case 'line':
                {
                    const a = { x: x1, y: y1 }
                    const b = { x: x2, y: y2 }
                    const c = { x, y }
                    const offset = distance(a, b) - (distance(a, c) + distance(b, c))
                    return Math.abs(offset) < 1
                }
            case 'circle':
                {
                    var dx = x - x1,
                        dy = y - y1,
                        dist = Math.sqrt(dx * dx + dy * dy);
                    return dist < getDistance(x1, y1, x2, y2)
                }
            case 'triangle':
                {
                    const a = { x: x1, y: y1 }
                    const b = { x: x2, y: y2 }
                    const c = { x, y }
                    return ((y <= y1 && y >= y2) || (y >= y1 && y <= y2)) && ((x <= x1 && x >= x2) || (x >= x1 && x <= x2))
                }
        }
    }
    function getElementAtPosition(x: number, y: number, elements: shapeInterFace[]) {
        return elements.find(el => isInBondry(x, y, el))
    }
    function handleMouseDown(e: any) {
        const { clientX, clientY } = e
        const ctxOffset = {
            x: e.target.getBoundingClientRect().left,
            y: e.target.getBoundingClientRect().top
        }
        if (shapeType === "clear") {
            setAction('clear')
        } else if (action === 'ready') {
            setAction('drawing')
            const newElement = createElement("id" + Date.now(), clientX - ctxOffset.x, clientY - ctxOffset.y, clientX - ctxOffset.x, clientY - ctxOffset.y, shapeType)
            setElements([...elements, newElement])
        } else {
            const element = getElementAtPosition(clientX - ctxOffset.x, clientY - ctxOffset.y, elements)
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
        const ctxOffset = {
            x: e.target.getBoundingClientRect().left,
            y: e.target.getBoundingClientRect().top
        }
        if (action === 'clear') {
            e.target.style.cursor = 'grabbing'
            const newElement = createElement("id" + Date.now(), clientX - 25, clientY - 25, clientX + 25, clientY + 25, shapeType)
            setElements([...elements, newElement])
        } else if (action === 'selection') {
            e.target.style.cursor = getElementAtPosition(clientX - ctxOffset.x, clientY - ctxOffset.y, elements) ? "move" : "default"
        } else if (action === 'ready') {
            e.target.style.cursor = 'crosshair'
        } else if (action === 'drawing') {
            const index = elements.length - 1
            // console.log(clientX, clientY)
            const { id, x1, y1, shapeType } = elements[index]
            updateElement(index, id, x1, y1, clientX - ctxOffset.x, clientY - ctxOffset.y, shapeType)
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
                <div className={shapeType === "triangle" ? "shape active" : "shape"} onClick={() => {
                    setAction('ready')
                    setShapeType('triangle')
                }}>Triangle</div>
                <div className={shapeType === "clear" ? "shape active" : "shape"} onClick={() => {
                    const newElement = createElement("id" + Date.now(), 0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, "clear")
                    setElements([...elements, newElement])
                }}>clear</div>
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
