import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./Components/SideBar Section/SideBar";
import Body from "./Components/Body Section/Body";
import Users from "./Components/Users Section/Users";
import Devices from "./Components/Devices Section/Devices";
import Personnel from "./Components/Personnel Section/Personnel";

const Dashboard = () => {
    return (
        <div className="container">
            <SideBar />
            <Routes>
                <Route index element={<Body />} />
                <Route
                    path="/user"
                    element={<Users />}
                />
                <Route
                    path="/devices"
                    element={<Devices />}
                />
                <Route
                    path="/personnel"
                    element={<Personnel />}
                />
            </Routes>
        </div>
    )
}

export default Dashboard