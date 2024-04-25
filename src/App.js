import React, { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import Dashboard from './Pages/Dashboard.js';
import Schools from './Pages/Schools.js';
import People from './Pages/People.js';
import Settings from './Pages/Settings.js';
import Login from './Pages/Login.js';
import './App.css';
import { NavigationProvider } from './Context/NavigationProvider.js';
import WelcomePage from './Pages/WelcomePage.js';
import Registration from './Pages/Registration.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const innerModuleRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}>
        <Route index element={<WelcomePage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard/*" element={<DashboardWithNavigation setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/schools/*" element={<PageWithNavigation page={<Schools />} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/people/*" element={<PageWithNavigation page={<People />} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/settings/*" element={<PageWithNavigation page={<Settings />} setIsLoggedIn={setIsLoggedIn} />} />
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

const DashboardWithNavigation = ({ setIsLoggedIn }) => {
  return (
    <NavigationProvider>
      <Navigation setIsLoggedIn={setIsLoggedIn}>
        <Dashboard />
      </Navigation>
    </NavigationProvider>
  );
};

const PageWithNavigation = ({ page, setIsLoggedIn }) => {
  return (
    <NavigationProvider>
      <Navigation setIsLoggedIn={setIsLoggedIn}>
        {page}
      </Navigation>
    </NavigationProvider>
  );
};

export default App;
