import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./Components/SideBar Section/SideBar";
import Body from "./Components/Body Section/Body";
import Users from "./Components/Users Section/Users";


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
            </Routes>
        </div>
    )
}

export default Dashboard