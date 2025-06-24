# Placement Portal

A comprehensive web application for managing college placements, connecting students, companies, and college staff.

## Features

### For Students

- Profile Management
- Academic Details
- Resume Upload
- Previous Internships
- Projects Showcase
- Job Applications
- Interview Management
- Application Status Tracking

### For Companies

- Company Profile Management
- Job Posting
- Student Applications Management
- Interview Scheduling
- Applicant Tracking

### For College Staff

- Student Management
- Company Management
- Placement Statistics
- Document Verification
- Event Management

## Tech Stack

### Frontend

- React.js
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- React Hook Form for form handling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/placement-portal.git
cd placement-portal
```

2. Install Backend Dependencies

```bash
cd backend
npm install
```

3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

4. Create .env file in backend directory

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY_STUDENT=your_student_secret
JWT_SECRET_KEY_COLLEGE=your_college_secret
JWT_SECRET_KEY_COMPANY=your_company_secret
```

5. Start Backend Server

```bash
cd backend
npm start
```

6. Start Frontend Development Server

```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
placement-portal/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
└── client/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── redux/
        └── utils/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/placement-portal](https://github.com/yourusername/placement-portal)
