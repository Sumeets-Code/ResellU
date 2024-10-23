import './LogReg.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../authContext';

const LogReg = () => {
    const { setIsAuthenticated, login } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpNGOChecked, setSignUpNGOChecked] = useState(false);
    const [signInNGOChecked, setSignInNGOChecked] = useState(false);
    const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '' });
    const [signInForm, setSignInForm] = useState({ email: '', password: '' });

    const navigate = useNavigate();

    const handleSignUp = () => {
        setIsSignUp(true);
    };

    const handleSignIn = () => {
        setIsSignUp(false);
    };

    const handleSignUpNGOChange = () => {
        setSignUpNGOChecked(!signUpNGOChecked);
    };

    const handleSignInNGOChange = () => {
        setSignInNGOChecked(!signInNGOChecked);
    };

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        console.log('Sign Up NGO Checked:', signUpNGOChecked);
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                name: signUpForm.name,
                email: signUpForm.email,
                password: signUpForm.password,
                isNGO: signUpNGOChecked
            });

            if (response.data.success) {
                alert(response.data.message);
                login({ name: signUpForm.name, email: signUpForm.email });
                setIsAuthenticated(true);
                navigate('/profile');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Error signing up. Please try again later.');
            }
        }
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        console.log('Sign In NGO Checked:', signInNGOChecked);
        try {
            const response = await axios.post('http://localhost:5000/signin', {
                email: signInForm.email,
                password: signInForm.password,
                isNGO: signInNGOChecked,
            });

            if (response.data.success) {
                alert(response.data.message);
                setIsAuthenticated(true);
                login({ ...response.data.user, isNGO: signInNGOChecked });
                navigate('/profile');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error signing in');
        }
    };

    return (
        <div className="box">
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUpSubmit}>
                        <h1>Create Account</h1>
                        <div className="checkbox-wrapper-4">
                            <input
                                className="inp-cbx"
                                id="signUpNGO"
                                type="checkbox"
                                checked={signUpNGOChecked}
                                onChange={handleSignUpNGOChange}
                            />
                            <label className="cbx" htmlFor="signUpNGO">
                                <span>
                                    <svg width="12px" height="10px"></svg>
                                </span>
                                <span>NGO</span>
                            </label>
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder={signUpNGOChecked ? "NGO Name" : "Name"}
                            value={signUpForm.name}
                            onChange={handleSignUpChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signUpForm.email}
                            onChange={handleSignUpChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signUpForm.password}
                            onChange={handleSignUpChange}
                            required
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignInSubmit}>
                        <h1>Sign in</h1>
                        <div className="checkbox-wrapper-4">
                            <input
                                className="inp-cbx"
                                id="signInNGO"
                                type="checkbox"
                                checked={signInNGOChecked}
                                onChange={handleSignInNGOChange}
                            />
                            <label className="cbx" htmlFor="signInNGO">
                                <span>
                                    <svg width="12px" height="10px"></svg>
                                </span>
                                <span>NGO</span>
                            </label>
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signInForm.email}
                            onChange={handleSignInChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signInForm.password}
                            onChange={handleSignInChange}
                            required
                        />
                        <a href="#">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={handleSignIn}>Sign In</button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <h1>Hello!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="ghost" onClick={handleSignUp}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogReg;