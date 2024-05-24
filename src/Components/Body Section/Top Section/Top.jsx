import React from "react";
import "./top.css";
import { FcSearch } from "react-icons/fc";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsArrowRightShort } from "react-icons/bs";
import { BsQuestionCircle } from 'react-icons/bs';
import admin from "../../../Assets/admin.jpg"
import img from "../../../Assets/robo22.png"
import cntt from "../../../Assets/khoaCNTT.jpg"
// import video from "../../../Assets/video.mp4"

const Top = () => {
    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome to B501-AI-Lab</h1>
                    <p>Hello guy, Welcome back !!!</p>
                </div>

                <div className="searchBar flex">
                    <input type="text" placeholder="Search Dashboard" />
                    <FcSearch className="icon" />
                </div>

                <div className="adminDiv flex">
                    <IoNotificationsOutline className="icon" />
                    <div className="adminImage">
                        <img src={admin} alt="" />
                    </div>
                </div>
            </div>

            <div className="cardSection flex">
                <div className="rightCard flex">
                    {/* <h1>AI-LAB</h1>
                    <p>Information technology is not a product, but a process</p>

                    <div className="buttons flex">
                        <button className="btn">Explore More</button>
                        <button className="btn transparent">A classroom</button>
                    </div> */}

                    <div className="videoDiv">
                        {/* <video src={video} autoPlay loop muted></video> */}
                        <img src={cntt} alt="" />
                    </div>
                </div>

                <div className="leftCard flex">
                    <div className="main flex">
                        <div className="textDiv">
                            <h1>My Start</h1>

                            <div className="flex">
                                <span>
                                    Devices <br /> <small>50</small>
                                </span>
                                <span>
                                    Model AI <br /> <small>27</small>
                                </span>
                            </div>
                            <span className="flex link">
                                Go to borrow equipment <BsArrowRightShort className="icon" />
                            </span>
                        </div>

                        <div className="imageDiv">
                            <img src={img} alt="" />
                        </div>
                    </div>
                    <div className="sideBarCard">
                        <BsQuestionCircle className="icon" />
                        <div className="cardContent">
                            <div className="circle1"></div>
                            <div className="circle2"></div>

                            <h3>Help Center</h3>
                            <p>Having trouble in Admin-Lab, please contact us from for more questions.</p>
                            <button className="btn">Go to help center</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top