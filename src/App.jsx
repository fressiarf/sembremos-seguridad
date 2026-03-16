import Routing from './routing/Routing';
import { LoginProvider } from './context/LoginContext';

function App() {
  return (
    <LoginProvider>
      <Routing />
    </LoginProvider>
  )
}

export default App
