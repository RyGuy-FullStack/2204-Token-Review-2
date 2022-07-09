import React, {useState} from 'react';

async function loginUser({username, password}) {
    return fetch('http://localhost:4000/api/COHORT-NAME/guests/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          guest: {
              username: username,
              password: password
          }
      })
    })
      .then(data => data.json())
   }
   

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    sessionStorage.setItem("token", JSON.stringify(token))
    setToken(token)
  }

  return(
    
    <form onSubmit={handleSubmit}>
        <h2>Please Login!</h2>
      <label>
        <p>Username</p>
        <input type="text"  onChange={e => setUserName(e.target.value)} />
      </label>
      <label>
        <p>Password</p>
        <input type="password" onChange={e => setPassword(e.target.value)}/>
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}