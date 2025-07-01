import React from 'react'
import Navbar from './Navbar'
import { Route, Routes } from 'react-router-dom'
import Invoices from './Invoices'
import NewInvoice from './NewInvoice'
import Customers from './Customers'
import Products from './Products'

export default function Home() {
  return (
    <div className='home'>
        <Navbar/>
        <Routes>
                <Route path="/" element={<Invoices />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="newinvoice" element={<NewInvoice />} />
                <Route path="customers" element={<Customers />} />
                <Route path="items" element={<Products />} />
            </Routes>
    </div>
  )
}
