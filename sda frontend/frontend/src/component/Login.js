import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import styles

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Validate email format and password length
        const isGmail = username.endsWith('@gmail.com');
        const isPasswordValid = password.length > 5;

        if (isGmail && isPasswordValid) {
            navigate('/measurements'); // Redirect to Measurements page on successful login
        } else {
            if (!isGmail) {
                alert('Username must be a Gmail address ending with @gmail.com');
            } else if (!isPasswordValid) {
                alert('Password must be more than 5 characters');
            } else {
                alert('Invalid username or password');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label className='lab'>Username: </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your Gmail address"
                        />
                    </div>
                    <div>
                        <label className='lab'>Password: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
