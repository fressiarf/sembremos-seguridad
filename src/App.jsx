import Routing from './routing/Routing';
import { LoginProvider } from './context/LoginContext';
import { ToastProvider } from './context/ToastContext';


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
