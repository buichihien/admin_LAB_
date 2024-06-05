import React, { useEffect, useState } from "react";
import "./devices.css";
import { FcSearch } from "react-icons/fc";
import { collection, onSnapshot, updateDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Devices = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [userDetails, setUserDetails] = useState({ email: "", userName: "", userClass: "", userMSSV: "" });
    const valueData = collection(db, "Borrow");
    const [borrowData, setBorrowData] = useState([]);
    const [borrowDate, setBorrowDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

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
        if (selectedDevice) {
            const formattedDate = format(new Date(), "dd-MM-yyyy");
            const formattedTime = new Date().toLocaleTimeString();
            const formattedBorrowDate = format(borrowDate, "dd-MM-yyyy");
            const formattedReturnDate = format(returnDate, "dd-MM-yyyy");

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
                    borrowDate: formattedBorrowDate,
                    returnDate: formattedReturnDate,
                    deviceName: selectedDevice.devicename,
                    seri: selectedDevice.seri,
                    // deviceName: device.devicename,
                    // seri: device.seri,
                    status: "Yêu cầu"
                });
                alert("Đã mượn thiết bị !!!");
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        } else {
        }
    };

    const openModal = (device) => {
        setSelectedDevice(device);
        setIsModalOpen(true);
    };

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
                    <input type="text" placeholder="Tìm thiết bị" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>Tên thiết bị</th>
                            <th>Seri</th>
                            <th>Trạng thái</th>
                            <th>Mượn thiết bị</th>
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
                                                //onClick={() => handleBorrow(data.id)}
                                                onClick={() => openModal(data)}
                                                disabled={status === "Đã mượn"}
                                                style={{ opacity: status === "Đã mượn" ? 0.2 : 1 }}
                                            >
                                                Mượn
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 style={{ marginBottom: '15px' }}>Mượn thiết bị</h2>
                        <div>
                            <label>Ngày mượn: </label>
                            <DatePicker selected={borrowDate} onChange={(date) => setBorrowDate(date)} />
                        </div>
                        <div>
                            <label>Ngày trả: </label>
                            <DatePicker selected={returnDate} onChange={(date) => setReturnDate(date)} />
                        </div>
                        <button className="form-button" onClick={handleBorrow}>Xác nhận</button>
                        <button className="form-button2" onClick={() => setIsModalOpen(false)}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Devices;
