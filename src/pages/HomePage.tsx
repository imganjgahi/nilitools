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
            </ul>
        </div>
    )
}

export default HomePage