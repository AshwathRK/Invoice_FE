## 📄 Project Overview

This project is an **Invoice Management System** that enables users to manage invoices, customers, and products through a user-friendly web interface. It includes features such as authentication, CRUD operations, and export/print capabilities.

---

### 🚀 Tech Stack

* **Frontend**: [React.js](https://reactjs.org/)
* **Backend**: [Node.js](https://nodejs.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **API Communication**: Axios
* **Routing**: React Router
* **State Management**: Redux (if applicable)
* **PDF Export & Print**: Browser print dialog and file download functionality
* **Database**: (Add if you're using MongoDB or another DB)

---

### 🛠️ Authentication

* **Login Page**

  * Allows users to log in using valid credentials.
  * Upon successful login, users are redirected to the **Invoice Dashboard**.

* **Signup Page**

  * Enables new users to register by filling out the required details.
  * Redirects to login upon successful signup.

---

### 📑 Invoice Management

* **Invoice Dashboard**

  * Displays a list of all created invoices.
  * Each invoice row includes the following actions:

    * **Update**: Redirects to the Update Invoice page with prefilled data.
    * **Delete**: Removes the selected invoice.
    * **Print**: Navigates to the Print Invoice page to preview and print the invoice.
  * A button on the top-right labeled **"Create New Invoice"** allows users to create a new invoice.

* **Create New Invoice**

  * A form to create a new invoice with itemized product details.
  * Includes two buttons:

    * **Save Invoice**: Saves the invoice and redirects to the Invoice Dashboard.
    * **Save & Print**: Saves the invoice and redirects to the **Print Invoice** page.

* **Update Invoice**

  * Prefills existing invoice data.
  * Allows the user to update the invoice and save changes.

* **Print Invoice Page**

  * Displays the full invoice preview.
  * Includes:

    * **Print Button**: Prints the invoice.
    * **Export Button**: Downloads the invoice as a PDF.

---

### 👥 Customer Management

* **Customer Page**

  * Lists all customers.
  * Allows users to perform CRUD operations:

    * **Create** a new customer.
    * **Read** (view) customer details.
    * **Update** customer information.
    * **Delete** a customer.

---

### 📦 Product Management

* **Product Page**

  * Lists all available products.
  * Allows users to perform CRUD operations:

    * **Create** a new product.
    * **Read** (view) product details.
    * **Update** product information.
    * **Delete** a product.

---

### 🧾 Export & Print Functionality

* From the Print Invoice page, users can:

  * **Preview** invoice details.
  * **Print** the invoice using the browser's print dialog.
  * **Export** the invoice as a downloadable PDF file.

---

### 📸 Screenshots

Below are some key UI screenshots showcasing the main features of the application:

#### 🔐 Login Page

![Screenshot 2025-07-05 141934](https://github.com/user-attachments/assets/522127fe-670e-4c1d-a32b-b67a798eef82)

#### 📝 Signup Page

![Screenshot 2025-07-05 142045](https://github.com/user-attachments/assets/074dd046-7a16-41da-9526-014afebbb9d9)


#### 📋 Invoice Dashboard

![Screenshot 2025-07-05 142148](https://github.com/user-attachments/assets/c1de6b44-6944-40cc-8708-92c364b9f384)


#### ➕ Create New Invoice

![Screenshot 2025-07-05 142242](https://github.com/user-attachments/assets/bcf0e9dc-3205-41b1-8a75-1aff3559e916)


#### ✏️ Update Invoice

![Screenshot 2025-07-05 142332](https://github.com/user-attachments/assets/fd64a809-9602-4bcf-871a-9cdaf9fb0f37)


#### 🖨️ Print Invoice

![Screenshot 2025-07-05 142419](https://github.com/user-attachments/assets/c42c5bd9-36d3-471c-bc45-24047f2aa37a)


#### 🧾 Exported PDF Preview

![Screenshot 2025-07-05 142453](https://github.com/user-attachments/assets/c03cf5e6-9185-4dfd-b8a3-aa6b774bc129)


#### 👥 Customer Management

![Screenshot 2025-07-05 142537](https://github.com/user-attachments/assets/db7b7436-f52d-4f71-bf1d-1027035a833a)


#### 📦 Product Management

![Screenshot 2025-07-05 142602](https://github.com/user-attachments/assets/5461da7f-f0c3-424c-b141-2182acdbef3b)


---

### ✅ Summary

This system provides a complete and responsive solution for managing invoices, customers, and products, while offering print and export features. The use of **React**, **Node.js**, and **Tailwind CSS** ensures a modern, fast, and scalable application.

---

