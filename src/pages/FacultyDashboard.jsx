import React, { useState, useEffect } from "react";
import "./FacultyDashboard.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { firestore, auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

function FacultyDashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.name
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const handleRowClick = (userId) => {
    navigate(`/user/${userId}`); // Assuming you have a route set up for `/user/:userId`
  };

  const handleSignOut = () => {
    auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  });

  return (
    <div>
      <>
        <Header />
        <ul className="nav nav-tabs justify-content-between">
        <li className="d-flex registration align-items-center">
          <h4 className="m-0">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Faculty Dashboard&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h4>
        </li>
        <div className="dropdown">
        <li className="nav-item dropdown userAction">
          <a className="nav-link dropdown-toggle userAction" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Welcome! <i className="bi bi-person-circle"></i>
          </a>
          <ul className="dropdown-menu">
            {/* <li><a className="dropdown-item" href="#">Dashboard</a></li> */}
            <li><a className="dropdown-item" onClick={handleSignOut} href="#">Logout</a></li>
          </ul>
        </li>
        </div>
      </ul>
        <div className="mt-4 mb-4 mx-4">
          <h5>Search Filter</h5>
          <input
            type="text"
            id="search_term"
            className="filter_users"
            placeholder="Search by Name/Roll No/Skills/Achievements/Experience"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="table table-striped-columns">
            <thead>
              <tr className="table-active">
                <th>Name</th>
                <th scope="col">Roll No</th>
                {/* <th>City</th> */}
                <th>Skills</th>
                <th>Achievements</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    {item.firstName} {item.middleName} {item.lastName}
                  </td>
                  <td>{item.roll}</td>
                  {/* <td>{item.city}</td> */}
                  <td>{item.skills}</td>
                  <td>{item.achievements}</td>
                  <td>{item.experiences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </>
    </div>
  );
}

export default FacultyDashboard;
