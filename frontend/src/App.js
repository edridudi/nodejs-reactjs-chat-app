import './App.css';
import {BrowserRouter as Router,Route} from "react-router-dom";
import {Login, Chat} from './components'

function App() {
  return (
      <Router>
        <Route path='/' exact component={Login} />
        <Route path='/chat' exact component={Chat} />
      </Router>
  );
}

export default App;
