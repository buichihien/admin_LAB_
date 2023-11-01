import React from "react";
import "./listing.css";
import { BsArrowRightShort } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import img1 from "../../../Assets/robo1.png";
import img2 from "../../../Assets/robo2.png";
import img3 from "../../../Assets/robo3.png";
import img4 from "../../../Assets/robo5.png";
import img5 from "../../../Assets/robo77.png";
import img6 from "../../../Assets/avatar1.jpg";
import img7 from "../../../Assets/avatar2.jpg";
import img8 from "../../../Assets/avatar3.jpg";
import img9 from "../../../Assets/avatar4.jpg";
import img10 from "../../../Assets/avatar5.jpg";


const Listing = () => {
    return (
        <div className="listingSection">

            <div className="heading flex">
                <h1>Devices listing</h1>
                <button className="btn flex">
                    See All <BsArrowRightShort className="icon" />
                </button>
            </div>

            <div className="secContainer flex">
                <div className="singleItem">
                    <AiFillHeart className="icon" />
                    <img src={img1} alt="" />
                    <h3>Robot 1</h3>
                </div>
                <div className="singleItem">
                    <AiOutlineHeart className="icon" />
                    <img src={img2} alt="" />
                    <h3>Robot 2</h3>
                </div>
                <div className="singleItem">
                    <AiOutlineHeart className="icon" />
                    <img src={img3} alt="" />
                    <h3>Robot 3</h3>
                </div>
                <div className="singleItem">
                    <AiOutlineHeart className="icon" />
                    <img src={img4} alt="" />
                    <h3>Robot 4</h3>
                </div>
                <div className="singleItem">
                    <AiOutlineHeart className="icon" />
                    <img src={img5} alt="" />
                    <h3>Robot 5</h3>
                </div>
            </div>

            <div className="sellers flex">
                <div className="topSellers">
                    <div className="heading flex">
                        <h3>Permanent personnel</h3>
                        <button className="btn flex">
                            See All <BsArrowRightShort className="icon" />
                        </button>
                    </div>
                    <div className="cards">
                        <div className="card flex">
                            <div className="users">
                                <img src={img6} alt="" />
                                <img src={img7} alt="" />
                                <img src={img8} alt="" />
                                <img src={img9} alt="" />
                                ...
                            </div>
                            <div className="cardText">
                                <span>
                                    Personnel <br />
                                    <small>
                                        Quantity :<span className="date">10</span>
                                    </small>
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="inters">
                    <div className="heading flex">
                        <h3>Permanent inters</h3>
                        <button className="btn flex">
                            See All <BsArrowRightShort className="icon" />
                        </button>
                    </div>
                    <div className="cards">
                        <div className="card flex">
                            <div className="users">
                                <img src={img10} alt="" />
                                <img src={img7} alt="" />
                                <img src={img8} alt="" />
                                <img src={img9} alt="" />
                                ...
                            </div>
                            <div className="cardText">
                                <span>
                                    Inters <br />
                                    <small>
                                        Quantity :<span className="date">15</span>
                                    </small>
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listing