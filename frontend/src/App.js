import Sidebar  from './components/Sidebar/Sidebar.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {DataManager} from './pages/DataManager.js';
import {DataTable} from './pages/DataTable.js';
import {GitHubIssue} from './pages/GitHubIssue.js';
import { 
  LBCAPage
} from './pages/LBCAPage.js';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/home/data-manager"  element={<DataManager/>}/>
          <Route path="/home/data"  element={<DataTable/>}/>
          <Route path="/charts/ml-chart" element={<LBCAPage/>}/>
          <Route path="/help/report-issue" element={<GitHubIssue/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
