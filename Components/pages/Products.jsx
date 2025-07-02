import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userDetails?.user);
    const [fetched, setFetched] = useState(false);
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('ProductName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [itemId, setItemId] = useState('');
    const [newItem, setNewItem] = useState({
        ProductName: '',
        SKU: '',
        Category: '',
        InitialQty: '',
        SalesPrice: '',
        Cost: '',
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

    const fetchItems = async (page = 1) => {
        try {
            const response = await axios.get(`${serverUrl}/item/${userInfo?._id}`, {
                params: {
                    search: searchTerm,
                    page,
                    limit: pageSize,
                    sortField,
                    sortOrder,
                },
            });

            if (response?.status && response.data?.data) {
                setItems(response.data?.data);
                setCurrentPage(response.data?.pagination?.currentPage);
                setTotalPages(response.data?.pagination?.totalPages);
                setTotalRecords(response.data?.pagination?.totalRecords);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response?.data?.message === "Item not found") {
                setItems([])
                setCurrentPage(1);
                setTotalPages(1);
                setTotalRecords(0);
            } else {
                toast.error("Error fetching items");
                console.error("Error fetching items:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleCreateItem = async () => {
        debugger
        if (!newItem.ProductName || !newItem.Cost || !newItem.InitialQty) {
                    toast.error("The ProductName, InitialQty and Cost are required");
                    return
                }
        try {
            const response = await axios.post(`${serverUrl}/item`, {
                ...newItem,
                userId: userInfo._id
            });
            if (response.status) {
                toast.success("Item created successfully");
                fetchItems();
                setShowModal(false);
                setNewItem({
                    ProductName: '',
                    SKU: '',
                    Category: '',
                    InitialQty: '',
                    SalesPrice: '',
                    Cost: '',
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.error("Error creating item:", error);
        }
    };

    const handleUpdateItem = async () => {
        try {
            const response = await axios.put(`${serverUrl}/item/${itemId}`, newItem);
            if (response.status) {
                toast.success("Item updated successfully");
                fetchItems();
                setShowModal(false);
                setNewItem({
                    ProductName: '',
                    SKU: '',
                    Category: '',
                    InitialQty: '',
                    SalesPrice: '',
                    Cost: '',
                });
                setIsEditMode(false);
                setItemId('');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating item");
            console.error("Error updating item:", error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.delete(`${serverUrl}/item/${id}`);
            if (response.status) {
                toast.success("Item deleted successfully");
                fetchItems();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting item");
            console.error("Error deleting item:", error);
        }
    };

    const handleEditItem = async (id) => {
        try {
            const response = await axios.get(`${serverUrl}/item/${id}`);
            if (response.status && response.data?.data) {
                setNewItem(response.data.data);
                setItemId(id);
                setIsEditMode(true);
                setShowModal(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching item details");
            console.error("Error fetching item details:", error);
        }
    };

    const handleSearch = () => {
        fetchItems();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchItems(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        fetchItems();
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
        fetchItems();
    };

    useEffect(() => {
        if (userInfo) {
            fetchItems();
        }
    }, [userInfo]);

    const pagination = [];
    for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
    }

    return (
        <div className='products px-5'>
            <div className='products-header flex justify-between items-center'>
                <div className='w-full h-full p-2 flex items-center'>
                    <div className="input-group m-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search item"
                            aria-label="Search item"
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
                    <button type='button' className='w-60 bg-success btn h-10 text-white hover:opacity:80 active:opacity-65' onClick={() => { setIsEditMode(false); setShowModal(true); setNewItem({ ProductName: '', SKU: '', Category: '', InitialQty: '', SalesPrice: '', Cost: '' }); }}>Add new item</button>
                </div>
            </div>
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{isEditMode ? 'Edit Item' : 'Create New Item'}</h1>
                                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setIsEditMode(false); setItemId(''); }} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    {Object.keys(newItem).map((key) => (
                                        <div key={key} className="mb-3">
                                            <label className="col-form-label">{key}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name={key}
                                                value={newItem[key]}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setIsEditMode(false); setItemId(''); }}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={isEditMode ? handleUpdateItem : handleCreateItem}>{isEditMode ? 'Update Item' : 'Create Item'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='products-container'>
                <table className="table">
                    <thead className='tableTitle'>
                        <tr>
                            {['ProductName', 'SKU', 'Category', 'InitialQty', 'SalesPrice', 'Cost'].map((field) => (
                                <th key={field} className='text-black poppins-semibold cursor-pointer' scope="col" onClick={() => handleSort(field)}>{field} {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            ))}
                            <th className='text-black poppins-semibold' scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={item._id} className='cursor-pointer'>
                                    <td>{item.ProductName}</td>
                                    <td>{item.SKU}</td>
                                    <td>{item.Category}</td>
                                    <td>{item.InitialQty}</td>
                                    <td>{item.SalesPrice}</td>
                                    <td>{item.Cost}</td>
                                    <td className='flex'>
                                        <div>
                                            <button type='button' className='mx-2' onClick={() => handleDeleteItem(item._id)}>
                                                <img src="/delete.png" className='w-6 delete hover:opacity-70' alt="Delete btn" />
                                            </button>
                                            <button type='button' className='mx-2' onClick={() => handleEditItem(item._id)}>
                                                <img src="/edit.png" className='w-6 hover:opacity-70' alt="Edit btn" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">No items found!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination products-footer flex items-center justify-end px-5">
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