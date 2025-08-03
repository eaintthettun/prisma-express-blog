# 📝 Blog Website using Prisma and Express

This is a full-featured blogging platform built with **Express.js**, **Prisma**, and **EJS** — inspired by Medium.com. Users can register, login, write posts, follow topics, and view personalized feeds.

---

## 🚀 Features

- ✅ **User Authentication**

  - Session-based login & logout
  - Password hashing with **bcrypt**
  - Flash messages for feedback

- ✅ **User Profiles**

  - View, edit, and follow/unfollow users
  - Profile-specific post listings

- ✅ **Post Management**

  - Create, read, update, delete (CRUD)
  - Post likes/unlikes
  - Bookmarks for later reading
  - SEO-friendly **slug URLs**
  - "My Posts" section for authors

- ✅ **Comment System**

  - Add comments to posts
  - Like/unlike comments
  - Reply to comments
  - Like/unlike reply

- ✅ **Topic/Category Management**

  - Browse topics and categories
  - Follow/unfollow topics
  - View related stories by topic and category

- ✅ **Feeds**

  - Personalized **"Following" feed** (from followed users)
  - **"For You" feed** (recommended content)
  - Full post search functionality

- ✅ **File Upload**

  - Upload images using **Multer**

- ✅ **UI/UX Enhancements**

  - EJS templating with layout support
  - Styled **scrollable topic navbar** with active state
  - Flash message support for actions

---

## 🧰 Tech Stack

- **Backend**: Express.js (v5)
- **ORM**: Prisma with PostgreSQL
- **Templating**: EJS with express-ejs-layouts
- **Styling**: Custom CSS + Bootstrap
- **Auth**: express-session + bcryptjs
- **File Uploads**: Multer
- **Slug Handling**: slugify
- **Data Generation**: faker
- **Environment**: dotenv

---

## 📦 Project Structure

![alt text](image-1.png)

---

## 🛠 Development Tools & Dependencies

Here are the core dependencies used in this project:

    "dependencies": {
        "@faker-js/faker": "^9.7.0",
        "bcryptjs": "^3.0.2",
        "connect-flash": "^0.1.1",
        "dotenv": "^16.5.0",
        "ejs": "^3.1.10",
        "express": "^5.1.0",
        "express-ejs-layouts": "^2.5.1",
        "express-session": "^1.18.1",
        "multer": "^2.0.1",
        "slugify": "^1.6.6"
    },
    "devDependencies": {
        "@prisma/client": "^6.8.2",
        "prisma": "^6.7.0"
    }

---

## 🌐 Routes Overview

| Method | Route                            | Description                                  |
| ------ | -------------------------------- | -------------------------------------------- |
| GET    | `/`                              | Home page                                    |
| GET    | `/posts`                         | View all posts (public)                      |
| GET    | `/posts/new`                     | Show create post form                        |
| POST   | `/posts`                         | Create a new post                            |
| GET    | `/posts/edit/:id`                | Show edit form for a post                    |
| POST   | `/posts/edit/:id`                | Update a post                                |
| POST   | `/posts/delete/:id`              | Delete a post                                |
| GET    | `/posts/:id`                     | View post details                            |
| POST   | `/posts/post/:id/like`           | Like or unlike a post                        |
| POST   | `/posts/:id/toggle-bookmark`     | Bookmark or unbookmark a post                |
| GET    | `/posts/following`               | Posts from followed users                    |
| GET    | `/posts/search`                  | Search posts                                 |
| GET    | `/topics`                        | List all categories and topics               |
| GET    | `/topics/:slug`                  | View posts by topic                          |
| GET    | `/topics/search`                 | Search topic by name                         |
| GET    | `/topics/:slug/stories`          | View more related stories in a topic         |
| POST   | `/topics/:topicId/toggle-follow` | Follow or unfollow a topic                   |
| POST   | `/comments`                      | Add a comment to a post                      |
| POST   | `/comments/:id/toggle-like`      | Like or unlike a comment                     |
| GET    | `/auth/login`                    | Show login form                              |
| POST   | `/auth/login`                    | Handle login                                 |
| GET    | `/auth/register`                 | Show register form                           |
| POST   | `/auth/register`                 | Handle registration                          |
| GET    | `/auth/logout`                   | Logout user                                  |
| GET    | `auth/profile/:id`               | View user profile                            |
| GET    | `auth/profile/edit/:id`          | Edit user profile                            |
| POST   | `auth/toggle-follow`             | Follow or unfollow a user (via profile page) |

---

## 📥 Installation

1. **Clone the repository**

   - git clone https://github.com/your-username/prisma-express-blog-clone.git
   - cd prisma-express-blog-clone

---

2.  **Install dependencies**

    npm install

---

3.  **Set up environment variables**

    Create a .env file or use a .env.local template I have provided and fill necessary fields :

    DATABASE_URL="your_db_connection_string"
    SESSION_SECRET="your_secret_key"

    ## 📁 Example .env

        DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name"
        SESSION_SECRET="your_secret_key"

---

4.  **Initialize Prisma Step by Step**

    - npx prisma init(create prisma folder)
    - npx prisma generate(read database url in .env file)
    - npx prisma db push(this adds your database into cluster)
    - npx prisma studio(prisma UI)
    - npx prisma migrate dev --name init

---

5.  ** Seed the database**

    nodemon seed.js

---

6.  **Run the project**

    npm run dev

---

## 🤝 Contributing

Pull requests are welcome! If you’d like to contribute, please fork the repository and use a feature branch.

---

## ✅ Tips

- Use `npx prisma migrate dev` if you need to apply migrations before seeding data.
- Make sure to install [PostgreSQL](https://www.postgresql.org/download/) if you haven't already.
- If you see a `secret option required for sessions` error, check your `.env` file and ensure `SECRET` is defined.

---

## 📸 Screenshots

---![alt text](image.png)

## 📜 License

This project is open-source and free to use for educational and personal purposes.
