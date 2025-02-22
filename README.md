# LaLa Rental Booking Platform

Welcome to **LaLa**, a seamless rental booking platform designed to provide users with an intuitive and efficient way to browse, book, and manage rental properties. This project showcases a modern full-stack implementation using **Next.js 14**, **PostgreSQL**, **Prisma**, **Tailwind CSS**, **Framer Motion**, **Cloudinary**, **Google Auth**, **shadcn/ui**, and **Redux**.

---

## Features

- **User Authentication**: Secure login and registration using **Google Auth**.
- **Property Listings**: Browse and search for rental properties with detailed information.
- **Booking System**: Users can book properties, view their bookings, and manage reservations.
- **Image Upload**: Host property images seamlessly using **Cloudinary**.
- **Responsive UI**: Built with **Tailwind CSS** and **shadcn/ui** for a modern and responsive design.
- **Animations**: Smooth animations and transitions powered by **Framer Motion**.
- **State Management**: Efficient state management using **Redux**.
- **Database**: Robust data handling with **PostgreSQL** and **Prisma ORM**.

---

## Technologies Used

### **Frontend**

- Next.js 14
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Redux

### **Backend**

- Next.js API Routes
- Prisma ORM
- PostgreSQL

### **Authentication**

- Google Auth

### **Image Hosting**

- Cloudinary

### **State Management**

- Redux

### **Styling**

- Tailwind CSS
- shadcn/ui

### **Animations**

- Framer Motion

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (set up and running)
- [Git](https://git-scm.com/)
- [Cloudinary Account](https://cloudinary.com/) (for image hosting)
- [Google Cloud Console](https://console.cloud.google.com/) (for Google Auth)

---

## Getting Started

Follow these steps to set up and run the project locally:

### **1. Clone the Repository**

```bash
git clone https://github.com/Nkusibeni23/LALA.git
cd LALA
```

### **2. Install Dependecies**

npm install

# or

yarn install

# or

pnpm install

# or

bun install

### **3. Create .env**

- DATABASE_URL="postgresql://user:password@localhost:5432/lala_db"
- GOOGLE_CLIENT_ID=your-google-client-id
- GOOGLE_CLIENT_SECRET=your-google-client-secret
- NEXTAUTH_SECRET=your-secret-key
- NEXTAUTH_URL=http://localhost:3000
- CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
- CLOUDINARY_API_KEY=your-cloudinary-api-key
- CLOUDINARY_API_SECRET=your-cloudinary-api-secret

### **4. Set Up Database**

- npx prisma generate
- npx prisma migrate dev --name init

### **5. Run the Development Server**

npm run dev

# or

yarn dev

The app should run at http://localhost:3000 🚀.

### **6. Project Structure**

- lala/
- ├── app/
- │ ├── api/ # API routes
- │ ├── auth/ # Authentication logic
- │ ├── components/ # Reusable components
- │ ├── lib/ # Utility functions
- │ ├── store/ # Redux store
- │ ├── styles/ # Global styles
- │ └── page.tsx # Main page
- ├── prisma/ # Prisma schema and migrations
- ├── public/ # Static assets
- ├── tailwind.config.js # Tailwind CSS configuration
- ├── next.config.js # Next.js configuration
- ├── package.json # Project dependencies
- └── README.md # Project documentation

### **7. Useful Resources**

- **Tailwind CSS Documentation**
- **Next.js Documentation**
- **Prisma Documentation**
- **Redux Toolkit Docs**
- **Cloudinary Docs**
