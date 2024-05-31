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
    const valueData = collection(db, "Borrow");
    const [borrowData, setBorrowData] = useState([]);

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

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Borrow"), (snapshot) => {
            let borrowList = [];
            snapshot.docs.forEach((doc) => {
                borrowList.push({ id: doc.id, ...doc.data() });
            });
            setBorrowData(borrowList);
        });

        return () => {
            unsubscribe();
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
                    console.log(setUserDetails);
                } else {
                    console.log("No such document!");
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleBorrow = async (id) => {
        const device = data.find(item => item.id === id);
        if (device) {
            const formattedDate = format(new Date(), "dd-MM-yyyy");
            const formattedTime = new Date().toLocaleTimeString();

            // Sử dụng giá trị cục bộ thay vì sử dụng userDetails trực tiếp
            const { email, userName, userClass, userMSSV } = userDetails;

            try {
                await addDoc(valueData, {
                    userEmail: email,
                    userName: userName,
                    userClass: userClass,
                    userMSSV: userMSSV,
                    date: formattedDate,
                    time: formattedTime,
                    deviceName: device.devicename,
                    seri: device.seri,
                    status: "Yêu cầu"
                });
                alert("Đã mượn thiết bị !");
            } catch (error) {
                console.log(error);
            }
        } else {
        }
    };

    // const getStatus = (device) => {
    //     const borrowItem = borrowData.find(item => item.deviceName === device.devicename);
    //     if (borrowItem) {
    //         if (borrowItem.status === "Yêu cầu" || borrowItem.status === "Đã duyệt" || borrowItem.status === "Đang mượn") {
    //             return "Đã mượn";
    //         } else if (borrowItem.status === "Đã trả") {
    //             return "Còn thiết bị";
    //         }
    //     }
    //     return "Còn thiết bị";
    // };

    // const getStatus = (device) => {
    //     const latestBorrowData = borrowData.reduce((latestData, item) => {
    //         if (item.deviceName === device.devicename && (!latestData || new Date(item.date + " " + item.time) > new Date(latestData.date + " " + latestData.time))) {
    //             return item;
    //         }
    //         return latestData;
    //     }, null);

    //     if (latestBorrowData) {
    //         if (latestBorrowData.status === "Yêu cầu" || latestBorrowData.status === "Đã duyệt" || latestBorrowData.status === "Đang mượn") {
    //             return "Đã mượn";
    //         }
    //     }
    //     return "Còn thiết bị";
    // };

    const getStatus = (device) => {
        const hasRequestedOrApproved = borrowData.some(item => {
            return item.deviceName === device.devicename &&
                (item.status === "Yêu cầu" || item.status === "Đã duyệt" || item.status === "Đang mượn");
        });

        return hasRequestedOrApproved ? "Đã mượn" : "Còn thiết bị";
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
                            <th>Status</th>
                            <th>BorrowDevice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((data) => {
                            return search.toLowerCase() === ''
                                ? data
                                : data.devicename.toLowerCase().includes(search);
                        }).map((data, index) => {
                            // const borrowItem = borrowData.find(item => item.deviceName === data.devicename);
                            // const status = borrowItem ? borrowItem.status : "Còn thiết bị";
                            // const status = borrowItem ? (borrowItem.status === "Đã trả" ? "Còn thiết bị" : borrowItem.status) : "Còn thiết bị";
                            const status = getStatus(data);
                            return (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td><img className="imgDevices" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0' }} src={data.img || "https://images.pexels.com/photos/14371564/pexels-photo-14371564.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"} /></td>
                                    <td>{data.devicename}</td>
                                    <td>{data.seri}</td>
                                    {/* <td>{data.status}</td>
                                    <td>
                                        <div className="form-container">
                                            <button
                                                className="form-button"
                                                onClick={() => handleBorrow(data.id)}
                                            >
                                                Borrow
                                            </buttono>
                                        </div>
                                    </td> */}
                                    <td>{status}</td>
                                    <td>
                                        <div className="form-container">
                                            <button
                                                className="form-button"
                                                onClick={() => handleBorrow(data.id)}
                                                disabled={status === "Đã mượn"}
                                                style={{ opacity: status === "Đã mượn" ? 0.2 : 1 }}
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
