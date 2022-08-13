import { Route, Routes } from "react-router-dom";
import {
  HandDrawPage, 
  HomePage,
  ToDoListPage,
} from "./";
function AppRoutes() {
  return (
    
    <Routes>
      <Route path='/todo' element={<ToDoListPage />} />
      <Route path='/draw' element={<HandDrawPage />} />
      <Route path='/' element={<HomePage />} />
    </Routes>
  )
}

export default AppRoutes