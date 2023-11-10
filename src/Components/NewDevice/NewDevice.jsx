import React, { useEffect, useId, useState } from "react";
// import "./bookingRoom.scss";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import {Devices} from "../../formSoure";
import { useNavigate } from "react-router";


const NewDevice = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState("");
    const [data, setData] = useState({});
    const valueData = collection(db, "Device");
    const navigate = useNavigate()

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        let newDate = `${day}-${month}-${year}`;
        return newDate;
    };

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

    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({ ...data, [id]: value });
    }

    const formattedDate = formatDate(date);

    useEffect(()=>{
        setDate(formattedDate)
    },[date,formattedDate])

    const handleADD = async (e) => {
        e.preventDefault()
        try {
            await addDoc(valueData,{
                ...data,date,time
            })
            navigate(-1)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="formbold-main-wrapper">
            <div className="formbold-form-wrapper">
                <h1>Add User</h1>
                <form onSubmit={handleADD}>
                    {Devices.map((input) => (<div className="formbold-input-flex" key={input.id}>
                        <div>
                            <label className="Formbold-form-label"> {input.label} </label>
                            <input
                                id={input.id}
                                type={input.type}
                                placeholder={input.placeholder}
                                className="formbold-form-input"
                                onChange={handleInput}
                                required
                            />
                        </div>
                    </div>))}
                    <div>
                        <input type="date" className="date" onChange={(e) => setDate(e.target.value)}></input>
                    </div>
                    <div>
                        <input type="time" className="time" onChange={(e) => setTime(e.target.value)}></input>
                    </div>
                    <button className="formbold-btn" type="submit">
                        ADD
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewDevice