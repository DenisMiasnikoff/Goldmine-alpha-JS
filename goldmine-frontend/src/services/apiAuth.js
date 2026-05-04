const BASE_URL = 'http://localhost:5000/api/v1/users'; // Adjust port if needed

export async function signup({ username, email, password, confirmpassword }) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirmpassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    // This catches your res.status(400) from the controller
    throw new Error(data.message || 'Could not create account');
  }

  // Save the token returned by your signToken function
  if (data.token) {
    localStorage.setItem('jwt', data.token);
  }

  return data;
}

export async function login({email,password}) {
  const response=await fetch(`${BASE_URL}/login`,{
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({email,password})
  });

  const data=await response.json();

  if(!response.ok) {
    throw new Error(data.message||"Invalid credentials")
  }

  return data;
}