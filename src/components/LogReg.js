import './LogReg.css';
import React, { useState } from 'react';

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpMorningChecked, setSignUpMorningChecked] = useState(false);
    const [signInMorningChecked, setSignInMorningChecked] = useState(false);

    const handleSignUp = () => {
        setIsSignUp(true);
    };

    const handleSignIn = () => {
        setIsSignUp(false);
    };

    const handleSignUpMorningChange = () => {
        setSignUpMorningChecked(!signUpMorningChecked);
    };

    const handleSignInMorningChange = () => {
        setSignInMorningChecked(!signInMorningChecked);
    };

    return (
        <div className="box">
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form action="" method="POST">
                        <h1>Create Account</h1>
                        <div className="checkbox-wrapper-4">
                            <input
                                className="inp-cbx"
                                id="signUpMorning"
                                type="checkbox"
                                checked={signUpMorningChecked}
                                onChange={handleSignUpMorningChange}
                            />
                            <label className="cbx" htmlFor="signUpMorning">
                                <span>
                                    <svg width="12px" height="10px"></svg>
                                </span>
                                <span>NGO</span>
                            </label>
                            <svg className="inline-svg">
                                <symbol id="check-4" viewBox="0 0 12 10">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                </symbol>
                            </svg>
                        </div>
                        <input type="text" placeholder="Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form action="#" method="POST">
                        <h1>Sign in</h1>
                        <div className="checkbox-wrapper-4">
                            <input
                                className="inp-cbx"
                                id="signInMorning"
                                type="checkbox"
                                checked={signInMorningChecked}
                                onChange={handleSignInMorningChange}
                            />
                            <label className="cbx" htmlFor="signInMorning">
                                <span>
                                    <svg width="12px" height="10px"></svg>
                                </span>
                                <span>NGO</span>
                            </label>
                            <svg className="inline-svg">
                                <symbol id="check-4" viewBox="0 0 12 10">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                </symbol>
                            </svg>
                        </div>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
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

export default LoginPage;