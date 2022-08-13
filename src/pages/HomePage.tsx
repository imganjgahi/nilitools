import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>

            <ul>
        <li>
            <Link to="/draw">Draw</Link>
        </li>
        <li>
            <Link to="/chart">Chart</Link>
        </li>
        <li>
            <Link to="/todo">ToDo Page</Link>
        </li>
            </ul>
        </div>
    )
}

export default HomePage