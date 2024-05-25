import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { collection, onSnapshot, updateDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { format } from "date-fns";

const Devices = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [userDetails, setUserDetails] = useState({ email: "", userName: "", userClass: "", userMSSV: "" });
    const [borrowQuantities, setBorrowQuantities] = useState({});
    const valueData = collection(db, "Borrow");

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
        });

        return () => {
            unsub();
        };
    }, []);

    // Lấy thông tin người dùng đang đăng nhập
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userEmail = user.email;
                // Giả sử bạn có một bộ sưu tập "Users" chứa thông tin chi tiết của người dùng
                const userDoc = doc(db, "Users", user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserDetails({
                        email: userEmail,
                        userName: userData.username, // Điều chỉnh cho phù hợp với cấu trúc dữ liệu của bạn
                        userClass: userData.class, // Điều chỉnh cho phù hợp với cấu trúc dữ liệu của bạn
                        userMSSV: userData.mssv // Điều chỉnh cho phù hợp với cấu trúc dữ liệu của bạn
                    });
                } else {
                    console.log("No such document!");
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleBorrow = async (productId) => {
        const device = data.find(item => item.id === productId);

        const quantityToBorrow = parseInt(borrowQuantities[productId], 10);
        if (!isNaN(quantityToBorrow) && quantityToBorrow > 0 && quantityToBorrow <= device.quantity) {
            const deviceRef = doc(db, "Device", productId);
            await updateDoc(deviceRef, { quantity: device.quantity - quantityToBorrow });

            try {
                const formattedDate = format(new Date(), "dd-MM-yyyy");

                await addDoc(valueData, {
                    userEmail: userDetails.email,
                    userName: userDetails.userName,
                    userClass: userDetails.userClass,
                    userMSSV: userDetails.userMSSV,
                    date: formattedDate,
                    time: new Date().toLocaleTimeString(),
                    deviceName: device.devicename,
                    quantity: quantityToBorrow,
                    status: "Đã mượn"
                });

                setBorrowQuantities(prevState => ({ ...prevState, [productId]: "" }));

                console.log(`Borrowed ${quantityToBorrow} items from device with ID ${productId}`);
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please enter a valid quantity to borrow.");
        }
    };

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Devices" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>DeviceName</th>
                            <th>Seri</th>
                            <th>Quantity</th>
                            <th>BorrowDevice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data) => {
                            return search.toLowerCase() === ''
                                ? data
                                : data.devicename.toLowerCase().includes(search);
                        }).map((data, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td><img className="imgDevices" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0' }} src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{data.devicename}</td>
                                    <td>{data.seri}</td>
                                    <td>{data.quantity}</td>
                                    <td>
                                        <div className="form-container">
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Quantity to Borrow"
                                                value={borrowQuantities[data.id] || ""}
                                                onChange={(e) => setBorrowQuantities(prevState => ({ ...prevState, [data.id]: e.target.value }))}
                                            />
                                            <button
                                                className="form-button"
                                                onClick={() => handleBorrow(data.id)}
                                            >
                                                Borrow
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Devices;
