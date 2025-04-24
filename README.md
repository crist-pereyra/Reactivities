# Reactivities

# Reactivities 🧭

Welcome to **Reactivities**, a real-time social activity hub that allows users to explore, join, and manage events with a powerful modern tech stack.

![Reactivities Preview 1](/client/public/preview-1.png)

![Reactivities Preview 2](/client/public/preview-2.png)

![Reactivities Preview 3](/client/public/preview-3.png)

![Reactivities Preview 4](/client/public/preview-4.png)

---

## 🧪 Tech Stack

### 🖥️ Frontend

- ⚛️ **React 19** with TypeScript — component-based, responsive UI
- 🎯 **TanStack Query** — data fetching and caching
- 🧩 **Zustand** — global state management
- 🧼 **Shadcn/ui** — accessible and beautiful UI components
- 📋 **React Hook Form** — powerful form handling
- 🖼️ **Dropzone** — profile image upload interface
- 🗺️ **Map Integration** — to display activity locations

### 🔧 Backend

- 🧱 **.NET Core 9** — scalable and high-performance API
- ⚙️ **MediatR** — clean CQRS and decoupled architecture
- 🔁 **AutoMapper** — easy object mapping
- 📡 **SignalR** — real-time comments on activities
- 🔐 **Identity** — user registration and authentication
- 🖥️ **SQL Server** — for smooth database management

---

## ✨ Features

- 🔐 User Registration & Authentication
- 📍 Create, Edit, Delete, and Join Activities
- 💬 Real-time Chat (SignalR) in Activity Details
- 🤝 Follow and Unfollow Users
- 🧑‍🤝‍🧑 See Attendees and Host Info
- 🗺️ View Activities on an Interactive Map
- 🖼️ Upload Profile Photos (Cloudinary)
- 🔎 Filter Activities by Date and Category
- 🎨 Light/Dark Theme Toggle

---

## 🚀 Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/)
- [Node.js](https://nodejs.org/) (v22+)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- Cloudinary account for photo uploads

### Backend Setup

```bash
cd API
dotnet ef database update
dotnet run
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure Overview

```bash
Reactivities/
├─ API/             # ASP.NET Core API
├─ Application/     # Business logic, CQRS, validation
├─ client/          # React 19 frontend with TanStack Query & Zustand
├─ Domain/          # Core domain entities
├─ Infrastructure/  # Photo service, security
├─ Persistence/     # EF Core, database context and migrations
├─ docker-compose.yml
└─ Reactivities.sln
```

---
