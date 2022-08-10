import { Route, Routes } from "react-router-dom";
import {
  HandDrawPage, 
  HomePage,
} from "./";
function AppRoutes() {
  return (
    
    <Routes>
      <Route path='/draw' element={<HandDrawPage />} />
      <Route path='/' element={<HomePage />} />
    </Routes>
  )
}

export default AppRoutes