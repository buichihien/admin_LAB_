import React, { useEffect, useState } from "react";
import "./activity.css";
import img6 from "../../../Assets/avatar1.jpg";
import img7 from "../../../Assets/avatar2.jpg";
import img8 from "../../../Assets/avatar3.jpg";
import img9 from "../../../Assets/avatar4.jpg";
import img10 from "../../../Assets/avatar5.jpg";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

const Activity = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        },
            (err) => {
                console.log(err);
            }
        );
        return () => {
            unsub();
        };
    }, [])
    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Users</h1>
            </div>

            <div className="secContainer grid">
                {data.slice(0, 6).map((data, index) => {
                    return (
                        <div className="singleCustomer flex">
                            <img src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} alt="" />
                            <div className="customerDetails">
                                <span className="name">{data.username}</span>
                                <small>{data.email}</small>
                            </div>
                            <div className="duration">{data.phone}</div>
                        </div>
                    )
                })}
                {/* <div className="singleCustomer flex">
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
                <div className="singleCustomer flex">
                    <img src={img10} alt="" />
                    <div className="customerDetails">
                        <span className="name">Nadia</span>
                        <small>Nadia@gmail.com</small>
                    </div>
                    <div className="duration">09837720912</div>
                </div> */}
            </div>
        </div>
    )
}

export default Activity