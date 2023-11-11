import React from "react";
import { Link } from "react-router-dom";
import "./sideBar.css";
import logo from '../../Assets/LogoLHU.png';
import { IoMdSpeedometer } from 'react-icons/io';
import { AiFillAndroid } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';
import { SiGoogleclassroom } from 'react-icons/si';

const SideBar = () => {
    return (
        <div className="sideBar grid">
            <div className="logoDiv flex">
                <img src={logo} alt="Image" />
                <h2>B501-AI-Lab</h2>
            </div>

            <div className="menuDiv">
                <h3 className="divTitle">
                    QUICK MENU
                </h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <Link to="/" className='menuLink flex'>
                            <IoMdSpeedometer className="icon" />
                            <span className="smallText">
                                Dash board
                            </span>
                        </Link>
                    </li>

                    <li className="listItem">
                        <Link to="/devices" className='menuLink flex'>
                            <AiFillAndroid className="icon" />
                            <span className="smallText">
                                Devices
                            </span>
                        </Link>

                    </li>

                    <li className="listItem">
                        <Link to="/room" className='menuLink flex'>
                            <SiGoogleclassroom className="icon" />
                            <span className="smallText">
                                Book a classroom
                            </span>
                        </Link>

                    </li>
                </ul>
            </div>
            {/* <div className="settingDiv">
                <h3 className="divTitle">
                    SETTING
                </h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className='menuLink flex'>
                            <IoMdSpeedometer className="icon" />
                            <span className="smallText">
                                Charts
                            </span>
                        </a>

                    </li>
                    <li className="listItem">
                        <a href="#" className='menuLink flex'>
                            <AiFillAlert className="icon" />
                            <span className="smallText">
                                Trends
                            </span>
                        </a>

                    </li>
                    <li className="listItem">
                        <a href="#" className='menuLink flex'>
                            <AiFillAndroid className="icon" />
                            <span className="smallText">
                                Contacts
                            </span>
                        </a>

                    </li>
                </ul>
            </div> */}
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
    )
}

export default SideBar