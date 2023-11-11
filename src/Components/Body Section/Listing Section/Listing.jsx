import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import "./listing.css";
import { BsArrowRightShort } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";


const Listing = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Device"), (snapshot) => {
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
        <div className="listingSection">

            <div className="heading flex">
                <h1>Devices listing</h1>
                <Link to="/devices" className='menuLink flex'>
                    <button className="btn flex">
                        See All <BsArrowRightShort className="icon" />
                    </button>
                </Link>
            </div>

            <div className="secContainer flex">
                {data.slice(0, 10).map((data, index) => {
                    return (
                        <div className="singleItem">
                            <AiFillHeart className="icon" />
                            <img src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} alt="" />
                            <h3>Robot {index+1}</h3>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Listing