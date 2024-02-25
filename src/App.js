import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./Components/SideBar Section/SideBar";
import Body from "./Components/Body Section/Body";
import Devices from "./Components/Devices Section/Devices";
import Room from "./Components/Room Section/Room";
import BookingRoom from "./Components/BookingRoom/BookingRoom";
import BorrowDevice from "./Components/BorrowDeviceSection/BorrowDevice"

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
                            path="/devices"
                            element={<Devices />}
                        />
                        <Route
                            path="/BorrowDevice"
                            element={<BorrowDevice />}
                        />
                        <Route
                            path="/room"
                            element={<Room />}
                        />
                        <Route
                            path="/bookingRoom"
                            element={<BookingRoom />}
                        />
                    </Routes>
                </div>
            </RequireAuth>
        </BrowserRouter>
    )
}

export default App