🍽️ Food Ordering App — Full Stack (React + Node + MongoDB + Socket.IO)

A modern, real-time food ordering web application with role-based access, country-restricted operations, and a dynamic restaurant/menu system.

Built for the Slooze Take-home Challenge.

🚀 Live Demo

Frontend (Vercel):
👉 https://foodorderappfrontend-eahiqagbe-2110abhisheks-projects.vercel.app/

Backend (Render): (Add if deployed)
👉 https://your-backend-url.onrender.com

GitHub Repository:
👉 https://github.com/2110Abhishek/Foodorderapp.git

🎯 Features
👥 Role-Based Access
Feature	Admin	Manager	Member
View Restaurants & Menus	✅	✅	✅
Add Items to Cart	✅	✅	✅
Create Order	❌	❌	❌
Checkout & Pay	✅	✅	❌
Cancel Order	❌	❌	❌
Manage Payment Methods	❌	❌	❌
Real-time Order Updates	✅	✅	❌
🌍 Country-Restricted Access

Managers and Members can only create/checkout orders within their assigned country.

India Manager → can order only from Indian restaurants

US Member → can only browse/order from US restaurants

Admin has global access.

⚡ Tech Stack
Frontend

React JS

React Router DOM

Context API (Auth + Socket)

Socket.IO client

Plain CSS (custom modern UI)

Vercel Deployment

Backend

Node.js

Express.js

MongoDB Atlas

JWT Authentication

RBAC (Admin, Manager, Member)

Socket.IO

Render Deployment

📦 Installation & Running Locally
1️⃣ Clone the Repository
git clone https://github.com/2110Abhishek/Foodorderapp.git
cd Foodorderapp

🖥️ Backend Setup (/backend)
cd backend
npm install

Create .env
PORT=3001
MONGO_URI=your_mongo_atlas_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

Run Seed (creates restaurants, 240 menu items, and test users)
node seed.js

Start Backend
npm run dev

💻 Frontend Setup (/frontend)
cd frontend
npm install
npm start

🔥 Test Users
Admin
email: admin@foodapp.com
password: adminpass

Manager (India)
email: manager@in.com
password: managerpass

Member (USA)
email: member@us.com
password: memberpass

🔄 Real-Time Features (Socket.IO)

Order Created

Order Updated

Order Cancelled

Sockets automatically join:

user:{userId}

country:{countryId}

restaurant:{restaurantId}

Global Admin Room

🚀 Deployment
Frontend (Vercel)

Build Command:

npm install && npm run build


Output Directory:

build

Backend (Render)

Build Command:

cd backend && npm install


Start Command:

node server.js

📂 Project Structure
foodorderapp/
  ├── backend/
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── seed.js
  │   ├── server.js
  │   └── config/
  │
  ├── frontend/
  │   ├── src/
  │   │   ├── pages/
  │   │   ├── components/
  │   │   ├── contexts/
  │   │   └── api/
  │   └── public/
  │
  └── README.md

🧪 Compatibility

Works on Windows, macOS, Linux

Node 16+

MongoDB Atlas

🙌 Author

Abhishek
Frontend/Full Stack Developer
LinkedIn: www.linkedin.com/in/abhishek-choudhari-330211246
