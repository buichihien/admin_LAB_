import React, { useEffect, useState } from "react";
import "./bookingRoom.scss";
import { auth, db } from "../../firebase";
import { addDoc, collection, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router";

const BookingRoom = () => {
    const [date, setDate] = useState('');
    const [selectedTimes, setSelectedTimes] = useState([]); // Trạng thái cho các tiết được chọn
    const [data, setData] = useState({});
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState("");  // Trạng thái cho thông báo lỗi
    const [bookedSlots, setBookedSlots] = useState([]); // Trạng thái cho các tiết đã được đặt
    const valueData = collection(db, "Room");
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        let newDate = `${day}-${month}-${year}`;
        return newDate;
    };

    useEffect(() => {
        // Lấy người dùng hiện tại khi thành phần được gắn vào
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserEmail(user.email);
                const userDocRef = doc(db, "Users", user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setData({ ...data, username: userData.username, mssv: userData.mssv, class: userData.class, phone: userData.phone });
                }
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Lấy thông tin các tiết đã được đặt trước khi ngày thay đổi
        if (date) {
            const q = query(valueData, where("date", "==", formatDate(date)));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const slots = [];
                querySnapshot.forEach((doc) => {
                    slots.push(doc.data().time);
                });
                setBookedSlots(slots);
            });
            return () => unsubscribe();
        }
    }, [date]);

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            setError("Ngày không được nhỏ hơn ngày hiện tại");
        } else {
            setError("");
            setDate(e.target.value);
        }
    }

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTimes((prevSelectedTimes) =>
            checked ? [...prevSelectedTimes, value] : prevSelectedTimes.filter((time) => time !== value)
        );
    };

    const handleADD = async (e) => {
        e.preventDefault();
        if (error) {
            alert("Không thể thêm: " + error);
            return;
        }
        try {
            const formattedDate = formatDate(date);
            for (let time of selectedTimes) {
                await addDoc(valueData, { ...data, date: formattedDate, time, userEmail });
            }
            navigate(-1);
        } catch (error) {
            console.log(error);
        }
    }

    const slots = ["Tiết 1 (sáng)", "Tiết 2 (sáng)", "Tiết 3 (sáng)", "Tiết 4 (sáng)", "Tiết 5 (sáng)", "Tiết 1 (chiều)", "Tiết 2 (chiều)", "Tiết 3 (chiều)", "Tiết 4 (chiều)", "Tiết 5 (chiều)"];

    return (
        <div className="formbold-main-wrapper">
            <div className="formbold-form-wrapper">
                <h1>Booking</h1>
                <form onSubmit={handleADD}>
                    <div>
                        <input type="date" className="date" onChange={handleDateChange}></input>
                    </div>
                    <div class="slots-legend">
                        <h3>Chú thích thời gian:</h3>
                        <div>
                            <div class="slot-legend">Tiết 1 <span class="time-of-day">sáng</span>- 7:30 - 8:15</div>
                            <div class="slot-legend">Tiết 2 <span class="time-of-day">sáng</span>- 8:15 - 9:00</div>
                            <div class="slot-legend">Tiết 3 <span class="time-of-day">sáng</span>- 9:15 - 10:00</div>
                            <div class="slot-legend">Tiết 4 <span class="time-of-day">sáng</span>- 10:00 - 10:45</div>
                            <div class="slot-legend">Tiết 5 <span class="time-of-day">sáng</span>- 10:45 - 11:30</div>
                        </div>
                        <div>
                            <div class="slot-legend">Tiết 1 <span class="time-of-day1">chiều</span>- 12:45 - 13:30</div>
                            <div class="slot-legend">Tiết 2 <span class="time-of-day1">chiều</span>- 13:30 - 14:15</div>
                            <div class="slot-legend">Tiết 3 <span class="time-of-day1">chiều</span>- 14:30 - 15:15</div>
                            <div class="slot-legend">Tiết 4 <span class="time-of-day1">chiều</span>- 15:15 - 16:00</div>
                            <div class="slot-legend">Tiết 5 <span class="time-of-day1">chiều</span>- 16:00 - 16:45</div>
                        </div>
                    </div>
                    <div className="slots">
                        {slots.map((slot, index) => (
                            <label key={index} className={`slot ${bookedSlots.includes(slot) ? "booked" : ""}`}>
                                <input
                                    type="checkbox"
                                    value={slot}
                                    disabled={bookedSlots.includes(slot)}
                                    onChange={handleCheckboxChange}
                                />
                                {slot} {bookedSlots.includes(slot) ? "(Đã đặt)" : ""}
                            </label>
                        ))}
                    </div>
                    <button className="formbold-btn" type="submit">
                        ADD
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BookingRoom;
