import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js'; // import html2pdf

const serverUrl = import.meta.env.VITE_SERVER_URL;

const PrintPDF = () => {
    const { invoiceId } = useParams();
    const [invoiceData, setInvoiceData] = useState({});
    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const invoiceRef = useRef(); // ref for invoice container

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverUrl}/invoice/${invoiceId}`);
                const data = await response.json();

                if (response.ok) {
                    setInvoiceData(data);
                    try {
                        const customerResponse = await axios.get(`${serverUrl}/customers/${data.data?.customerId}`);
                        if (customerResponse?.status === 200 && customerResponse.data?.data) {
                            setCustomer(customerResponse.data.data);
                        } else {
                            throw new Error(customerResponse.data.message);
                        }
                    } catch (error) {
                        console.error("Error fetching customers:", error);
                        setError("Error fetching customer data");
                    }
                } else {
                    setError(data.message || 'Failed to fetch invoice');
                }
            } catch (err) {
                setError('Something went wrong');
                // console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [invoiceId]);

    const handleExportPDF = () => {
        const element = invoiceRef.current;
        const opt = {
            margin:       0.5,
            filename:     `Invoice_${invoice?.invoiceNumber || 'Export'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!invoiceData?.data) return <p>No invoice data found.</p>;

    const invoice = invoiceData.data;

    return (
        <div className='newInvoices px-20' ref={invoiceRef}>
            <h2 style={{ textAlign: 'center' }}>Invoice</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h4>From:</h4>
                    <p><strong>Guvi</strong></p>
                    <p>123 Business Rd</p>
                    <p>Chennai, TamilNadu, 600001</p>
                </div>
                <div>
                    <h4>To:</h4>
                    {customer ? (
                        <>
                            <p><strong>{customer.FirstName}</strong></p>
                            <p><strong>{customer.Email}</strong></p>
                            <p><strong>{customer.Phone}</strong></p>
                            <p>{invoice.clientAddress}</p>
                        </>
                    ) : (
                        <>
                            <p><strong>{invoice.clientName}</strong></p>
                            <p>{invoice.clientAddress}</p>
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>Invoice Date:</strong> {new Date(invoice.invoiceDate).toISOString().split('T')[0]}</p>
                    <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toISOString().split('T')[0]}</p>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={tableHeaderStyle}>#</th>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Quantity</th>
                        <th style={tableHeaderStyle}>Rate</th>
                        <th style={tableHeaderStyle}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items?.map((item, index) => (
                        <tr key={index}>
                            <td style={tableCellStyle}>{index + 1}</td>
                            <td style={tableCellStyle}>{item.description}</td>
                            <td style={tableCellStyle}>{item.quantity}</td>
                            <td style={tableCellStyle}>{item.unitPrice}</td>
                            <td style={tableCellStyle}>{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ textAlign: 'right' }}>
                <p><strong>Subtotal:</strong> ₹{invoice.subTotal}</p>
                <p><strong>Tax ({invoice.tax}%):</strong> ₹{((invoice.tax / 100) * invoice.subTotal).toFixed(2)}</p>
                <p><strong>Total:</strong> ₹{invoice.total}</p>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button onClick={() => window.print()} style={{ ...printButtonStyle, marginRight: '10px' }}>Print Invoice</button>
                <button onClick={handleExportPDF} style={printButtonStyle}>Export PDF</button>
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left'
};

const tableCellStyle = {
    border: '1px solid #ccc',
    padding: '8px'
};

const printButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default PrintPDF;
