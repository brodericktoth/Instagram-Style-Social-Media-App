import { createContext, useState, useContext } from "react";

//Create the context component
const AuthorizationContext = createContext();

//Create the component that has the state variables and functions that 
//manipulate the state variables
export const AuthorizationProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [flag, toggleFlag] = useState(false);
  const [users, updateUsers] = useState([]);
  
  function initUsers() {
	if (!flag) {
		let userArray = [ {username:"John Doe", password:"silly"}, {username:"Sallie Mae", password:"whoopee"}, {username:"Wrong Answer", password:"Correct"}];
		updateUsers(userArray);
		toggleFlag(!flag);
		alert("initializing");
	}
	else {
		alert("Already Initialized");
	}
  };

  const login = (username, password) => { 
    //const exists = users.some(user => user.username === username); returns boolean value
	const foundUser = users.find(user => user.username === username);
	if (foundUser === undefined) {
		alert("Not a valid user");
		setUser("");
	}
	else {
		if (foundUser.password === password) {
			alert("All good!");
			setUser(username);
		}
		else {
			alert("Not a valid user");
			setUser("");
		}
	}
  };
  
  const logout = () => { setUser(""); };
  
  return (
    <AuthorizationContext.Provider value={{ user, initUsers, login, logout }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export const userAuthorization = () => useContext(AuthorizationContext);
