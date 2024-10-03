import './Navbar.css';
import React from 'react'
import PropTypes from 'prop-types'
import { FaBars } from "react-icons/fa"
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    return (
        <nav>
            <input type="checkbox" id='check' />
            <label htmlFor="check" className='checkbtn'>
                <FaBars />
            </label>
            <label htmlFor="#" className="logo">{props.title}</label>
            <ul>
                <li><Link to="/login" className="active">Sign in</Link></li>
                <li><a href="#">Sell/Donate</a></li>
            </ul>
        </nav>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired
}

Navbar.defaultProps = {
    title: 'Set title here'
}