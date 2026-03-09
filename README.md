# Moon-cart Ecommerce

Moon-cart Ecommerce is a full-stack e-commerce web application built using Node.js, Express.js, and MongoDB. It provides a complete shopping experience with a user-friendly frontend rendered using EJS templates and a robust backend API for managing products, categories, orders, and users.

## Features

*   **User Authentication & Authorization:** Secure login and registration for users and administrators using JWT and bcrypt.
*   **Product Management:** Admins can add, edit, and delete products and categories.
*   **Shopping Cart:** Users can browse products, add them to their cart, and proceed to checkout.
*   **Order Processing:** Complete order management system with tracking and status updates.
*   **Payment Gateway Integration:** Integrated with Razorpay for secure and seamless online payments.
*   **Coupons & Offers:** Support for product-specific offers, category offers, and discount coupons.
*   **Referral System:** Users can refer friends and earn rewards.
*   **Address Management:** Users can save multiple shipping addresses for faster checkout.
*   **Email Notifications:** Automated email updates for order confirmations and other important events using Nodemailer.
*   **Image Uploads:** Product image uploading using Multer.

## Tech Stack

*   **Backend framework:** Node.js, Express.js
*   **Database:** MongoDB via Mongoose
*   **Template Engine:** EJS (Embedded JavaScript)
*   **Authentication:** session, JSON Web Tokens (JWT), bcrypt
*   **Payment Gateway:** Razorpay
*   **Mailing:** Nodemailer
*   **File Uploads:** Multer

## Getting Started

### Prerequisites

*   Node.js (v24.x or compatible)
*   MongoDB installed and running locally, or a MongoDB Atlas URI
*   Razorpay account (for payment processing)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Faydevlop/Moon-cart-Ecommerce.git
    cd Moon-cart-Ecommerce
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary environment variables. Example variables you might need (check the `.env.example` if available, or source code for exact keys):
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/mooncart
    SESSION_SECRET=your_secret_key
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_password
    ```

4.  **Seed Demo Data (Optional):**
    If you want to populate the database with some initial users or data:
    ```bash
    npm run seed:demo
    ```

5.  **Run the application:**
    ```bash
    npm start
    ```
    The application will start using `nodemon`. Open `http://localhost:3000` in your browser.

## Project Structure

*   **/bin:** Server startup script (`www`).
*   **/Controllers:** Contains the business logic for handling incoming requests.
*   **/models:** Mongoose schemas and models (User, Product, Order, etc.).
*   **/routes:** Express route definitions.
*   **/views:** EJS template files for the frontend UI.
*   **/public:** Static assets (CSS, images, client-side JavaScript).
*   **/middleware:** Custom Express middleware (e.g., authentication checks).
*   **/UTILS:** Utility functions and helpers.
*   **/scripts:** Scripts for seeding data or other administrative tasks.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
