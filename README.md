# ☕ Cafe Management System (ASP.NET Core API + React)

This project is a **Cafe Management System** built with:
- **Backend**: ASP.NET Core API using Dapper for database operations.
- **Frontend**: React with Ant Design for UI.
- **Database**: Microsoft SQL Server with seed data.

---

## 📌 Features
✅ Manage cafes  
✅ Manage employees  
✅ Assign employees to cafes  
✅ Search employees by cafe  
✅ REST API with CRUD operations  

---

## 🚀 Getting Started

### 🔹 1. **Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (for React)
- [.NET SDK](https://dotnet.microsoft.com/en-us/download) (for ASP.NET Core)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (for database)

---

## 🔹 2. **Backend Setup (ASP.NET Core API)**

### ✅ Clone the Repository
```sh
git clone https://github.com/your-repo-url.git
cd your-repo



Open appsettings.json.
Update the connection string for your SQL Server:
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=CAFEABC;User Id=yourUser;Password=yourPassword;TrustServerCertificate=True;"
}



Open config.js.
Update url for you base API URL :


run the initsql.sql to setup database and populate sample data 