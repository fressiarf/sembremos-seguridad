import Routing from './routing/Routing';
import { LoginProvider } from './context/LoginContext';
import { ToastProvider } from './context/ToastContext';
import TricolorBar from './components/Shared/TricolorBar/TricolorBar';

function App() {
  return (
    <LoginProvider>
      <ToastProvider>
        <Routing />
      </ToastProvider>
    </LoginProvider>

  )
}

export default App
