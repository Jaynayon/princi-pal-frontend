import React from 'react';

function Login({ setIsLoggedIn }) {
    return (
        <>
            <div>
                Logins
            </div>
            <button onClick={() => setIsLoggedIn(true)}>
                Click to Login
            </button>
        </>

    );
}
export default Login;