export const fetchRegister = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}),
    }
  );
  if (!response.ok) {
    console.log(response);
    return response.statusText;
  }
  const data = await response.json();
  const token = data.jwtToken;
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/home";
  } else {
    throw new Error("No token received");
  }
  console.log(token);
};
