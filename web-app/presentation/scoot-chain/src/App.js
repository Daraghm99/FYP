
import Login from './components/Login';

// Owner Pages
import CreateRequest from './pages/owner/CreateRequest';
import ViewMyScooters from './pages/owner/ViewMyScooters';
import ViewScooterHistory from './pages/owner/ViewScooterHistory';

// Retailer Pages
import RegisterScooter from './pages/retailer/RegisterScooter';
import ViewRequests from './pages/retailer/ViewRequests';

// Law Enforcement Pages
import ViewStolen from './pages/law/ViewStolen';

// Servicer Pages
import CreateService from './pages/servicer/CreateService';

import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      
      <Routes>
          {/* Public Routes Available to every User*/}
          <Route path='/' element={<Login />} />

          {/* Routes Available to users with a role of owner */}
          <Route element={<RequireAuth allowedRole={'owner'} />}>
            <Route path='createRequest' element={<CreateRequest />} />
            <Route path='viewScooters' element={<ViewMyScooters />} />
            <Route path='viewScooterHistory' element={<ViewScooterHistory />} />
          </Route>

          {/* Routes Available to Users with a Role of Retailer */}
          <Route element={<RequireAuth allowedRole={'retailer'} />}>
            <Route path='registerScooter' element={<RegisterScooter />} />
            <Route path='viewRequests' element={<ViewRequests />} />
          </Route>
            
          {/* Routes Available to Users with a Role of Law */}
          <Route element={<RequireAuth allowedRole={'law'} />}>
            <Route path='viewStolen' element={<ViewStolen />} />
          </Route>

          {/* Routes Available to Users with a Role of Servicer */}
          <Route element={<RequireAuth allowedRole={'servicer'} />}>
            <Route path='createService' element={<CreateService />} />
          </Route>

      </Routes>  
    </div>    
    
  );
}

export default App;
