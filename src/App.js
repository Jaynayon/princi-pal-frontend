import './App.css';
import Testing from './Screens/Testing.js';
import Home from './Screens/Home.js'
import { createBrowserRouter, createRoutesFromElements, Route, Link, Outlet, RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/testing" element={<Testing />} />
      </Route>
    )
  )

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

const Root = () => {
  return (
    <>
      <div>
        <Link to="/"> Home </Link>
        <Link to="/testing"> Testing </Link>
      </div>

      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App;
