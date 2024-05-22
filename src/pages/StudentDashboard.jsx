import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { auth, firestore } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function UserProfile() {
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
      <ul className="nav nav-tabs ">
        <li className="d-flex registration align-items-center">
          <h4 className="m-0">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Student Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h4>
        </li>
        <li className="nav-item p-1">
          <Link to="/studentdash" className="nav-link text-success fw-medium d-flex align-items-center justify-content-space-evenly">
            <div className="rounded-circle overflow-hidden"></div>
            &nbsp;<i class="bi bi-speedometer2"></i>&nbsp;Dashboard
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link to="/userprofile" className="nav-link text-success fw-medium d-flex align-items-center justify-content-center">
            <div className="rounded-circle overflow-hidden"></div>
            &nbsp;<i class="bi bi-person-fill"></i>&nbsp;Profile
          </Link>
        </li>
        <li className="nav-item dropdown userAction ms-auto p-1">
          <a className="nav-link text-success dropdown-toggle userAction" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Welcome {userData ? userData.firstName : "Guest"}! &nbsp; <i className="bi bi-person-circle"></i>
          </a>
          <ul className="dropdown-menu">
            {/* <li><a className="dropdown-item" href="/studentdash">Dashboard</a></li> */}
            <li><a className="dropdown-item" onClick={handleSignOut} href="/">Logout</a></li>
          </ul>
        </li>
      </ul>

      <section style={{ backgroundColor: '#eee' }}>
        {userData && (
          <div className="container py-5">
            <div className="row">
              <div className="col-lg-3">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    {userData && userData.imageUrl && (
                      <img
                        src={userData.imageUrl}
                        className="rounded img-fluid w-50"
                        alt="User"
                      />
                    )}
                    <h5 className="my-3">{userData ? (
                      <p className="mb-0">{userData.firstName} {userData.middleName} {userData.lastName}</p>
                    ) : (
                      <p>Loading user data...</p>
                    )}</h5>
                    {/* <p className="text-muted mb-0 mt-0"> {userData && (
                                            <div>
                                               {userData.roll && <p>{userData.roll}</p>}
                                            </div>
                                        )}</p> */}
                    <p className="text-muted mb-1">Roll No: {userData.roll}</p>
                    <p className="text-muted mb-1">Skills: {userData.skills}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <div className="card mb-4 ml-3">
                  <div className="card-body mx-3">
                    {/* Display user details */}
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Full Name</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0"></p>
                      </div>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{userData.firstName} {userData.middleName} {userData.lastName}</p>
                    </div>

                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Roll No</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.roll}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Email</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.email}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Mobile</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.phoneNumber}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Skills</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.skills}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Internships</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.internships}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Achievements</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.achievements}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Post Graduation</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.postGradCollege}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">CGPA</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.semesterResult}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Hobbies</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.hobbies}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Extra Curricular</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{userData.extraCurricular}</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section >
      <Footer />
    </>
  );
}

export default UserProfile;
