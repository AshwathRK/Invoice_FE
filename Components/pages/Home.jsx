import React from 'react'
import Navbar from './Navbar'
import { Route, Routes } from 'react-router-dom'
import Invoices from './Invoices'
import NewInvoice from './NewInvoice'
import Customers from './Customers'
import Products from './Products'
import PrintPDF from './PrintPDF'
import UpdateInvoice from './updateInvoice'

export default function Home() {
  return (
    <div className='home'>
        <Navbar/>
        <Routes>
                <Route path="/" element={<Invoices />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="newinvoice" element={<NewInvoice />} />
                <Route path="/updateinvoice/:invoiceId" element={<UpdateInvoice />} />
                <Route path="/print-pdf/:invoiceId" element={<PrintPDF />} />
                <Route path="customers" element={<Customers />} />
                <Route path="items" element={<Products />} />
            </Routes>
    </div>
  )
}
