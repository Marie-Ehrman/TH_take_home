import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // import BrowserRouter to use React Routes
import { Provider } from './components/context'; // import Provider for Context API
import Routers from './components/Routers'; // import Routers Component to render React Routers
import Header from './components/Header'; // import Header Component for App Nav

const App = () => {
  // render Nav and Routers Component as children of Provider HOC to provide Context API
  return (
    <BrowserRouter>
      <Provider>
        <div id='root'>
          <Header />
          <Routers />
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
