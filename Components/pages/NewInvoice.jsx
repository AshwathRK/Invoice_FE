import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const NewInvoice = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userDetails?.user);
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [customerId, setclientId] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date());
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState([
        { itemId: '', description: '', quantity: 0, unitPrice: 0, amount: 0, isActive: true },
        { itemId: '', description: '', quantity: 0, unitPrice: 0, amount: 0, isActive: false },
    ]);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('draft');
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${serverUrl}/customer/${userInfo?._id}`);
                if (response?.status && response.data?.data) {
                    setCustomers(response.data?.data);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };
        fetchCustomers();
    }, [userInfo]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${serverUrl}/item/${userInfo?._id}`);
                if (response?.status && response.data?.data) {
                    setProducts(response.data?.data);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        if (userInfo?._id) {
            fetchProducts();
        }
    }, [userInfo]);

    const handleCustomerChange = (customerId) => {
        const selectedCustomer = customers.find((customer) => customer._id === customerId);
        if (selectedCustomer) {
            setSelectedCustomer(selectedCustomer);
            setClientName(selectedCustomer.FirstName);
            const shippingAddress = selectedCustomer.ShippingAddress;
            const addressFields = [];
            if (shippingAddress) {
                if (shippingAddress.Street) addressFields.push(shippingAddress.Street);
                if (shippingAddress.City) addressFields.push(shippingAddress.City);
                if (shippingAddress.State) addressFields.push(shippingAddress.State);
                if (shippingAddress.PostalCode) addressFields.push(shippingAddress.PostalCode);
                if (shippingAddress.Country) addressFields.push(shippingAddress.Country);
                setClientAddress(addressFields.join(', '));
            } else {
                setClientAddress('');
            }
            setClientEmail(selectedCustomer.Email);
            setClientPhone(selectedCustomer.Phone);
            setclientId(selectedCustomer._id);
        }
    };

    const handleItemChange = (index, field, value, unitPrice = null) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'itemId') {
            const selectedProduct = products.find(product => product._id === value);
            newItems[index].description = selectedProduct?.ProductName || '';
            newItems[index].unitPrice = selectedProduct?.Cost || Cost || 0;
            newItems[index].amount = newItems[index].InitialQty * newItems[index].unitPrice;
        }
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
        }
        setItems(newItems);
        calculateTotals(newItems);
    };

    const calculateTotals = (items) => {
        const subTotal = items.reduce((acc, item) => acc + item.amount, 0);
        const taxAmount = subTotal * (Math.min(tax, 100) / 100);
        const total = subTotal + taxAmount;
        setSubTotal(subTotal);
        setTotal(total);
    };

    const handleRowClick = (index) => {
        const newItems = [...items];
        for (let i = 0; i < newItems.length; i++) {
            newItems[i].isActive = i === index;
        }
        if (index === newItems.length - 1) {
            newItems.push({ itemId: '', description: '', quantity: 0, unitPrice: 0, amount: 0, isActive: false });
        }
        setItems(newItems);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
        calculateTotals(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/invoice`, {
                clientName,
                userId: userInfo?._id,
                customerId,
                clientAddress,
                clientEmail,
                clientPhone,
                invoiceNumber,
                invoiceDate,
                dueDate,
                items: items.filter(item => item.description || item.quantity || item.unitPrice || item.amount),
                subTotal,
                tax,
                total,
                notes,
                status,
            });
            console.log(response.data);
            toast.success("Invoice Created Successfully!");

            setTimeout(function () {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error(error.response.data?.message);
        }
    };

    const handleTaxChange = (value) => {
        setTax(Math.min(parseFloat(value), 100));
    };

    const handlePrint = async () => {
        try {
            const response = await axios.post(`${serverUrl}/invoice`, {
                clientName,
                userId: userInfo?._id,
                customerId,
                invoiceNumber,
                invoiceDate,
                dueDate,
                items: items.filter(item => item.description || item.quantity || item.unitPrice || item.amount),
                subTotal,
                tax,
                total,
                notes,
                status,
            });
            // Navigate to the print page
            navigate(`/app/print-pdf/${response.data?.invoice?._id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="newInvoices px-10 my-10">
            <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Customer Name: *</label>
                        <select value={selectedCustomer?._id || ''} onChange={(e) => handleCustomerChange(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg text-black" required>
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer._id} value={customer._id}>{customer.name || `${customer.FirstName}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Invoice Number: *</label>
                        <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Invoice Date:</label>
                        <input type="date" value={invoiceDate.toISOString().split('T')[0]} onChange={(e) => setInvoiceDate(new Date(e.target.value))} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Due Date:</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Client Address:</label>
                        <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Client Email:</label>
                        <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Client Phone:</label>
                        <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Status:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg">
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Items:</h3>
                <table className="w-full table-auto mb-4">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Unit Price</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} onClick={() => handleRowClick(index)} className={`cursor-pointer ${!item.isActive ? 'opacity-50 bg-gray-100' : ''}`}>
                                <td className="border px-4 py-2">
                                    {products.length > 0 && (
                                        <select value={item.itemId || ''} onChange={(e) => handleItemChange(index, 'itemId', e.target.value, products.find(product => product._id === e.target.value)?.unitPrice)} className="block w-full p-2 border border-gray-300 rounded-lg">
                                            <option value="">Select Item</option>
                                            {products.map((product) => (
                                                <option key={product._id} value={product._id}>{product.ProductName}</option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="block w-full p-2 border border-gray-300 rounded-lg" />
                                </td>
                                <td className="border px-4 py-2">
                                    <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="block w-full p-2 border border-gray-300 rounded-lg" />
                                </td>
                                <td className="border px-4 py-2">
                                    <input type="number" value={item.amount} readOnly className="block w-full p-2 border border-gray-300 rounded-lg" />
                                </td>
                                <td className="border px-4 py-2">
                                    {items.length > 2 && index !== items.length - 1 && (
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(index); }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">X</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Notes:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Sub Total:</label>
                            <input type="number" value={subTotal} readOnly className="block w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Tax (%):</label>
                            <input type="number" value={tax} onChange={(e) => setTax(Math.max(0, Math.min(parseFloat(e.target.value || 0), 100)))} className="block w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Total:</label>
                            <input type="number" value={subTotal + (subTotal * tax / 100)} readOnly className="block w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className='flex w-full justify-end'>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save Invoice</button>
                    <button type="button" onClick={() => handlePrint()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-4">Save and Print</button>
                </div>
            </form>
        </div>
    );
};

export default NewInvoice;