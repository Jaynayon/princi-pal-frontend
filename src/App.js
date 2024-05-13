import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import Dashboard from './Pages/Dashboard.js';
import SchoolPage from './Pages/SchoolPage.js';
import People from './Pages/People.js';
import Settings from './Pages/Settings.js';
import Login from './Pages/Login.js';
import './App.css';
import { NavigationProvider } from './Context/NavigationProvider.js';
import { SchoolProvider } from './Context/SchoolProvider.js';
import WelcomePage from './Pages/WelcomePage.js';
import Registration from './Pages/Registration.js';
import RestService from './Services/RestService.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('jwt='));

        if (jwtCookie) {
          const token = jwtCookie.split('=')[1];
          console.log('JWT Token:', token);

          // Call RestService to validate the token
          const data = await RestService.validateToken(token);

          if (data) { //data.decodedToken
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
  }, []);

  const innerModuleRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root />}>
        <Route index
          element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <WelcomePage />}
        />
        <Route path="/login"
          element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Login />}
        />
        <Route path="/register"
          element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Registration />} />
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Login />}
        />
        <Route path="/schools/*"
          element={isLoggedIn ? <PageWithNavigation page={<SchoolPage />} /> : <Login />} />
        <Route path="/people/*"
          element={isLoggedIn ? <PageWithNavigation page={<People />} /> : <Login />} />
        <Route path="/settings/*"
          element={isLoggedIn ? <PageWithNavigation page={<Settings />} /> : <Login />} />
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
