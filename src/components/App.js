import React, {useState} from 'react';
// import './App.css';
import {Route, Routes } from 'react-router-dom';
import Login from "./Login"
import Dashboard from './Dashboard';
import Preferences from './Preferences';
import Register from './Register';
import useToken from './useToken';


// Token think of them as like a hotel card. 



function App() {
      
   
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log("userToken", userToken)
        return userToken?.token
      };
      const [token, setToken] = useState();

      console.log("token in App.js", token)

      
     if(!token){
          
        console.log("Im hiting else if ");
        return <Register setToken={setToken} />
      }

    
    return (
      <div className="wrapper">
        <h1>Application</h1>
        
          <Routes>
            <Route  path="/dashboard" element={<Dashboard/>}> </Route>
            <Route  exact path="/preferences" element={<Preferences/>}></Route>
            <Route  exact path="/login" element={<Login/>}></Route>
            <Route  exact path="/register" element={<Register/>}></Route>
          </Routes>
      </div>
    );
  }
  
  export default App;