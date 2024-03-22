import './App.css';
import Testing from './Pages/Testing.js';
import Dashboard from './Pages/Dashboard.js'
import Schools from './Pages/Schools.js'
import People from './Pages/People.js'
import Settings from './Pages/Settings.js'
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation.js';
import * as React from 'react';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root />}>
        <Route index element={<Dashboard />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/people" element={<People />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    )
  )

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

//This is where the Navigation bar and Header is called
const Root = () => {
  return (
    <Navigation>
      <Outlet />
    </Navigation>
  )
}

export default App;
