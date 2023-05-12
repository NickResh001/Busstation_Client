//import React from 'react';
//import ReactDOM from 'react-dom/client';
//import './index.css';
//import App from './App';
//import reportWebVitals from './reportWebVitals';

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>
//);

//// If you want to start measuring performance in your app, pass a function
//// to log results (for example: reportWebVitals(console.log))
//// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Mainpage from './Components/Mainpage/Mainpage'
import Settlement from './Components/settlement/Settlement'
import SettlementCreate from './Components/SettlementCreate/SettlementCreate'
import Region from './Components/Region/Region'
import RegionCreate from './Components/RegionCreate/RegionCreate'
import Layout from './Components/Layout/Layout'
import Register from './Components/Register/Register'
import LogIn from './Components/LogIn/LogIn'
import Logoff from './Components/Logoff/Logoff'
import RegionsList from './Components/RegionList/RegionList'

const App = () => {

    const [settlements, setSettlements] = useState([])
    /**
     * Метод добавления города в представление.
     * @param {*} settlement город для добавления.
     * @returns 
     */
    const addSettlement = (settlement) => setSettlements([...settlements, settlement])
    /* const removeSettlement = (newSettlements) => setSettlements(newSettlements);
    const updateSettlement = (newSettlements) => setSettlements(newSettlements); */

    const [regions, setRegions] = useState([])
    /**
     * Метод добавления региона в представление.
     * @param {*} settlement город для добавления.
     * @returns 
     */
    const addRegion = (region) => setSettlements([...regions, region])
    /* const removeRegion = (newRegions) => setRegions(newRegions);
    const updateRegion = (newRegions) => setRegions(newRegions); */

    const [user, setUser] = useState({ isAuthenticated: false, userName: "", userRole: "" })
    useEffect(() => {
        const getUser = async () => {
            return await fetch("api/account/isauthenticated")
                .then((response) => {
                    response.status === 401 &&
                        setUser({ isAuthenticated: false, userName: "", userRole: "" })
                    return response.json()
                })
                .then(
                    (data) => {
                        if (
                            typeof data !== "undefined" &&
                            typeof data.userName !== "undefined" &&
                            typeof data.userRole !== "undefined"
                        ) {
                            setUser({ isAuthenticated: true, userName: data.userName, userRole: data.userRole  })
                        }
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getUser()
    }, [setUser])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout user={user} setUser={setUser}/>}>
                    <Route 
                        path="/mainpage" 
                        element={
                            <>
                                <Mainpage/>
                            </>
                        } 
                    />
                    <Route
                        path="/settlements"
                        element={
                            <>
                                <RegionsList />
                                {/* <SettlementCreate
                                    addSettlement={addSettlement}
                                    user={user}
                                /> */}
                                <Settlement
                                    settlements={settlements}
                                    setSettlements={setSettlements}
                                    user={user}
                                />
                            </>
                        }
                    />
                    <Route
                        path="/settlementCreate"
                        element={
                            <>
                                <RegionsList />
                                <SettlementCreate
                                    addSettlement={addSettlement}
                                    user={user}
                                />
                            </>
                        }
                    />
                    <Route
                        path="/regions"
                        element={
                            <>
                                <Region
                                    regions={regions}
                                    setRegions={setRegions}
                                    user={user}
                                />
                            </>
                        }
                    />
                    <Route
                        path="/regionCreate"
                        element={
                            <>
                                <RegionCreate
                                    addRegion={addRegion}
                                    user={user}
                                />
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={<LogIn user={user} setUser={setUser} />}
                    />
                    <Route
                        path="/register"
                        element={<Register user={user} setUser={setUser} />}
                    />
                    <Route
                        path="/logoff"
                        element={<Logoff setUser={setUser} />} />
                    <Route
                        path="*"
                        element={<h3>404</h3>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <App />
)