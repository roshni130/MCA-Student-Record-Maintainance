import React, { useState, useEffect } from 'react';
import { Input, Sidenav } from "mdb-ui-kit";

function sidenav1() {
    const SIDENAV_OPTIONS = [
        'Dashboard',
        'Profile',
        'Messages',
        'Settings',
        'Logout'
    ];

    const SidenavSearch = () => {
        const [filter, setFilter] = useState('');
        const [filteredOptions, setFilteredOptions] = useState(SIDENAV_OPTIONS);

        useEffect(() => {
            if (filter) {
                const lowerCaseFilter = filter.toLowerCase();
                const filtered = SIDENAV_OPTIONS.filter(option =>
                    option.toLowerCase().includes(lowerCaseFilter)
                );
                setFilteredOptions(filtered);
            } else {
                setFilteredOptions(SIDENAV_OPTIONS);
            }
        }, [filter]);
        return (
            <div>

                <div
                    id="sidenav-3"
                    data-mdb-close-on-esc="false"
                    className="sidenav"
                    data-mdb-sidenav-init
                    data-mdb-hidden="false"
                    data-mdb-position="absolute"
                    data-mdb-focus-trap="false"
                    data-mdb-scroll-container="#scroll-container"
                    role="navigation"
                >
                    <div className="text-center">
                        <h3 className="py-4">Examples</h3>
                        <hr className="m-0" />
                    </div>
                    <ul id="scroll-container" className="sidenav-menu">
                        <li className="sidenav-item">
                            <div className="input-group rounded my-2">
                                <div className="form-outline w-auto" data-mdb-input-init>
                                    <input id="search-input-sidenav" type="search" className="form-control" />
                                    <label className="form-label" for="form1">Search</label>
                                </div>
                            </div>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 1</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 2</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 3</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 4</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 5</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 6</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 7</span>
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="far fa-smile pe-3"></i><span>Link 8</span>
                            </a>
                        </li>
                    </ul>

                    <div className="text-center" style="min-height: 3rem;">
                        <hr className="mt-0 mb-2" />
                        <small>mdbootstrap.com</small>
                    </div>
                </div>


            </div>
        )
    }
}

export default sidenav1
