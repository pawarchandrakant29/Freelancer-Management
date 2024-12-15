# Freelancer Management Application

## Overview
The Freelancer Management Application enables businesses to manage their freelancers effectively by providing tools for project assignments, time tracking, and payments. This platform is ideal for agencies, companies, and individual clients working with remote professionals.

---

## Features

- **Freelancer Profiles**:
  - Add, edit, and view freelancer profiles.
  - Include Projects & Payments.
- **Project Management**:
  - Create and assign projects to freelancers.
  - Track project progress and deadlines.
- **Payment Management**:
  - Track payments to freelancers.
- **Responsive Design**:
  - Optimized for desktop, tablet, and mobile devices.

---

## Technology Stack

- **Frontend**:
  - Framework: React.js
  - Styling: Material UI

- **Backend**:
  - Framework: Node.js with Express.js
  - Database: MongoDB

- **Other Tools**:
  - Authentication: JSON Web Tokens (JWT)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pawarchandrakant29/Freelancer-Management.git
   cd Freelancer-Management
   ```

2. Install dependencies for the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Include the following variables:
     ```env
     PORT=5000
     DATABASE_URL=your_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Run the application:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

5. Open the app in your browser at `http://localhost:5173`.

---
