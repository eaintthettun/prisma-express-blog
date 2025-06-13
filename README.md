# 📝 Blog Website using Prisma and Express

This is a full-stack blog application built with **Express.js** and **Prisma ORM**, featuring user authentication, post creation, comments, and post search functionality.

---

## 🚀 Technologies Used

### 🔤 Languages & Templates

- **EJS** – for server-side rendering
- **JavaScript**
- **CSS**

### 🛢️ Database & ORM

- **Prisma ORM**
- **PostgreSQL**

---

## ✨ Features

- 🔐 Login to the website to write blog posts
- 📝 Create, read, and manage blog content
- 💬 Comment on posts from other users
- 🔎 Search for posts by interest or keyword

---

## 📦 Getting Started

Follow these steps after downloading or cloning the project:

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npx prisma generate
```

### 3. Set up the database

Make sure PostgreSQL is installed and running.

If needed, create the database manually:

```sql
CREATE DATABASE blog_db;
```

### 4. Import demo data

Import the sample blog data using the `.sql` file provided:

```bash
psql -U postgres -d blog_db -f blog-demo.sql
```

> Replace `postgres` with your PostgreSQL username if it's different.

---

## ⚙️ Environment Variables

I have already provided a `.env` file in the root directory with the following content:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/blog_db?schema=public"
SECRET=yourSessionSecretHere
```

---

## ✅ Tips

- Use `npx prisma migrate dev` if you need to apply migrations before seeding data.
- Make sure to install [PostgreSQL](https://www.postgresql.org/download/) if you haven't already.
- If you see a `secret option required for sessions` error, check your `.env` file and ensure `SECRET` is defined.

---

## 📸 Screenshots

_Add screenshots of your blog here if available._

---

## 📜 License

This project is for educational purposes only.
