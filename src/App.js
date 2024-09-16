import React from 'react';
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
import { useAppContext } from './Context/AppProvider.js';

function App() {
  const { isLoggedIn, isSuperAdmin } = useAppContext();

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
          element={getWelcomeElement(WelcomePage, DashboardPage)}
        />
        <Route
          path="/login"
          element={getWelcomeElement(LoginPage, DashboardPage)}
        />
        <Route
          path="/register"
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