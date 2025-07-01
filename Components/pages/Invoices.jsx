import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Invoices() {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.userDetails?.user);
    const [fetched, setFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    if (!userInfo) {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/user`, {
                    withCredentials: true,
                });

                if (response.data?.status && response.data?.user) {
                    dispatch(addUserDetails(response.data.user));
                    setFetched(true);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error in fetchUserDetails:", error);
                toast.error("Session expired, please log in again");
                dispatch(clearUserDetails());
                localStorage.setItem('isAuthenticated', 'false');
                navigate('/login');
            }
        };

        if (!fetched) {
            fetchUserDetails();
        }
    }

    const fetchInvoices = async (page = 1) => {
        try {
            const response = await axios.get(`${serverUrl}/invoice`, {
                params: {
                    userId: userInfo._id,
                    search: searchTerm,
                    page,
                    limit: 10,
                },
            });

            if (response.data?.status && response.data?.data) {
                setInvoices(response.data?.data);
                setCurrentPage(response.data?.pagination?.currentPage);
                setTotalPages(response.data?.pagination?.totalPages);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Error fetching invoices");
        }
    };

    const handleSearch = () => {
        fetchInvoices();
    };

    const handlePageChange = (page) => {
        fetchInvoices(page);
    };

    useEffect(() => {
        if (userInfo) {
            fetchInvoices();
        }
    }, [userInfo]);

    console.log(invoices)

    return (
        <div className='invoices px-5'>
            <div className='invoice-header flex justify-between items-center'>
                <div className='w-full h-full p-2 flex items-center'>
                    <div className="input-group m-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search invoice"
                            aria-label="Recipient’s username"
                            aria-describedby="button-addon2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    <button type='button' className='w-60 bg-success btn h-10 text-white'>Add new invoices</button>
                </div>
            </div>
            <div className='invoice-container'>
                <table className="table">
                    <thead className='tableTitle'>
                        <tr>
                            <th className='text-black poppins-semibold' scope="col">#</th>
                            <th className='text-black poppins-semibold' scope="col">Customer</th>
                            <th className='text-black poppins-semibold' scope="col">Invoice Amount</th>
                            <th className='text-black poppins-semibold' scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr key={invoice._id} className='cursor-pointer'>
                                <th scope="row">{(currentPage - 1) * 10 + index + 1}</th>
                                <td>{invoice.clientName}</td>
                                <td>{invoice.total}</td>
                                <td className='flex'>
                                    <div>
                                        <button type='button' className='mx-2'>
                                            <img src="./delete.png" className='w-6 delete hover:opacity-70' alt="Delete btn" />
                                        </button>
                                        <button type='button' className='mx-2'>
                                            <img src="/edit.png" className='w-6 hover:opacity-70' alt="Edit btn" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    
                </div>
            </div>
            <div className='invoice-footer border flex justify-end items-center'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`mx-2 ${currentPage === page ? 'bg-blue-500 text-white w-10 h-10 rounded' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
            </div>
            <ToastContainer />
        </div>
    );
}