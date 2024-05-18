import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import Dashboard from './Pages/Dashboard.js';
import SchoolPage from './Pages/SchoolPage.js';
import People from './Pages/People.js';
import Settings from './Pages/Settings.js';
import Login from './Pages/Login.js';
import AdminPage from './Pages/AdminPage.js';
import './App.css';
import { NavigationProvider } from './Context/NavigationProvider.js';
import { SchoolProvider } from './Context/SchoolProvider.js';
import WelcomePage from './Pages/WelcomePage.js';
import Registration from './Pages/Registration.js';
import RestService from './Services/RestService.js';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

          if (data) { // access data.id
            const user = await RestService.getUserById(data.id);
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
      return <Login />;
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
          element={getWelcomeElement(WelcomePage, Dashboard)}
        />
        <Route
          path="/login"
          //element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Login />}
          element={getWelcomeElement(Login, Dashboard)}
        />
        <Route
          path="/register"
          //element={isLoggedIn ? <PageWithNavigation page={<Dashboard />} /> : <Registration />}
          element={getWelcomeElement(Registration, Dashboard)}
        />
        <Route
          path="/dashboard/*"
          element={getElement(Dashboard)}
        />
        <Route
          path="/schools/*"
          element={getElement(SchoolPage)}
        />
        <Route
          path="/people/*"
          element={getElement(People)}
        />
        <Route
          path="/settings/*"
          element={getElement(Settings)}
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
