import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ⬅️ Toast import
import "./Login.css";
import Loginfrom from "../../components/LoginFrom/Loginfrom";
import Loader from "../../components/Loader/Loader";
import SERVER_URL from "../../../backendUrl";

const slides = [
    {
        title: "Empowered Learning",
        subtitle:
            "Experience AI-powered education that adapts to your pace and goals.",
    },
    {
        title: "Learn. Build. Succeed.",
        subtitle:
            "Turn your ideas into real-world solutions through guided learning paths.",
    },
    {
        title: "Future-Ready Skills",
        subtitle:
            "Master industry-relevant technologies designed for tomorrow’s opportunities.",
    },
    {
        title: "Driven by Innovation",
        subtitle:
            "Experience learning powered by creativity, technology, and structured guidance.",
    },
    {
        title: "From Learner to Leader",
        subtitle:
            "Transform your knowledge into confidence and lead with proven skillsets.",
    },
];

export default function Login() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);


    // AUTO-SLIDE EVERY 2 SECONDS
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    // 🔐 HANDLE LOGIN CALL TO BACKEND WITH TOAST NOTIFICATIONS
    const handleLogin = async () => {
        if (!userId || !password) {
            toast.warning("Please enter User ID and Password!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${SERVER_URL}/api/user/loginUser`, {
                userId,
                password
            });

            if (response.data.success) {
                toast.success(response.data.message);

                // Store User ID or Token Here (you didn't have token in backend yet)
                localStorage.setItem("userId", response.data.user.userId);
                localStorage.setItem("loginTime", Date.now()); // store current time in ms


                setTimeout(() => {
                    navigate("/dashboard"); // move to dashboard
                    setLoading(false); // stop loader AFTER redirect
                }, 1000);

            } else {
                toast.error(response.data.message); // handles backend failure
                setLoading(false);
            }

        } catch (error) {
            // Distinguish between backend error & network error
            if (error.response) {
                // Backend sent an error
                toast.error(error.response.data.message || "Login failed!");
            } else {
                // No response means internet/server issue
                toast.error("Internet Issue OR Server down!");
            }
            setLoading(false);
        }
    };



    return (
        <div className="loginpage">
            {loading && (
                <Loader />
            )}


            {/* LEFT PART WITH SLIDER */}
            <div className="leftpart">
                <div className="textslider">
                    <h1 className="fade-text">{slides[index].title}</h1>
                    <p className="fade-text">{slides[index].subtitle}</p>

                    <div className="slider-lines">
                        {slides.map((_, i) => (
                            <span
                                key={i}
                                className={`line ${index === i ? "active" : ""}`}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PART FORM */}
            <div className="rightpart">
                <div className="loginform">
                    <Loginfrom
                        userId={userId}
                        password={password}
                        onUserIdChange={(e) => setUserId(e.target.value)}
                        onPasswordChange={(e) => setPassword(e.target.value)}
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </div>
    );
}
