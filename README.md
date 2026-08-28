# 📚 BookStore — Full-Stack MERN E-Commerce Platform

BookStore is a full-stack e-commerce web application designed to provide a complete and user-friendly online bookstore experience.

The application was built using the **MERN stack** and includes user authentication, book management, shopping cart functionality, favorites, image uploads, and an admin dashboard.

## ✨ Features

### 👤 Customer Features

* 🏠 Responsive homepage with featured and on-sale books
* 📚 Browse books with search and filtering
* 🔎 Search by book information
* 🏷️ Filter by category
* 💰 Filter by price range
* 📦 Filter by availability
* ↕️ Sort products
* 📖 View detailed book information
* 🛒 Add books to cart and manage quantities
* ❤️ Add and manage favorite books
* 🔐 User authentication
* 🛡️ Protected customer routes
* 📱 Responsive design for desktop and mobile

### 🛠️ Admin Features

* 📊 Admin dashboard
* 📚 Add, update, and manage books
* 👥 Manage users
* 🔒 Suspend and activate user accounts
* 📩 Manage contact messages
* 🛡️ Protected admin routes
* 🖼️ Upload and manage book cover images

## 🛠️ Technologies Used

**Frontend**

* React.js
* React Router
* Tailwind CSS
* CSS
* Lucide React

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer

**Storage & Deployment**

* Supabase
* Vercel
* Git & GitHub

## 🔐 Authentication & Authorization

The application uses **JWT (JSON Web Tokens)** for authentication and authorization.

JWT is used to identify authenticated users and protect customer and admin routes. User roles are also used to control access to administrative functionality.

Passwords are securely hashed using **bcrypt** before being stored in the database.

## 🖼️ Image Uploads

**Multer** is used on the backend to handle book cover image uploads.

Uploaded images can then be stored using **Supabase Storage**, while the related book information is stored in MongoDB.

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** for data management.

Main data models include:

* Users
* Books
* Categories
* Carts
* Contact Messages

## 📁 Project Structure

```text
BookStore/
├── api/
├── auth/
├── config/
├── frontend/
│   └── frontend/
│       ├── public/
│       └── src/
├── images/
├── models/
├── public/
├── routes/
├── server.js
├── package.json
└── vercel.json
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git https://github.com/malikitanibey-hub/bookstore-mern
cd BookStore
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend/frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend/root project directory and add the required environment variables for:

* MongoDB
* JWT
* Supabase
* Server configuration

### 5. Run the backend

From the project root:

```bash
npm run dev
```

### 6. Run the frontend

From `frontend/frontend`:

```bash
npm start
```

The frontend will run locally on:

```text
http://localhost:3000
```

## 🌐 Live Demo

[https://bookstore-mern-oesn.vercel.app/]

## 👨‍💻 Author

**Malek Itani**

Computer Science | Junior Web Developer

---

⭐ If you find this project interesting, feel free to explore the repository!
