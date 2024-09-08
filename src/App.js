import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import DashboardPage from './Pages/DashboardPage.js';
import SchoolPage from './Pages/SchoolPage.js';
import PeoplePage from './Pages/PeoplePage.js';
import SettingsPage from './Pages/SettingsPage.js';
import LoginPage from './Pages/LoginPage.js';
import AdminPage from './Pages/AdminPage.js';
import NoMatchPage from './Pages/NoMatchPage.js';
import './App.css';
import { NavigationProvider } from './Context/NavigationProvider.js';
import { SchoolProvider } from './Context/SchoolProvider.js';
import WelcomePage from './Pages/WelcomePage.js';
import RegistrationPage from './Pages/RegistrationPage.js';
import axios from 'axios';

//Function that allows us to accept credentials
const instance = axios.create({
  baseURL: 'http://localhost:4000', // Set your backend URL
  withCredentials: true, // Enable sending cookies with cross-origin requests
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('jwt='));

        if (jwtCookie) {
          const token = jwtCookie.split('=')[1];
          console.log('JWT Token:', token);

          // Call to validate the token
          const data = await validateToken(token);

          if (data) { // access data.id
            const user = await getUserById(data.id);
            user.position === "Super administrator" && setIsSuperAdmin(true); //is admin
            setIsLoggedIn(true)
          } else {
            setIsLoggedIn(false)
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
    };

    fetchData();

  }, [isSuperAdmin]);

  const getElement = (Component) => {
    if (!isLoggedIn) {
      return <LoginPage />;
    }
    return isSuperAdmin ? <AdminPage /> : <PageWithNavigation page={<Component />} />;
  };

  const getWelcomeElement = (WelcomeModule, Component) => {
    if (!isLoggedIn) {
      return <WelcomeModule />;
    }
    return isSuperAdmin ? <AdminPage /> : <PageWithNavigation page={<Component />} />;
  };

  const innerModuleRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root />}>
        <Route
          index
          //element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <WelcomePage />}
          element={getWelcomeElement(WelcomePage, DashboardPage)}
        />
        <Route
          path="/login"
          //element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Login />}
          element={getWelcomeElement(LoginPage, DashboardPage)}
        />
        <Route
          path="/register"
          //element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Registration />}
          element={getWelcomeElement(RegistrationPage, DashboardPage)}
        />
        <Route
          path="/dashboard"
          element={getElement(DashboardPage)}
        />
        <Route
          path="/schools/*"
          element={getElement(SchoolPage)}
        />
        <Route
          path="/people"
          element={getElement(PeoplePage)}
        />
        <Route
          path="/settings"
          element={getElement(SettingsPage)}
        />
        <Route
          path="*"
          element={<NoMatchPage />}
        />
      </Route>
    )
  );

  return (
    <div className='App'>
      <RouterProvider router={innerModuleRouter} />
    </div>
  );
}

const Root = ({ setIsLoggedIn, isLoggedIn }) => {
  return (
    <NavigationProvider>
      <Outlet />
    </NavigationProvider>
  );
};

const PageWithNavigation = ({ page, setIsLoggedIn }) => {
  return (
    <NavigationProvider>
      <SchoolProvider>
        <Navigation>
          {page}
        </Navigation>
      </SchoolProvider>
    </NavigationProvider>
  );
};

export default App;