import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Customers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userDetails?.user);
    const [fetched, setFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc')
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        FirstName: '',
        CompanyName: '',
        Phone: '',
        Email: '',
        Website: '',
        BillingAddress: {
            Street: '',
            City: '',
            State: '',
            PostalCode: '',
            Country: ''
        },
        ShippingAddress: {
            Street: '',
            City: '',
            State: '',
            PostalCode: '',
            Country: ''
        }
    });

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

    const fetchCustomers = async (page = 1) => {
        try {
            console.log(userInfo._id)
            const response = await axios.get(`${serverUrl}/customer/${userInfo?._id}`, {
                params: {
                    search: searchTerm,
                    page,
                    limit: pageSize,
                    sortField,
                    sortOrder,
                },
            });

            if (response?.status && response.data?.data) {
                setCustomers(response.data?.data);
                setCurrentPage(response.data?.pagination?.currentPage);
                setTotalPages(response.data?.pagination?.totalPages);
                setTotalRecords(response.data?.pagination?.totalRecords);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response?.data?.message === "No customers found!") {
                setCustomers([])
                setCurrentPage(1);
                setTotalPages(1);
                setTotalRecords(0);
            } else {
                toast.error("Error fetching customers");
                console.error("Error fetching customers:", error);
            }
        }
    };

    const fetchCustomerById = async (id) => {
        try {
            const response = await axios.get(`${serverUrl}/customers/${id}`);
            if (response.status && response.data?.data) {
                setNewCustomer(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data?.message);
            console.error("Error fetching customer details:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('BillingAddress')) {
            setNewCustomer({
                ...newCustomer,
                BillingAddress: {
                    ...newCustomer.BillingAddress,
                    [name.split('.')[1]]: value
                }
            });
        } else if (name.includes('ShippingAddress')) {
            setNewCustomer({
                ...newCustomer,
                ShippingAddress: {
                    ...newCustomer.ShippingAddress,
                    [name.split('.')[1]]: value
                }
            });
        } else {
            setNewCustomer({
                ...newCustomer,
                [name]: value
            });
        }
    };

    const handleCreateCustomer = async () => {
        // debugger
        if (!newCustomer.FirstName || !newCustomer.Email) {
            toast.error("The First Name and Email are required");
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(newCustomer.Email)) {
            toast.error("Enter the valid email address");
            return
        }
        try {
            const response = await axios.post(`${serverUrl}/customer`, {
                ...newCustomer,
                userId: userInfo._id
            });
            if (response.status) {
                toast.success("Customer created successfully");
                fetchCustomers();
                setShowModal(false);
                setNewCustomer({
                    FirstName: '',
                    CompanyName: '',
                    Phone: '',
                    Email: '',
                    Website: '',
                    BillingAddress: {
                        Street: '',
                        City: '',
                        State: '',
                        PostalCode: '',
                        Country: ''
                    },
                    ShippingAddress: {
                        Street: '',
                        City: '',
                        State: '',
                        PostalCode: '',
                        Country: ''
                    }
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.error("Error creating customer:", error);
        }
    };

    const handleUpdateCustomer = async () => {
        try {
            const response = await axios.put(`${serverUrl}/customer/${customerId}`, newCustomer);
            if (response.status) {
                toast.success("Customer updated successfully");
                fetchCustomers();
                setShowModal(false);
                setNewCustomer({
                    FirstName: '',
                    CompanyName: '',
                    Phone: '',
                    Email: '',
                    Website: '',
                    BillingAddress: {
                        Street: '',
                        City: '',
                        State: '',
                        PostalCode: '',
                        Country: ''
                    },
                    ShippingAddress: {
                        Street: '',
                        City: '',
                        State: '',
                        PostalCode: '',
                        Country: ''
                    }
                });
                setIsEditMode(false);
                setCustomerId('');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating customer");
            console.error("Error updating customer:", error);
        }
    };

    const handleSearch = () => {
        fetchCustomers();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchCustomers(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        fetchCustomers();
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        fetchCustomers();
    };

    const handleDelete = async (id) => {
        try {
            if (!userInfo) {
                toast.error("User not logged in");
                return;
            }
            const response = await axios.delete(`${serverUrl}/customer/${id}`);
            if (response.status) {
                toast.success("Customer deleted successfully");
                fetchCustomers();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting customer");
            console.error("Error deleting customer:", error);
        }
    };

    const handleEdit = (id) => {
        setIsEditMode(true);
        setCustomerId(id);
        fetchCustomerById(id);
        setShowModal(true);
    };

    useEffect(() => {
        if (userInfo) {
            fetchCustomers();
        }
    }, [userInfo]);

    const pagination = [];
    for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
    }

    return (
        <div className='customers px-5'>
            <div className='customer-header flex justify-between items-center'>
                <div className='w-full h-full p-2 flex items-center'>
                    <div className="input-group m-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search customer"
                            aria-label="Search customer"
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
                    <button type='button' className='w-60 bg-success btn h-10 text-white hover:opacity-80 active:opacity-65' onClick={() => { setIsEditMode(false); setShowModal(true); setNewCustomer({ FirstName: '', CompanyName: '', Phone: '', Email: '', Website: '', BillingAddress: { Street: '', City: '', State: '', PostalCode: '', Country: '' }, ShippingAddress: { Street: '', City: '', State: '', PostalCode: '', Country: '' } }); }}>Add new customer</button>
                </div>
            </div>
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{isEditMode ? 'Edit Customer' : 'Create New Customer'}</h1>
                                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setIsEditMode(false); setCustomerId(''); }} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="col-form-label">First Name: *</label>
                                            <input type="text" className="form-control" name="FirstName" value={newCustomer.FirstName} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="col-form-label">Company Name:</label>
                                            <input type="text" className="form-control" name="CompanyName" value={newCustomer.CompanyName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="col-form-label">Phone:</label>
                                            <input type="text" className="form-control" name="Phone" value={newCustomer.Phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="col-form-label">Email: *</label>
                                            <input type="email" className="form-control" name="Email" value={newCustomer.Email} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="col-form-label">Website:</label>
                                            <input type="text" className="form-control" name="Website" value={newCustomer.Website} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <h5>Billing Address:</h5>
                                            <label className="col-form-label">Street:</label>
                                            <input type="text" className="form-control" name="BillingAddress.Street" value={newCustomer.BillingAddress.Street} onChange={handleInputChange} />
                                            <label className="col-form-label">City:</label>
                                            <input type="text" className="form-control" name="BillingAddress.City" value={newCustomer.BillingAddress.City} onChange={handleInputChange} />
                                            <label className="col-form-label">State:</label>
                                            <input type="text" className="form-control" name="BillingAddress.State" value={newCustomer.BillingAddress.State} onChange={handleInputChange} />
                                            <label className="col-form-label">Postal Code:</label>
                                            <input type="text" className="form-control" name="BillingAddress.PostalCode" value={newCustomer.BillingAddress.PostalCode} onChange={handleInputChange} />
                                            <label className="col-form-label">Country:</label>
                                            <input type="text" className="form-control" name="BillingAddress.Country" value={newCustomer.BillingAddress.Country} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <h5>Shipping Address:</h5>
                                            <label className="col-form-label">Street:</label>
                                            <input type="text" className="form-control" name="ShippingAddress.Street" value={newCustomer.ShippingAddress.Street} onChange={handleInputChange} />
                                            <label className="col-form-label">City:</label>
                                            <input type="text" className="form-control" name="ShippingAddress.City" value={newCustomer.ShippingAddress.City} onChange={handleInputChange} />
                                            <label className="col-form-label">State:</label>
                                            <input type="text" className="form-control" name="ShippingAddress.State" value={newCustomer.ShippingAddress.State} onChange={handleInputChange} />
                                            <label className="col-form-label">Postal Code:</label>
                                            <input type="text" className="form-control" name="ShippingAddress.PostalCode" value={newCustomer.ShippingAddress.PostalCode} onChange={handleInputChange} />
                                            <label className="col-form-label">Country:</label>
                                            <input type="text" className="form-control" name="ShippingAddress.Country" value={newCustomer.ShippingAddress.Country} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setIsEditMode(false); setCustomerId(''); }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={isEditMode ? handleUpdateCustomer : handleCreateCustomer}>{isEditMode ? 'Update Customer' : 'Create Customer'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='customer-container'>
                <table className="table">
                    <thead className='tableTitle'>
                        <tr>
                            <th className='text-black poppins-semibold cursor-pointer' scope="col" onClick={() => handleSort('FirstName')}>NAME {sortField === 'FirstName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' scope="col" onClick={() => handleSort('Email')}>EMAIL {sortField === 'Email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' scope="col" onClick={() => handleSort('Phone')}>PHONE {sortField === 'Phone' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold cursor-pointer' scope="col" onClick={() => handleSort('address')}>ADDRESS {sortField === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className='text-black poppins-semibold' scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers && customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr key={customer._id} className='cursor-pointer'>
                                    <th>{customer.FirstName}</th>
                                    <td>{customer.Email ? customer.Email : "-"}</td>
                                    <td>{customer.Phone ? customer.Phone : "-"}</td>
                                    <td>{customer.BillingAddress ? `${customer.BillingAddress.Street}, ${customer.BillingAddress.City}, ${customer.BillingAddress.State}, ${customer.BillingAddress.Country}` : "-"}</td>
                                    <td className='flex'>
                                        <div>
                                            <button type='button' className='mx-2' onClick={() => handleDelete(customer._id)}>
                                                <img src="/delete.png" className='w-6 delete hover:opacity-70' alt="Delete btn" />
                                            </button>
                                            <button type='button' className='mx-2' onClick={() => handleEdit(customer._id)}>
                                                <img src="/edit.png" className='w-6 hover:opacity-70' alt="Edit btn" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No customers found!</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
            <div className="pagination customer-footer flex items-center justify-end px-5">
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
        </div>
    );
}