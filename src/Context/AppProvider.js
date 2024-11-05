import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

//Function that allows us to accept credentials
const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL_BASE}`, // Set your backend URL
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

            // set local storage
            window.localStorage.setItem("LOCAL_STORAGE_TOKEN", JSON.stringify(response.data.token));

            if (response.data.isMatch) {
                fetchCurrentUser();
            }

            return response.data;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
        }
    };

    const getUserById = async (user_id, token) => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_USER}/${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response) {
                console.log(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error("Get user failed. Please try again later.");
        }
    };

    const fetchCurrentUser = useCallback(async () => {
        try {
            const jwtToken = JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"));

            if (jwtToken) {
                console.log('JWT Token:', jwtToken);

                // Call to validate the token
                const data = await validateToken(jwtToken);
                console.log(data);

                if (data) { // access data.id
                    const user = await getUserById(data.id, jwtToken);
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
            fetchCurrentUser();
        }

    }, [isLoggedIn, fetchCurrentUser]);

    return (
        <AppContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            isSuperAdmin, setIsSuperAdmin,
            currentUser, setCurrentUser,
            validateToken,
            getUserById,
            authenticateUser,
            fetchCurrentUser
        }}>
            {children}
        </AppContext.Provider>
    );
}