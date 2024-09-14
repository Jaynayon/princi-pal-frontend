import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

//Function that allows us to accept credentials
const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const validateToken = async (token) => {
        try {
            if (token) {
                const response = await instance.get(`${process.env.REACT_APP_API_URL_AUTH}/verify/?token=${token}`)
                if (response) {
                    console.log(response.data)
                }
                return response.data
            }
        } catch (error) {
            console.error('Error validating token:', error);
            throw new Error("Token validation failed. Please try again later.");
        }
    };

    const getUserById = async (user_id) => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_USER}/${user_id}`)
            if (response) {
                console.log(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error("Get user failed. Please try again later.");
        }
    };

    const authenticateUser = async (email, password) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_AUTH}/login`, {
                emailOrUsername: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.isMatch) {
                fetchData();
                window.location.href = "http://localhost:3000";
            }

            return response.data;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const jwtCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('jwt='));

            if (jwtCookie) {
                const token = jwtCookie.split('=')[1];
                console.log('JWT Token:', token);

                // Call to validate the token
                const data = await validateToken(token);
                console.log(data);

                if (data) { // access data.id
                    const user = await getUserById(data.id);
                    user.position === "Super administrator" && setIsSuperAdmin(true); //is admin
                    setIsLoggedIn(true);
                    setCurrentUser(user);
                } else {
                    setIsLoggedIn(false);
                }
                console.log(data)
                // Handle response as needed
            } else {
                setIsLoggedIn(false)
                console.log('JWT Token not found in cookies.');
            }
        } catch (error) {
            console.error('Error validating token:', error);
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            fetchData();
        }

    }, [isLoggedIn, fetchData]);

    return (
        <AppContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            isSuperAdmin, setIsSuperAdmin,
            currentUser, setCurrentUser,
            validateToken,
            getUserById,
            authenticateUser
        }}>
            {children}
        </AppContext.Provider>
    );
}