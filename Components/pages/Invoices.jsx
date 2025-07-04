import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Invoices() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userDetails?.user);

    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showModal, setShowModal] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    const formatDate = (isoString) => {
        let date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/user`, {
                    withCredentials: true,
                });

                if (response.data?.status && response.data?.user) {
                    dispatch(addUserDetails(response.data.user));
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error in fetchUserDetails:", error);
                dispatch(clearUserDetails());
                localStorage.setItem('isAuthenticated', 'false');
                navigate('/login');
            }
        };

        if (!userInfo) {
            fetchUserDetails();
        }
    }, []); // Run only once on mount

    const fetchInvoices = async (page = 1) => {
        try {
            const response = await axios.get(`${serverUrl}/invoice`, {
                params: {
                    userId: userInfo?._id,
                    search: searchTerm,
                    page,
                    limit: pageSize,
                    sortField,
                    sortOrder,
                },
            });

            if (response.data?.status && response.data?.data) {
                setInvoices(response.data?.data);
                setCurrentPage(response.data?.pagination?.currentPage);
                setTotalPages(response.data?.pagination?.totalPages);
                setTotalRecords(response.data?.pagination?.totalRecords);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response?.data?.message === "No invoices found for the user!") {
                setInvoices([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalRecords(0);
            } else {
                toast.error(error.response?.data?.message || "Failed to fetch invoices.");
                console.error("Error fetching invoices:", error);
            }
        }
    };

    useEffect(() => {
        if (userInfo) {
            fetchInvoices();
        }
    }, [userInfo, sortField, sortOrder, pageSize]);

    const handleSearch = () => {
        fetchInvoices();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchInvoices(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        fetchInvoices();
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const deleteInvoice = async (invoiceid) => {
        try {
            const response = await axios.delete(`${serverUrl}/invoice/${invoiceid}`);
            if (response) {
                toast.success(response.data.message);
                fetchInvoices();
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete invoice.");
        }
    };

    const handleDelete = (invoiceId) => {
        setInvoiceToDelete(invoiceId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (invoiceToDelete) {
            deleteInvoice(invoiceToDelete);
            setInvoiceToDelete(null);
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setInvoiceToDelete(null);
        setShowModal(false);
    };

    const pagination = [];
    for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
    }

    return (
        <div className='invoices px-5'>
            <div className='invoice-header flex justify-between items-center'>
                <div className='w-full h-full p-2 flex items-center'>
                    <div className="input-group m-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search invoice"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    <Link to="/app/newinvoice">
                        <button type='button' className='w-60 bg-success btn h-10 text-white hover:opacity-80 active:opacity-65'>Add new invoices</button>
                    </Link>
                </div>
            </div>

            <div className='invoice-container'>
                <table className="table">
                    <thead className='tableTitle'>
                        <tr>
                            <th className='text-black poppins-semibold cursor-pointer' onClick={() => handleSort('invoiceNumber')}>NO. {sortField === 'invoiceNumber' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' onClick={() => handleSort('clientName')}>CUSTOMER {sortField === 'clientName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' onClick={() => handleSort('createdAt')}>DATE {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' onClick={() => handleSort('invoiceDate')}>DUE DATE {sortField === 'invoiceDate' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' onClick={() => handleSort('total')}>AMOUNT {sortField === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold'>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices && invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice._id}>
                                    <th>{invoice.invoiceNumber}</th>
                                    <td>{invoice.clientName}</td>
                                    <td>{formatDate(invoice.createdAt)}</td>
                                    <td>{formatDate(invoice.invoiceDate)}</td>
                                    <td>{invoice.total}</td>
                                    <td className='flex'>
                                        <button type='button' className='mx-2' onClick={() => handleDelete(invoice._id)}>
                                            <img src="/delete.png" className='w-6 delete hover:opacity-70' alt="Delete btn" />
                                        </button>
                                        <Link to={`/app/updateinvoice/${invoice._id}`}>
                                            <button type='button' className='mx-2'>
                                                <img src="/edit.png" className='w-6 hover:opacity-70' alt="Edit btn" />
                                            </button>
                                        </Link>
                                        <Link to={`/app/print-pdf/${invoice._id}`}>
                                            <button type='button' className='mx-2'>
                                                <img src="/printer.png" className='w-6 hover:opacity-70' alt="Print btn" />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No Data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination invoice-footer flex items-center justify-end px-5">
                <select value={pageSize} onChange={(e) => handlePageSizeChange(e.target.value)}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                {pagination.map((page) => (
                    <button key={page} className={`mx-2 ${currentPage === page ? 'bg-blue-500 text-white w-10 h-10 rounded' : ''}`} onClick={() => handlePageChange(page)}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>

            <ToastContainer />

            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this invoice?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
