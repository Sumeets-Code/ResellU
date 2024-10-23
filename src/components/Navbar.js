import './Navbar.css';
import React from 'react';
import PropTypes from 'prop-types';
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

export default function Navbar(props) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSignInClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleSellButton = () => {
        if (isAuthenticated) {
            navigate('/sell');
        } else {
            navigate('/login');
        }
    }

    return (
        <header>
            <nav>
                <input type="checkbox" id='check' />
                <label htmlFor="check" className='checkbtn'>
                    <FaBars />
                </label>
                <Link to="/" className="logo">
                    {props.title}
                </Link>
                {/* <div class="search-bar">
                    <input type="text" placeholder="Search Amazon" />
                    <button>Search</button>
                </div> */}
                <ul>
                    <li>
                        <a href="#" onClick={handleSignInClick} className="active">
                            {isAuthenticated ? 'Profile' : 'Sign in'}
                        </a>
                        {/* Update the sign-in link to a button for handling click */}
                    </li>
                    <li><a href="#" onClick={handleSellButton}>Sell/Donate</a></li>
                </ul>
            </nav>
        </header>
    );
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
    title: 'Set title here',
};