import React from "react";
import "./activity.css";
import { BsArrowRightShort } from "react-icons/bs";
import img6 from "../../../Assets/avatar1.jpg";
import img7 from "../../../Assets/avatar2.jpg";
import img8 from "../../../Assets/avatar3.jpg";
import img9 from "../../../Assets/avatar4.jpg";
import img10 from "../../../Assets/avatar5.jpg";

const Activity = () => {
    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Users</h1>
                <button className="btn flex">
                    See All <BsArrowRightShort className="icon" />
                </button>
            </div>

            <div className="secContainer grid">
                <div className="singleCustomer flex">
                    <img src={img6} alt="" />
                    <div className="customerDetails">
                        <span className="name">Esther</span>     
                        <small>Esther@gmail.com</small>                 
                    </div>
                    <div className="duration">09837720912</div>
                </div>
                <div className="singleCustomer flex">
                    <img src={img7} alt="" />
                    <div className="customerDetails">
                        <span className="name">Antaram</span>     
                        <small>Antaram@gmail.com</small>                 
                    </div>
                    <div className="duration">09837720912</div>
                </div>
                <div className="singleCustomer flex">
                    <img src={img8} alt="" />
                    <div className="customerDetails">
                        <span className="name">Leonidas</span>     
                        <small>Leonidas@gmail.com</small>                 
                    </div>
                    <div className="duration">09837720912</div>
                </div>
                <div className="singleCustomer flex">
                    <img src={img9} alt="" />
                    <div className="customerDetails">
                        <span className="name">Kerenza</span>     
                        <small>Kerenza@gmail.com</small>                 
                    </div>
                    <div className="duration">09837720912</div>
                </div>
                <div className="singleCustomer flex">
                    <img src={img10} alt="" />
                    <div className="customerDetails">
                        <span className="name">Nadia</span>     
                        <small>Nadia@gmail.com</small>                 
                    </div>
                    <div className="duration">09837720912</div>
                </div>
            </div>
        </div>
    )
}

export default Activity