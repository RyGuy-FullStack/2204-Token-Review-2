import React, {useState} from 'react';

async function registerUser({username, password}) {
    return fetch('http://localhost:4000/api/COHORT-NAME/guests/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          guest: {
              username: username,
              password, password
          }
      })
    })
      .then(data => data.json())
   }
   

export default function Register({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await registerUser({
      username,
      password
    });
    const token = data.data.token
    console.log("data", data)
    console.log("Token in Register", token)
    console.log("setToken in Register", setToken)
    localStorage.setItem("token", JSON.stringify(token))
    setToken(token);
  }

  return(
    <form onSubmit={handleSubmit}>
      <h2> Please Register</h2>
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