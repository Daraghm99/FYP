
import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('in');
    try {
      const res = await axios.post("/user/Login", {email, password})
      console.log(res.data);
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
