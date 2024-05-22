import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { firestore } from "../Firebase";
import { auth } from "../Firebase";
import { storage } from "../Firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function StudentDashboard() {
  const [FormData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    roll: "",
    gender: "",
    address: "",
    phoneNumber: "",
    city: "",
    state: "",
    zip: "",
    nationality: "",
    role: "",
    imageUrl: "",
    highschoolname: "",
    highschoolcompletionyear: "",
    highschoolstream: "",
    undergradcollege: "",
    underGradCompletionYear: "",
    underGradCourse: "",
    internships: "",
    achievements: "",
    postGradCollege: "",
    semesterResult: "",
    skills: "",
    hobbies: "",
    extraCurricular: "",
    experiences: "",
  });

  const history = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [currentUserData, setCurrentUserData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setImageFile(file); // Store the selected image file

    // Update the FormData state with the selected file URL
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...FormData, imageUrl: reader.result });
      };
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      try {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle state changes if needed
          },
          (error) => {
            console.error("Upload failed:", error);
            // Handle error
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setFormData({ ...FormData, imageUrl: downloadURL }); // Update form data with image URL

              // Store image URL in Firestore
              const userQuery = query(
                collection(firestore, "users"),
                where("email", "==", auth.currentUser.email)
              );
              getDocs(userQuery)
                .then((querySnapshot) => {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                      updateDoc(doc.ref, {
                        imageUrl: downloadURL,
                      });
                    });
                  }
                })
                .catch((error) => {
                  console.error(
                    "Error updating Firestore with image URL:",
                    error
                  );
                  // Handle error
                });
            });
          }
        );
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...FormData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (imageFile) {
        await handleImageUpload();
      }
      // Check if the user already has a document in Firestore
      const userQuery = query(
        collection(firestore, "users"),
        where("email", "==", auth.currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        // If no document found, create a new one
        const docRef = await addDoc(collection(firestore, "users"), {
          ...FormData,
          uid: auth.currentUser.uid, // Include UID in the document data
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Details Updated Successfully!");
      } else {
        // If document found, update the existing document
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            ...FormData,
            uid: auth.currentUser.uid, // Include UID in the document data
          });
        });
        alert("Details Updated Successfully!");
      }
    } catch (e) {
      console.error("Error adding/updating document: ", e);
      alert("An error has occurred while saving your details.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(
          collection(firestore, "users"),
          where("email", "==", auth.currentUser.email)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setFormData(doc.data());
            setCurrentUserData(doc.data());
          });
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleSignOut = () => {
    auth.signOut();
    history("/login");
  };

  useEffect(() => {
    if (!auth.currentUser) {
      history("/login");
    } else {
      console.log("auth.currentUser:", auth.currentUser);
      if (auth.currentUser) {
        if (auth.currentUser.firstName) {
          setCurrentUser(auth.currentUser.firstName);
        } else {
          setCurrentUser(generateName(auth.currentUser));
        }
      }
    }
  }, [history]);

  const generateName = (user) => {
    return `${user.firstName}`;
  };

  return (
    <>
      <Header />
      <ul className="nav nav-tabs justify-content-between">
        <li className="d-flex registration align-items-center">
          <h4 className="m-0">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Student
            Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h4>
        </li>
        <li className="nav-item p-1">
          <Link
            to="/studentdash"
            className="nav-link text-success fw-medium d-flex align-items-center justify-content-space-evenly"
          >
            <div className="rounded-circle overflow-hidden"></div>
            &nbsp;<i class="bi bi-speedometer2"></i>&nbsp;Dashboard
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link
            to="/userprofile"
            className="nav-link text-success fw-medium d-flex align-items-center justify-content-center"
          >
            <div className="rounded-circle overflow-hidden"></div>
            &nbsp;<i class="bi bi-person-fill"></i>&nbsp;Profile
          </Link>
        </li>
        {/* <li className="nav-item p-1">
          <Link to="/contact" className="nav-link text-success fw-medium d-flex align-items-center justify-content-center">
            <div className="rounded-circle overflow-hidden"></div>
            <i class="bi bi-person-lines-fill"></i>&nbsp;Contact
          </Link>
        </li> */}
        <li className="nav-item dropdown userAction ms-auto p-1">
          <a
            className="nav-link text-success dropdown-toggle userAction"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Welcome {currentUserData ? currentUserData.firstName : "Guest"}!
            &nbsp; <i className="bi bi-person-circle"></i>
          </a>
          <ul className="dropdown-menu">
            {/* <li><a className="dropdown-item" href="/studentdash">Dashboard</a></li> */}
            <li>
              <a className="dropdown-item" onClick={handleSignOut} href="#">
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>

      {/* <div className="col-12 mt-0 mb-0">
        <div className="row">
          <section className="">
            <div className="card testimonial-card mt-2 mb-0">
              <div className="card-up aqua-gradient"></div>
              <div className="avatar mx-auto white">
                {currentUserData && currentUserData.imageUrl && (
                  <img
                    src={currentUserData.imageUrl}
                    className="rounded-circle img-fluid"
                    alt="User"
                  />
                )}
              </div>
              <div className="card-body text-center">
                <h4 className="card-title font-weight-bold">{currentUserData ? (
                  <p className="mb-0">{currentUserData.firstName} {currentUserData.middleName} {currentUserData.lastName}</p>
                ) : (
                  <p>Loading user data...</p>
                )}</h4>
                <h6><p className="mb-0">{currentUserData && (
                  <div>
                    {currentUserData.roll && <p>{currentUserData.roll}</p>}
                  </div>
                )}
                </p></h6>
              </div>
            </div>
          </section>
        </div>
      </div> */}

      <div className="login-form mb-4 mt-0" id="submitForm">
        <form onSubmit={handleSubmit}>
          <section className="container student my-2 w-50 text-dark p-2 my-5">
            <fieldset>
              <legend>Personal Information</legend>
              <div className="row g-3 p-3 my-0">
                <div className="col-md-4">
                  <label htmlFor="fname" className="form-label">
                    First name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    name="firstName"
                    value={FormData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="mname" className="form-label">
                    Middle name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mname"
                    name="middleName"
                    value={FormData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="lname" className="form-label">
                    Last name<span className="required-star">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    aria-describedby="inputGroupPrepend2"
                    name="lastName"
                    value={FormData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email<span className="required-star">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" id="inputGroupPrepend2">
                      @
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={FormData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="Password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    autoComplete="new-password"
                    name="password"
                    value={FormData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="roll" className="form-label">
                    Roll Number
                  </label>
                  <input
                    type="roll"
                    className="form-control"
                    id="roll"
                    name="roll"
                    value={FormData.roll}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="form-select"
                    name="gender"
                    value={FormData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Choose...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="Address" className="form-label">
                    Address<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Address"
                    placeholder="1234 Main St"
                    name="address"
                    value={FormData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder=""
                    name="phoneNumber"
                    value={FormData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="City" className="form-label">
                    City<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="City"
                    name="city"
                    value={FormData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State<span className="required-star">*</span>
                  </label>
                  <select
                    id="state"
                    className="form-select"
                    name="state"
                    value={FormData.state}
                    onChange={handleInputChange}
                  >
                    <option value="AP">Andhra Pradesh</option>
                    <option value="AR">Arunachal Pradesh</option>
                    <option value="AS">Assam</option>
                    <option value="BR">Bihar</option>
                    <option value="CT">Chhattisgarh</option>
                    <option value="GA">Gujarat</option>
                    <option value="HR">Haryana</option>
                    <option value="HP">Himachal Pradesh</option>
                    <option value="JK">Jammu and Kashmir</option>
                    <option value="GA">Goa</option>
                    <option value="JH">Jharkhand</option>
                    <option value="KA">Karnataka</option>
                    <option value="KL">Kerala</option>
                    <option value="MP">Madhya Pradesh</option>
                    <option value="MH">Maharashtra</option>
                    <option value="MN">Manipur</option>
                    <option value="ML">Meghalaya</option>
                    <option value="MZ">Mizoram</option>
                    <option value="NL">Nagaland</option>
                    <option value="OR">Odisha</option>
                    <option value="PB">Punjab</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="SK">Sikkim</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="TG">Telangana</option>
                    <option value="TR">Tripura</option>
                    <option value="UT">Uttarakhand</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="WB">West Bengal</option>
                    <option value="CH">Chandigarh</option>
                    <option value="DL">Delhi</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    name="zip"
                    value={FormData.zip}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="nationality" className="form-label">
                    Nationality<span className="required-star">*</span>
                  </label>
                  <select
                    id="nationality"
                    className="form-select"
                    name="nationality"
                    value={FormData.nationality}
                    onChange={handleInputChange}
                  >
                    <option value="">Choose..</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="role" className="form-label">
                    Role<span className="required-star">*</span>
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    name="role"
                    value={FormData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Choose..</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="imageUrl" className="form-label">
                    Upload Profile Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-12"></div>
              </div>
            </fieldset>
          </section>
          <section className="container student my-2 w-50 text-dark p-2 my-0">
            <fieldset>
              <legend>Academic Information</legend>
              <div className="row g-3 p-3">
                <div className="col-md-6">
                  <label htmlFor="highSchoolName" className="form-label">
                    Higher School Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="highSchoolName"
                    name="highschoolname"
                    value={FormData.highschoolname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="highSchoolCompletionYear"
                    className="form-label"
                  >
                    Completion Year *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="highSchoolCompletionYear"
                    name="highschoolcompletionyear"
                    value={FormData.highschoolcompletionyear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="highSchoolStream" className="form-label">
                    Higher School Stream *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="highSchoolStream"
                    name="highschoolstream"
                    value={FormData.highschoolstream}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="underGradCollege" className="form-label">
                    Undergraduate College *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="underGradCollege"
                    name="undergradcollege"
                    value={FormData.undergradcollege}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="underGradCompletionYear"
                    className="form-label"
                  >
                    Completion Year *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="underGradCompletionYear"
                    name="underGradCompletionYear"
                    value={FormData.underGradCompletionYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="underGradCourse" className="form-label">
                    Undergraduate Course *
                  </label>
                  <select
                    id="underGradCourse"
                    className="form-select"
                    name="underGradCourse"
                    value={FormData.underGradCourse}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="BCA">BCA</option>
                    <option value="Bsc">Bsc</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="internships" className="form-label">
                    Internships (if any)
                  </label>
                  <textarea
                    className="form-control"
                    id="internships"
                    rows="3"
                    name="internships"
                    value={FormData.internships}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="achievements" className="form-label">
                    Achievements during under graduation(give a little bit
                    description): *
                  </label>
                  <textarea
                    className="form-control"
                    id="achievements"
                    rows="3"
                    name="achievements"
                    value={FormData.achievements}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label htmlFor="postGradCollege" className="form-label">
                    Postgraduate College *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postGradCollege"
                    name="postGradCollege"
                    value={FormData.postGradCollege}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="semesterResult" className="form-label">
                    Semester's result(SGPA) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="semesterResult"
                    name="semesterResult"
                    value={FormData.semesterResult}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="skills" className="form-label">
                    Skills: *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skills"
                    name="skills"
                    value={FormData.skills}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="hobbies" className="form-label">
                    Hobbies:{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="hobbies"
                    name="hobbies"
                    value={FormData.hobbies}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="extraCurricular" className="form-label">
                    Extra Co-curricular activities:
                  </label>
                  <textarea
                    className="form-control"
                    id="extraCurricular"
                    rows="3"
                    name="extraCurricular"
                    value={FormData.extraCurricular}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="experiences" className="form-label">
                    Experiences if any (give a little bit of description):
                  </label>
                  <textarea
                    className="form-control"
                    id="experiences"
                    rows="3"
                    name="experiences"
                    value={FormData.experiences}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </fieldset>
          </section>

          <div className="col-12 d-flex justify-content-center ">
            <button
              type="submit"
              id="submitform"
              className="col-2 btn mb-4 btn-block btn-info text-light fw-medium"
            >
              Update Details
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default StudentDashboard;
