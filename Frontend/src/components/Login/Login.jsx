import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { authContext } from '../../hooks/Context';

const Login = () => {
    const { isRegistered, setIsRegistered, loadData, lightMode, url } = useContext(authContext);
    const [info, setInfo] = useState({ username: '', password: '' });
    const [redirect, setRedirect] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleLogIn = () => {
        let user = {
            username: info.username,
            password: info.password,
        };
        login(user);
    };

    const login = async (user) => {
        try {
            // Send a POST request to the JSON Server to add the new user
            const response = await fetch(url+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Error while logging in');
            }

            const res = await response.json();
            if (res.exists === 'true') {
                localStorage.setItem("isRegistered", true);
                localStorage.setItem("id", res.id);
                console.log("login Successful");
                setRedirect(true);
                setIsRegistered(true);
                await loadData();
            } else {
                setValidationError("Incorrect username or password...");
                console.log("Account doesn't exist");
                setRedirect(false);
            }
        } catch (err) {
            console.error('Error during login:', err);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogIn();
        }
    };

    if (redirect) {
        return <Navigate to={"/"} />;
    }

    return (
        <>
            <div className={styles.container}>
                <Link to='/' className={styles.arrowContainer}>
                    <img className={styles.arrow+(lightMode?" invert":"")} src="arrow.svg"  alt="" />
                </Link>
                <div className={styles.loginContainer}>
                    <h1 className={styles.h1_dark+(lightMode?" text-black":"")}>Log In <img className={lightMode?"invert":""} data-tooltip-id="my-tooltip-1" src="/question_icon.png" alt="" /></h1>
                    <div className={styles.account}>
                        <h1 className={styles.h1_account+(lightMode?" text-black":"")}>Account</h1>
                        <div>
                            <input 
                                className={styles.account_input +(lightMode? " "+styles.account_input_light: "")}
                                type="name" 
                                placeholder='Username' 
                                onChange={(e) => setInfo({ ...info, username: e.target.value })}
                                onKeyDown={handleKeyPress}
                            />
                            <img className={lightMode?"invert":""} src="/user.svg" alt="" />
                        </div>
                        <div>
                            <input 
                                className={styles.account_input +(lightMode? " "+styles.account_input_light: "")}
                                type="password" 
                                placeholder='Password' 
                                onChange={(e) => setInfo({ ...info, password: e.target.value })} 
                                onKeyPress={handleKeyPress} // Add onKeyPress event
                            />
                            <img className={lightMode?"invert":""} src="/key.svg" alt="" />
                        </div>
                        <Link to='/forgot'><p className={styles.forgot +(lightMode? " text-black": "")}>Forgot your password?</p></Link>
                        {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.remember}>
                            <input type="checkbox" name="remember"/>
                            <label className={styles.remember_label +(lightMode? " text-black": "")} htmlFor="remember">Remember Me</label>
                        </div>
                        <button className={styles.logIn +(lightMode? " "+styles.logIn_light: "")} onClick={handleLogIn}>Log in</button>
                    </div>
                </div>
                <div className={styles.banner}>
                    <img className={styles.logo + (lightMode?" invert":"")} src="/logo.svg" alt="" />
                    <h1 className={styles.banner_h1 + (lightMode?" text-black":"")}>Invest Smarter,<br/>Trade Together</h1>
                    <img className={styles.illustration} src="/login_img.svg" alt="" />
                    <div className={styles.navigation}>
                        <Link to='/faq' className={styles.linkItem + (lightMode?" text-black":"")}>FAQ</Link>
                        <Link to='/contact-us' className={styles.linkItem + (lightMode?" text-black":"")}>Contact Us</Link>
                    </div>
                </div>
            </div>
            <ReactTooltip
                id="my-tooltip-1"
                content="Enter your email and password"
                place="right"
            />
        </>
    );
};

export default Login;
