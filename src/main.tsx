import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MoviePage from './components/MoviePage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

const query = new QueryClient();

const routes = createBrowserRouter(createRoutesFromElements(
  <Route path='/'>
    <Route path='' element={<App />} />
    <Route path='movie/:id' element={<MoviePage />} />
    <Route path='*' element={<div>404 Not Found</div>}/>
  </Route>
))

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={query}>
    <RouterProvider router={routes} />
  </QueryClientProvider>
)
