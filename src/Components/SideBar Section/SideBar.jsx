import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sideBar.css";
import logo from '../../Assets/lOGO DUNG VI_Large.png';
import { IoMdSpeedometer } from 'react-icons/io';
// import { AiFillAlert } from 'react-icons/ai';
import { AiFillAndroid } from 'react-icons/ai';
import { BsFillFileEarmarkPersonFill } from 'react-icons/bs';
import { BsQuestionCircle } from 'react-icons/bs';
import { BiSolidUser } from 'react-icons/bi';
import { SiGoogleclassroom } from 'react-icons/si';
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const SideBar = () => {
    const navigate = useNavigate()
    const { dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch({ type: "LOGOUT" }); // dispatch action to clear user state
                navigate("/login"); // navigate to login page or any other appropriate page
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    return (
        <div className="sideBar grid">
            <div className="logoDiv flex">
                <img src={logo} alt="Image" />
                <h2>Admin Lab</h2>
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
                        <Link to="/user" className='menuLink flex'>
                            <BiSolidUser className="icon" />
                            <span className="smallText">
                                Users
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
                        <Link to="/personnel" className='menuLink flex'>
                            <BsFillFileEarmarkPersonFill className="icon" />
                            <span className="smallText">
                                Personnel
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
                    <button className="btn" onClick={handleLogout}>LOG OUT</button>
                </div>
            </div>
        </div>
    )
}

export default SideBar