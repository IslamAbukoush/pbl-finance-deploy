import { createContext, useEffect, useState } from "react";

export const authContext = createContext();



const Context = (props) => {
    const [url, setUrl] = useState("https://investora-ccaedbdccna9dqd3.westeurope-01.azurewebsites.net/");
    const [isRegistered, setIsRegistered] = useState(false);
    const [lightMode, setLightMode] = useState(true);
    const [preferredMode, setPrefferedMode] = useState(localStorage.getItem("preferredMode"));
    const [userData, setUserData] = useState({});

    useEffect(() => {
        loadData();
    }, []);
    const changeMode = mode => {
        if(!mode || !(["system", "light", "dark"].includes(mode))) {
            setPrefferedMode("system");
            localStorage.setItem("preferredMode", "system");
            return;
        }
        setPrefferedMode(mode);
        localStorage.setItem("preferredMode", mode);
    }
    const register = async (user) => {
        try {
            const response = await fetch(url+'/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            const res = await response.json();
            if (res.exists === 'false') {
                localStorage.setItem("isRegistered", true);
                localStorage.setItem("id", res.id);
                setIsRegistered(true); // Update registered status
            }
            return res;

        } catch (err) {
            console.error('Error during registration:', err);
        }
    };

    const loadData = async () => {
        const userId = localStorage.getItem("id");
        if (!userId) return; 
        
        if (!userId) {
            console.log("No user ID found in localStorage.");
            return; // Exit early if no user ID
        }

        console.log("Fetching data for user ID:", userId);

        try {
            const response = await fetch(url+'/users/' + userId);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUserData(prev => ({
                ...prev,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                deposit: data.deposit,
            }));
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };

    const value1 = {
        register,
        isRegistered,
        setIsRegistered,
        userData,
        loadData,
        lightMode,
        setLightMode,
        changeMode,
        preferredMode,
        url
    };

    return (
        <authContext.Provider value={value1}>
            {props.children}
        </authContext.Provider>
    );
}

export default Context;
