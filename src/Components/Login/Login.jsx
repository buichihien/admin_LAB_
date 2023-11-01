import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./login.scss";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";


const Login = () => {
    const [error, setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const {dispatch} = useContext(AuthContext)

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword (auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;  
            dispatch({type:"LOGIN", payload:user})     
            navigate("/")         
        })
        .catch((error) => {
            setError(true)
            console.log(error)
        });
    }

    return (
        <div className="containerLogin">
            <div className="screen">
                <div className="screen__content">
                    <form className="login" onSubmit={handleLogin}>
                        <div className="login__field">
                            <i className="login__icon fas fa-user"></i>
                            <input type="email" className="login__input" placeholder="User name / Email" onChange={e=>setEmail(e.target.value)}/>
                        </div>
                        <div className="login__field">
                            <i className="login__icon fas fa-lock"></i>
                            <input type="password" className="login__input" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
                        </div>
                        <button className="button login__submit" type="submit">
                            <span className="button__text">Log In Now</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    {error && <span className="error">Wrong Email or password</span>}
                    <div className="social-login">
                        <h3>Log in via</h3>
                        <div className="social-icons">
                            <a href="#" className="social-login__icon fab fa-instagram"></a>
                            <a href="#" className="social-login__icon fab fa-facebook"></a>
                            <a href="#" className="social-login__icon fab fa-twitter"></a>
                        </div>
                    </div>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}

export default Login