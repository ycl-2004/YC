import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles.css'

// No StrictMode: the site effects (cursor, meteors, scroll listeners) are
// ported imperatively; StrictMode's dev double-invoke would double-attach them.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
