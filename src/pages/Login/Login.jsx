import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ⬅️ Toast import
import "./Login.css";
import Loginfrom from "../../components/LoginFrom/Loginfrom";
import Loader from "../../components/Loader/Loader";

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

        setLoading(true); // 🔥 start loader

        try {
            const response = await axios.post("http://localhost:8000/auth/login", {
                userId,
                password,
            });

            if (response.data.success === true) {
                toast.success("Login successful! Redirecting...");
                localStorage.setItem("authToken", response.data.token);

                setTimeout(() => navigate("/dashboard"), 1000);
            } else {
                toast.error("Invalid credentials, please try again!");
            }
        } catch (error) {
            toast.error("Server error! Please try after sometime.");
        } finally {
            setLoading(false); // 🚫 stop loader after axios returns
        }
    };


    return (
        <div className="loginpage">
            {loading && (
                <Loader/>
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
