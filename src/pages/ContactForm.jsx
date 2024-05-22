import React, { useState, useEffect } from "react";
// import "./ContactForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import { firestore } from "../Firebase";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, where, query, updateDoc } from "firebase/firestore";

function ContactForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("Only authenticated users can submit the form.");
      return;
    }
    try {
      await addDoc(collection(firestore, "contacts"), {
        ...formValues,
        userId: user.uid // Associate the contact message with the user's ID
      });
      // Reset form or give feedback
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const [userData, setUserData] = useState(null);
    const history = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) { // Ensure currentUser is not null
                try {
                    const q = query(collection(firestore, "users"), where("email", "==", auth.currentUser.email));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        // Assuming the email is unique and only one document will be returned
                        setUserData(doc.data()); // Set user data with the document's data
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('No user currently logged in');
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = () => {
        auth.signOut();
        history("/login");
    };

  return (
    <>
    <Header />
    <div>
    <ul className="nav nav-tabs justify-content-between">
        <li className="d-flex registration align-items-center">
          <h4 className="m-0">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Student Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h4>
        </li>
        <li className="nav-item p-1">
          <Link to="/userprofile" className="nav-link text-success fw-medium d-flex align-items-center justify-content-space-evenly">
            <div className="rounded-circle overflow-hidden"></div>
            <i class="bi bi-speedometer2"></i>&nbsp;Dashboard
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link to="/studentdash" className="nav-link text-success fw-medium d-flex align-items-center justify-content-center">
            <div className="rounded-circle overflow-hidden"></div>
            <i class="bi bi-person-fill"></i>&nbsp;Profile
          </Link>
        </li>
        {/* <li className="nav-item p-1">
          <Link to="/contact" className="nav-link text-success fw-medium d-flex align-items-center justify-content-center">
            <div className="rounded-circle overflow-hidden"></div>
            <i class="bi bi-person-lines-fill"></i>&nbsp;Contact
          </Link>
        </li> */}
        <li className="nav-item dropdown userAction ms-auto p-1">
          <a className="nav-link text-success dropdown-toggle userAction" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Welcome {userData ? userData.firstName : "Guest"}! &nbsp; <i className="bi bi-person-circle"></i>
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/studentdash">Dashboard</a></li>
            <li><a className="dropdown-item" onClick={handleSignOut} href="#">Logout</a></li>
          </ul>
        </li>
      </ul>

      <div className="container">
        <div className="form">
          <div className="contact-info">
            <h3 className="title">Leave a message</h3>
            <p className="text">
              Please write the subject matter clearly, include your roll no. and avoid personal communication.
            </p>

            <div className="info">
              <div className="information">
                <i className="fas fa-map-marker-alt"></i> &nbsp;&nbsp;
                <p>C-II79, BIT Mesra, Ranchi-835215</p>
              </div>
              <div className="information">
                <i className="fas fa-envelope"></i> &nbsp;&nbsp;
                <p>kspatnaik@bitmesra.ac.in</p>
              </div>
              <div className="information">
                <i className="fas fa-phone"></i>&nbsp;&nbsp;
                <p>06512275444</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <h3 className="title">Contact us</h3>
              <div className="input-container">
                <input type="text" name="name" className="input" value={formValues.name} onChange={handleInputChange} />
                <label>Name</label>
                <span>Username</span>
              </div>
              <div className="input-container">
                <input type="email" name="email" className="input" value={formValues.email} onChange={handleInputChange} />
                <label>Email</label>
                <span>Email</span>
              </div>
              <div className="input-container">
                <input type="tel" name="phone" className="input" value={formValues.phone} onChange={handleInputChange} />
                <label>Phone</label>
                <span>Phone</span>
              </div>
              <div className="input-container textarea">
                <textarea name="message" className="input" value={formValues.message} onChange={handleInputChange}></textarea>
                <label>Message</label>
                <span>Message</span>
              </div>
              <input type="submit" value="Send" className="btn" />
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default ContactForm;
