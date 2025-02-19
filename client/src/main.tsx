import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from "./components/theme-provider"
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store/store.ts'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
)
