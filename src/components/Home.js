import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import { signOut, auth } from '../service/firebase'
import { useNavigate, } from "react-router-dom";
import { urlApi, handleScroll } from '../service/helper';
import Loading from './Loading';
import './Home.css'

const Home = () => {
    const [ListUser, setListUser] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [IsLoading2, setIsLoading2] = useState(false)
    const [DetailUser, setDetailUser] = useState({})
    const [JobDesc, setJobDesc] = useState("")
    const [IdUser, setIdUser] = useState("")
    const [DisplaySearch, setDisplaySearch] = useState(true)
    const [Location, setLocation] = useState("")
    const [CheckFulltime, setCheckFulltime] = useState(false)
    const [Page, setPage] = useState(1)
    // let page
    const dateTimeAgo = (date) => {
        return moment(new Date(date)).fromNow()
    }
    const navigate = useNavigate();
    useEffect(() => {
        // page = 1
        localStorage.getItem('user') == null && navigate('/login')
        getData(Page, JobDesc, Location, CheckFulltime)
    }, []);
    const user = JSON.parse(localStorage.getItem('user'))
    const logout = () => {
        signOut(auth).then(() => {
            console.log('sign out success')
            localStorage.removeItem('user')
            navigate('/login')
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
    const getData = (page, desc, location, fulltime) => {
        setIsLoading(true)
        console.log(page, desc, location, fulltime)
        axios.get(urlApi + 'positions.json?page=' + page + '&description=' + desc + '&location=' + location + '&fulltime=' + fulltime).then((response) => {
            setIsLoading(false)
            let listUser = response.data
            console.log(response.data)
            let filteredListUser = listUser.filter(item => item !== null)
            setListUser(filteredListUser)
        }).catch(err => {
            setIsLoading(false)
            console.log(err)
        });
    }
    const handleScroll = (e) => {
        // console.log(e.target.clientHeight)
        // console.log(e.target.scrollHeight - e.target.scrollTop)
        const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
        if (bottom) {
            console.log("bottom")
            let addPage = Page + 1
            setPage(addPage)
            console.log(addPage)
            setIsLoading2(true)
            axios.get(urlApi + 'positions.json?page=' + addPage).then((response) => {
                setIsLoading2(false)
                let updateListUser = response.data
                let filteredListArray = updateListUser.filter(item => item !== null)
                console.log(filteredListArray)
                setListUser([...ListUser, ...filteredListArray])
                console.log(ListUser)
            }).catch(err => {
                setIsLoading2(false)
                console.log(err)
            });
        }
    }
    const onSearch = () => {
        let page = 1
        setPage(page)
        setListUser([])
        getData(page, JobDesc, Location, CheckFulltime)
    }

    const clickDetail = (id) => {
        console.log(id)
        axios.get(urlApi + 'positions/' + id).then((response) => {
            console.log(response.data)
            setDetailUser(response.data)
            setDisplaySearch(!DisplaySearch)
        }).catch(err => {
            console.log(err)
        });
    }
    return (
        <div>
            <div className='bg-dark p-3 d-flex justify-content-between align-items-center text-white'>
                <span><b>Github</b> Jobs</span>
                <div>
                    {user.displayName} | <button className="btn btn-light" onClick={logout}>Logout</button>
                </div>
            </div>
            <div className={DisplaySearch ? "container mt-5" : "container mt-5 hidden"}>
                <div className="row align-items-end">
                    <div className="col-md-3">
                        <label>Job Description</label>
                        <input type="text" className='form-control' placeholder='Filter by tilte, benefit, and company' value={JobDesc} onChange={(e) => setJobDesc(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label>Location</label>
                        <input type="text" className='form-control' placeholder='Filter by city, state, and country ' value={Location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="col-md-3 pb-1 text-center">
                        <input type="checkbox" checked={CheckFulltime} onChange={(e) => setCheckFulltime(!CheckFulltime)} /> Full Time Only
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-dark w-100" onClick={onSearch}>Search</button>
                    </div>
                </div>

                <div className="card mt-5" onScroll={handleScroll} style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                    <div className="card-body">
                        <h3>Job List</h3>
                    </div>
                    <ul className="list-group" >
                        {IsLoading ? <Loading /> : ListUser.length == 0 ?
                            <li className="list-group-item text-center">Data not found</li>
                            :
                            ListUser.map((item, i) => (
                                <li key={i} onClick={() => clickDetail(item.id)} className="list-group-item" style={{cursor: 'pointer'}}>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h5 className='text-primary'>{item.title}</h5>
                                            <small><span className="text-muted">{item.company} -</span><span className="text-success">{item.type}</span></small>
                                        </div>
                                        <div className='text-end'>
                                            <p style={{ marginBottom: '0.5rem ' }}>{item.location}</p>
                                            <small className='text-muted'>{dateTimeAgo(item.created_at)}</small>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    {IsLoading2 && <Loading />}
                </div>
            </div>
            <div className={DisplaySearch ? "container mt-5 hidden" : "container mt-5"}>
                <div>
                    <button className="btn btn-dark" onClick={() => setDisplaySearch(!DisplaySearch)}>Back</button>
                </div>
                <div className="card mt-5">
                    <div className="card-body">
                        <small className="text-muted">{DetailUser.type} / {DetailUser.location}</small>
                        <h3>{DetailUser.title}</h3>
                        <hr />
                        <div className="row">
                            <div className="col-md-8" dangerouslySetInnerHTML={{__html: DetailUser.description}}>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5>{DetailUser.company}</h5>
                                        <img src={DetailUser.company_logo} alt="" />
                                        <a href={DetailUser.company_url}>{DetailUser.company_url}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home