import React, { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc, addDoc } from "firebase/firestore";
import { format } from "date-fns";
import { db } from "../../firebase";

const BorrowDevice = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [activeButton, setActiveButton] = useState('yc');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Borrow"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.date && data.time) {
                    list.push({ id: doc.id, ...data });
                }
            });
            if (list.length > 0) {
                list.sort((a, b) => {
                    const dateComparison = a.date.localeCompare(b.date);
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    return a.time.localeCompare(b.time);
                });
            }
            setData(list);
        },
            (err) => {
                console.log(err);
            });
        return () => {
            unsub();
        };
    }, []);

    const handleDelete = async (id) => {
        const deleteVal = doc(db, "Borrow", id);
        await deleteDoc(deleteVal);
    };

    const handleApprove = async (id) => {
        const borrowRef = doc(db, "Borrow", id);
        const borrowDoc = await getDoc(borrowRef);
        const borrowData = borrowDoc.data();

        const now = new Date();
        const currentDate = format(now, "dd-MM-yyyy");
        const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        await updateDoc(borrowRef, {
            status: "Đã duyệt",
            approvedDateTime: `${currentDate} ${currentTime}`,
            // requestDateTime: `${borrowData.requestDate} ${borrowData.requestTime}`
        });
    };

    const handleBorrow = async (id) => {
        const borrowRef = doc(db, "Borrow", id);
        const borrowDoc = await getDoc(borrowRef);
        const borrowData = borrowDoc.data();

        const now = new Date();
        const currentDate = format(now, "dd-MM-yyyy");
        const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        await updateDoc(borrowRef, {
            status: "Đang mượn",
            borrowingDateTime: `${currentDate} ${currentTime}`,
            // approvedDateTime: `${borrowData.approvedDate} ${borrowData.approvedTime}`,
            // requestDateTime: `${borrowData.requestDate} ${borrowData.requestTime}`
        });
    };

    const handleReturn = async (id) => {
        const borrowRef = doc(db, "Borrow", id);
        const borrowDoc = await getDoc(borrowRef);
        const borrowData = borrowDoc.data();

        const now = new Date();
        const currentDate = format(now, "dd-MM-yyyy");
        const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        await updateDoc(borrowRef, {
            status: "Đã trả",
            returnedDateTime: `${currentDate} ${currentTime}`,
            // borrowingDateTime: `${borrowData.borrowingDate} ${borrowData.borrowingTime}`,
            // approvedDateTime: `${borrowData.approvedDate} ${borrowData.approvedTime}`,
            // requestDateTime: `${borrowData.requestDate} ${borrowData.requestTime}`
        });       
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    // Hàm lọc dữ liệu dựa trên trạng thái của yêu cầu
    const filterDataByStatus = (status) => {
        return data.filter(item => item.status === status);
    };

    return (
        <div className="mainContent">
            <div className="top">
                <div className="searchBar flex">
                    <input type="text" placeholder="Tìm kiếm người dùng" onChange={(e) => setSearch(e.target.value)} />
                    <FcSearch className="icon" />
                </div>
                <div className="buttons">
                    <button className={`button yc ${activeButton === 'yc' ? 'active' : ''}`} onClick={() => handleButtonClick('yc')}>Yêu cầu <span style={{ color: 'yellow' }}>({filterDataByStatus('Yêu cầu').length})</span></button>
                    <button className={`button ddy ${activeButton === 'ddy' ? 'active' : ''}`} onClick={() => handleButtonClick('ddy')}>Đã duyệt <span style={{ color: 'yellow' }}>({filterDataByStatus('Đã duyệt').length})</span></button>
                    <button className={`button dmg ${activeButton === 'dmg' ? 'active' : ''}`} onClick={() => handleButtonClick('dmg')}>Đang mượn <span style={{ color: 'yellow' }}>({filterDataByStatus('Đang mượn').length})</span></button>
                    <button className={`button dtr ${activeButton === 'dtr' ? 'active' : ''}`} onClick={() => handleButtonClick('dtr')}>Đã trả <span style={{ color: 'yellow' }}>({filterDataByStatus('Đã trả').length})</span></button>
                </div>
            </div>

            <div className="header_fixed">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên người dùng</th>
                            <th>Lớp</th>
                            <th>MSSV</th>
                            <th>Tên thiết bị</th>
                            <th>Seri</th>
                            <th>Thời gian</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeButton === 'yc' && filterDataByStatus('Yêu cầu').map((filteredData, index) => (
                            <tr key={filteredData.id}>
                                <td>{index + 1}</td>
                                <td>{filteredData.userName}</td>
                                <td>{filteredData.userClass}</td>
                                <td>{filteredData.userMSSV}</td>
                                <td>{filteredData.deviceName}</td>
                                <td>{filteredData.seri}</td>
                                <td>{`${filteredData.date} ${filteredData.time}`}</td>
                                <td className="status-cell">
                                    <button className="approve" style={{ fontSize: '15px', backgroundColor: 'aqua', borderRadius: '7px', padding: '10px' }} onClick={() => handleApprove(filteredData.id)}>
                                        Duyệt
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {activeButton === 'ddy' && filterDataByStatus('Đã duyệt').map((filteredData, index) => (
                            <tr key={filteredData.id}>
                                <td>{index + 1}</td>
                                <td>{filteredData.userName}</td>
                                <td>{filteredData.userClass}</td>
                                <td>{filteredData.userMSSV}</td>
                                <td>{filteredData.deviceName}</td>
                                <td>{filteredData.seri}</td>
                                <td>
                                    <div>Đã yêu cầu: {filteredData.date} {filteredData.time}</div>
                                    <div>Đã duyệt: {filteredData.approvedDateTime}</div>
                                </td>
                                <td className="status-cell">
                                    <button className="borrow" style={{ fontSize: '15px', backgroundColor: 'aqua', borderRadius: '7px', padding: '10px' }} onClick={() => handleBorrow(filteredData.id)}>
                                        Tiến hành mượn
                                    </button>
                                </td>
                            </tr>
                        ))}


                        {activeButton === 'dmg' && filterDataByStatus('Đang mượn').map((filteredData, index) => (
                            <tr key={filteredData.id}>
                                <td>{index + 1}</td>
                                <td>{filteredData.userName}</td>
                                <td>{filteredData.userClass}</td>
                                <td>{filteredData.userMSSV}</td>
                                <td>{filteredData.deviceName}</td>
                                <td>{filteredData.seri}</td>
                                <td>
                                    <div>Đã yêu cầu: {filteredData.date} {filteredData.time}</div>
                                    {/* {filteredData.approvedDateTime && (
                                        <div>Đã duyệt: {new Date(filteredData.approvedDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                    )} */}
                                    <div>Đã duyệt: {filteredData.approvedDateTime}</div>
                                    <div>Đã mượn: {filteredData.borrowingDateTime}</div>
                                </td>
                                <td className="status-cell">
                                    <button className="returned" style={{ fontSize: '15px', backgroundColor: 'aqua', borderRadius: '7px', padding: '10px' }} onClick={() => handleReturn(filteredData.id)}>
                                        Trả
                                    </button>
                                </td>
                            </tr>
                        ))}





                        {activeButton === 'dtr' && filterDataByStatus('Đã trả').map((filteredData, index) => (
                            <tr key={filteredData.id}>
                                <td>{index + 1}</td>
                                <td>{filteredData.userName}</td>
                                <td>{filteredData.userClass}</td>
                                <td>{filteredData.userMSSV}</td>
                                <td>{filteredData.deviceName}</td>
                                <td>{filteredData.seri}</td>
                                <td>
                                    <div>Đã yêu cầu: {filteredData.date} {filteredData.time}</div>
                                    <div>Đã duyệt: {filteredData.approvedDateTime}</div>
                                    <div>Đã mượn: {filteredData.borrowingDateTime}</div>
                                    <div>Đã trả: {filteredData.returnedDateTime}</div>
                                </td>
                                <td className="status-cell">
                                    <div className="returned-action">
                                        <button onClick={() => handleDelete(filteredData.id)}>
                                            <RiChatDeleteFill className="icon2" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}



                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BorrowDevice;
