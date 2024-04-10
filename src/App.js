import React, { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import Testing from './Pages/Testing.js';
import Dashboard from './Pages/Dashboard.js'
import Schools from './Pages/Schools.js'
import People from './Pages/People.js'
import Settings from './Pages/Settings.js'
import Login from './Pages/Login.js'
import './App.css';
import { NavigationProvider } from './Context/NavigationProvider.js';
import WelcomePage from './WelcomePage.js';
import { School } from '@mui/icons-material';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const innerModuleRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={isLoggedIn ? <Root /> : <Login setIsLoggedIn={setIsLoggedIn} />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/people" element={<People />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/welcome" element={<WelcomePage />} />
        {/*<Route path="/testing" element={<Testing />} />*/}
      </Route>
    )
  )

  const welcomeRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
      </Route>
    )
  )

  return (
    <div className='App'>
      <RouterProvider router={welcomeRouter} />
    </div>
  );
}

//This is where the Navigation bar and Header is called
const Root = () => {
  return (
    <NavigationProvider>
      <Navigation>
        <Outlet />
      </Navigation>
    </NavigationProvider>
  )
}

export default App;
