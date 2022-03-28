
import Login from './components/Login';

// Owner Pages
import CreateRequest from './pages/owner/CreateRequest';
import ViewMyScooters from './pages/owner/ViewMyScooters';
import ViewScooterHistory from './pages/owner/ViewScooterHistory';

import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
   
      <Routes>
          {/* Public Routes Available to every User*/}
          <Route path='login' element={<Login />} />

          {/* Routes Available to users with a role of owner */}
          <Route element={<RequireAuth allowedRole={'owner'} />}>
            <Route path='createRequest' element={<CreateRequest />} />
            <Route path='viewScooters' element={<ViewMyScooters />} />
            <Route path='viewScooterHistory' element={<ViewScooterHistory />} />
          </Route>

          {/* Routes Available to Users with a Role of Retailer */}
          <Route element={<RequireAuth allowedRole={'retailer'} />}>
            {/*<Route path='retailer' element={<Retailer />} />*/}
          </Route>
            
          {/* Routes Available to Users with a Role of Law */}
          <Route element={<RequireAuth allowedRole={'law'} />}>
            {/*<Route path='law' element={<Law />} />*/}
          </Route>
      </Routes>      
    
  );
}

export default App;
