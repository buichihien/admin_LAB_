import React, { useEffect, useState } from "react";
import "./newUser.scss";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, serverTimestamp, setDoc, query, where, getDocs } from "firebase/firestore";
import { Users } from "../../formSoure";
import { BsImage } from 'react-icons/bs';
import { useNavigate } from "react-router";


const NewUser = () => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate()

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
            // Kiểm tra độ dài mật khẩu
            if (data.password.length < 6) {
                alert("Mật khẩu phải có ít nhất 6 ký tự");
                return;
            }

            if (data.phone.length < 11) {
                alert("Mật khẩu phải có ít nhất 11 số");
                return;
            }

            // thông báo lỗi trùng email
            const q = query(collection(db, "Users"), where("email", "==", data.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert("Email đã được sử dụng");
                return;
            }

            // thông báo lỗi trùng email
            const q_mssv = query(collection(db, "Users"), where("mssv", "==", data.mssv));
            const querySnapshot_mssv = await getDocs(q_mssv);
            if (!querySnapshot_mssv.empty) {
                alert("Mã số sinh viên đã được sử dụng");
                return;
            }

            const res = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            await setDoc(doc(db, "Users", res.user.uid), {
                ...data,
                timeStamp: serverTimestamp(),
            });
            navigate(-1)
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    return (
        <div className="formbold-main-wrapper">
            <div className="formbold-form-wrapper">
                <h1>Add User</h1>
                <form onSubmit={handleADD}>
                    {Users.map((input) => (<div className="formbold-input-flex" key={input.id}>
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
                        <label htmlFor="file" className="formbold-form-label"><BsImage /></label>
                        <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </div>

                    <button className="formbold-btn" type="submit" disabled={per !== null && per < 100}>
                        Thêm
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewUser