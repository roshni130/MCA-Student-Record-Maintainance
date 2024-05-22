import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import BITlogo from "../assets/BITlogo.png";
import student from "../assets/student.jpg";
import faculty from "../assets/faculty.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, firestore } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Navigate = useNavigate();
  const historyref = useNavigate();

  const handleStudentLogin = async (event) => {
    setError(null);
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("All fields are required!");
    } else {
      setLoading(true);

      try {
        console.log(email)
        const q = query(
          collection(firestore, "STUDENTS"),
          where("email", "==", email)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("User doesn't exist or not a student");
        } else {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("Signed in user:", user);
              Navigate("/studentdash");
            })
            .catch((e) => {
              console.log(e.code);
              if (e.code === "auth/invalid-credential")
                setError("Incorrect password !");
              if (e.code === "auth/too-many-requests")
                setError(
                  "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
                );
              setLoading(false);
            });
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        setLoading(false);
      }
    }
  };

  const handleFacultyLogin = async (event) => {
    setError(null);
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("All fields are required!");
    } else {
      setLoading(true);

      try {
        console.log(email);
        const q = query(
          collection(firestore, "FACULTIES"),
          where("email", "==", email)
        );
        console.log(q);

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("User doesn't exist or is not a faculty");
        } else {
          console.log("Entered into faculty login function");
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("Signed in user:", user);
              Navigate("/facultydash");
            })
            .catch((e) => {
              console.log(e.code);
              if (e.code === "auth/invalid-credential")
                setError("Incorrect password !");
              if (e.code === "auth/too-many-requests")
                setError(
                  "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
                );
              setLoading(false);
            });
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        alert("Failed to check user existence.");
      }
    }
  };

  useEffect(() => {
    console.log(auth.currentUser);
    if (auth.currentUser) {
      historyref("/");
    }
  }, [auth.currentUser, historyref]);

  const [visibleForm, setVisibleForm] = useState("studentForm");

  const handleStudentImageClick = () => {
    setVisibleForm("studentForm");
  };

  const handleFacultyImageClick = () => {
    setVisibleForm("facultyForm");
  };

  const showLoginForm = (formId) => {
    return visibleForm === formId ? "d-block" : "d-none";
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container justify-content-center align-items-center loginDiv my-5 mt-5">
          <div className="row">
            <div className="acctypeimg col text-center">
              <div id="chooseacctext" className="m-auto">
                | Choose Account type
              </div>
              <img
                src={student}
                alt="student Login"
                className="img m-auto"
                id="studentImg"
                onClick={handleStudentImageClick}
              />
              <img
                src={faculty}
                alt="faculty Login"
                className="img m-auto"
                id="facultyImg"
                onClick={handleFacultyImageClick}
              />
            </div>

            <div className="login-form col">
              <div id="studentForm" className={showLoginForm("studentForm")}>
                <form id="loginForm" className="">
                  <div className="wrapper p-auto">
                    <div className="logo mb-3">
                      <img src={BITlogo} alt="" />
                    </div>
                    <div className="moto3 text-center mb-3">
                      <h5> Student Login </h5>
                    </div>

                    <div
                      id="loginForm"
                      className="form-field d-flex align-items-center form-group"
                    >
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="Email"
                      />
                    </div>

                    <div className="form-field d-flex align-items-center form-group">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        name="password"
                        id="password"
                        placeholder="Password"
                      />
                    </div>

                    <button
                      className="btn"
                      type="button"
                      id="loginButton"
                      onClick={handleStudentLogin}
                    >
                      Login
                    </button>
                    <div className="fs-4 fw-bold m-auto">
                      <a href="/">Forget password?</a>
                    </div>
                  </div>
                </form>
              </div>
              <div id="facultyForm" className={showLoginForm("facultyForm")}>
                <form id="loginForm1" className="">
                  <div className="wrapper p-auto">
                    <div className="logo mb-3">
                      <img src={BITlogo} alt="" />
                    </div>
                    <div className="moto3 text-center mb-3">
                      <h5> Faculty Login</h5>
                    </div>

                    <div
                      id="loginForm"
                      className="form-field d-flex align-items-center form-group"
                    >
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        name="email"
                        id="email1"
                        placeholder="Email"
                      />
                    </div>

                    <div className="form-field d-flex align-items-center form-group">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        name="password"
                        id="password1"
                        placeholder="Password"
                      />
                    </div>

                    <button
                      className="btn"
                      type="button"
                      id="loginButton1"
                      onClick={handleFacultyLogin}
                    >
                      Login
                    </button>
                    <div className="fs-4 fw-bold m-auto">
                      <a href="/">Forget password?</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;
