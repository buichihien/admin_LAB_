import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./Components/SideBar Section/SideBar";
import Body from "./Components/Body Section/Body";
import Users from "./Components/Users Section/Users";
import NewUser from "./Components/New User/NewUser";
import Devices from "./Components/Devices Section/Devices";
import NewDevice from "./Components/NewDevice/NewDevice";
import BookAClassroom from "./Components/BookAClassroom  Section/BookAClassroom";

const App = () => {
    const { currentUser } = useContext(AuthContext);
    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />
    };
    console.log(currentUser)
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" index element={<Login />} />
            </Routes>
            <RequireAuth>
                <div className="container">
                    <SideBar />
                    <Routes>
                        <Route index element={<Body />} />
                        <Route
                            path="/user"
                            element={<Users />}
                        />
                        <Route
                            path="/NewUser"
                            element={<NewUser />}
                        />
                        <Route
                            path="/devices"
                            element={<Devices />}
                        />
                        <Route
                            path="/NewDevice"
                            element={<NewDevice />}
                        />
                    </Routes>
                </div>
            </RequireAuth>
        </BrowserRouter>
    )
}

export default App