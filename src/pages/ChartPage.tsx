import React, { useEffect } from 'react'

interface IUnit {
    id: string;
    title: string;
    parentId: string;
    step?: number;
    index?: number;
    xPos?: number;
    yPos?: number;
}
function ChartPage() {
    const chart: IUnit[] = [
        {
            id: "1",
            title: "unit 1",
            parentId: ""
        },
        {
            id: "2",
            title: "unit 2",
            parentId: "1"
        },
        {
            id: "3",
            title: "unit 3",
            parentId: "1"
        },
        {
            id: "4",
            title: "unit 4",
            parentId: "2"
        },
        {
            id: "5",
            title: "unit 5",
            parentId: "4"
        },
        {
            id: "6",
            title: "unit 6",
            parentId: "4"
        },
        {
            id: "7",
            title: "unit 7",
            parentId: "2"
        },
        {
            id: "8",
            title: "unit 8",
            parentId: "5"
        },
        {
            id: "9",
            title: "unit 9",
            parentId: "8"
        },
        {
            id: "10",
            title: "unit 10",
            parentId: "9"
        },
        {
            id: "11",
            title: "unit 11",
            parentId: "2"
        },
        {
            id: "12",
            title: "unit 12",
            parentId: "11"
        },
    ]
    const unitWidth = 130
    const unitHeight = 30
    const xGap = 30
    const yGap = 30
    // function createUnit(unit) {
    //     const chart = document.querySelector('.chart')
    //     const el = document.createElement('div')
    //     el.id = unit.id
    //     el.className = "chartUnit"
    //     el.style.left = ((chart.clientWidth / 2) - (unitWidth / 2) + (unit.x || 0)) + "px"
    //     el.style.top = (20 + (unit.y || 0)) + "px"
    //     el.style.width = unitWidth + "px"
    //     el.style.height = unitHeight + "px"
    //     console.log("EL :", (chart.clientWidth / 2) + (unit.x || 0))
    //     chart.appendChild(el)
    // }
    
    function generateTree(parentId = "", step = 1) {
        const result = chart.filter(x => x.parentId === parentId).map((unit, index) => ({
            ...unit,
            step,
            index: index + 1,
            children: []
        }))
        result.forEach(item => {
            if( chart.some(x => x.parentId === item.id) ) {
                item.children = generateTree(item.id, step+1)
            }
        })
        return result
    }
    
    function extractUnits(units, tree) {
        units.forEach(item => {
            const targetIndex = tree.findIndex(x => x.id === item.id)
            if(targetIndex > -1) {
                tree[targetIndex] = {
                    ...item
                }
                if(item.children) {
                    extractUnits(item.children, tree)
                }
            }
        })
        return tree
    }
    
    function setPosition(tree: IUnit[], levels: any[]) {
        let treeStep = 0
        let calculateLevels = 1
        for (let i = treeStep; i < levels.length; i++) {
            const roots = tree.filter(x => x.step === levels[i].i)
            let xBase = roots.length === 1 ? 0 : roots.length === 2 ? -.5 : -(roots.length / 2)
            roots.forEach((u, uIndex) => {
                const targetIndex = tree.findIndex(x => x.id === u.id)
                tree[targetIndex].xPos =  xBase + (uIndex * 1.5)
                tree[targetIndex].yPos = i + 1
            })
            calculateLevels++
            if(calculateLevels < levels.length) {
                treeStep = 0
            }
        }

        console.log("POSITION: ", tree.sort((a, b) => a.step - b.step).map(x => ({
            id: (x.id+'-'+x.parentId),
            // p: x.parentId,
            x: x.xPos,
            y: x.yPos
        })))
    }
    // https://integrtr.com/building-diagram-tool-with-canvas-react/
    function itrateChart() {
        const tree = generateTree()
        const updadatedList = extractUnits(tree, JSON.parse(JSON.stringify(chart)))
        const maxStep = updadatedList.reduce(function(a, b) {
            return a.step > b.step ? a : b;
        }).step;
        const maxIndex = updadatedList.reduce(function(a, b) {
            return a.index > b.index ? a : b;
        }).index;
        const levels = []
        for (let i = 1; i <= maxStep; i++) {
            levels.push({i, l: updadatedList.filter(x => x.step === i).length})
        }
        // console.log("TREE: ", tree)
        // console.log("MAX: ", maxStep, maxIndex)
        console.log("LIST: ", updadatedList)
        console.log("levels: ", levels)
        setPosition(updadatedList, levels)
    }

    useEffect(() => {
        itrateChart()
    }, [])
  return (
    <div>
        <div className="pageTitle">ChartPage</div>
        <div className="chart"></div>
    </div>
  )
}

export default ChartPage