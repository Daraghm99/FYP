
import './App.css';
import axios from 'axios';
import { useState } from 'react';
import jwt from 'jwt-decode';

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("/user/Login", {email, password})
      console.log(res.data)
      const token = res.data;
      console.log(token);
      const user = jwt(token);
      console.log(user);
      localStorage.setItem('authToken', token);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login Form</h1>
        <input type="text" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="submitButton">Login</button> 
      </form>

    </div>
  )
}

export default App;
