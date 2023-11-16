import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { Personnel } from "../../formSoure";
import { BsImage } from 'react-icons/bs';
import { useNavigate } from "react-router";

const EditPersonnel = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const navigate = useNavigate();
    const valueData = collection(db, "Personnel");

    useEffect(() => {
        const uploadFile = () => {
            if (file) {
                const name = new Date().getTime() + file.name;
                const storageRef = ref(storage, name);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        setPerc(progress);
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
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setData((prev) => ({ ...prev, img: downloadURL }));
                        });
                    }
                );
            }
        };
        uploadFile();
    }, [file]);

    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(valueData, "Personnel");
    
            // Kiểm tra xem tài liệu có tồn tại không
            const docSnapshot = await getDoc(docRef);
    
            if (docSnapshot.exists()) {
                // Tài liệu tồn tại, cập nhật nó
                await updateDoc(docRef, data);
                navigate(-1);
            } else {
                console.log("Tài liệu không tồn tại.");
                // Xử lý trường hợp tài liệu không tồn tại (nếu cần)
            }
        } catch (error) {
            console.log(error);
        }
    };        

    return (
        <div className="formbold-main-wrapper">
            <div className="formbold-form-wrapper">
                <h1>Edit Personnel</h1>
                <form onSubmit={handleEdit}>
                    {Personnel.map((input) => (
                        <div className="formbold-input-flex" key={input.id}>
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
                        </div>
                    ))}
                    <div className="image">
                        <label htmlFor="file" className="formbold-form-label"><BsImage/></label>
                        <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </div>
                    <button
                        className="formbold-btn"
                        type="submit"
                        disabled={per !== null && per < 100}
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPersonnel;
