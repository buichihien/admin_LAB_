import React, { useEffect, useState } from "react";
// import "./newUser.scss";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Devices } from "../../formSoure";
import { BsImage } from 'react-icons/bs';
import { MdClose } from 'react-icons/md'; // Import MdClose icon
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";


const NewDevice = () => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const navigate = useNavigate()
    const valueData = collection(db, "Device");

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setPerc(progress)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({ ...prev, img: downloadURL }));
                    });
                }
            );
        };
        file && uploadFile();
    }, [file])

    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({ ...data, [id]: value });
    }

    const handleADD = async (e) => {
        e.preventDefault()
        try {
            await addDoc(valueData,{
                ...data,
                timestamp: serverTimestamp(),
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
                    <div className="image">
                        <label htmlFor="file" className="formbold-form-label"><BsImage/></label>
                        <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </div>

                    <button className="formbold-btn" type="submit" onClick={handleADD} disabled={per !== null && per < 100}>
                        ADD
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewDevice