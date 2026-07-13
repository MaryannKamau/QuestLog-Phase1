#  QuestLog: Full-Stack Video Game Portfolio Tracker

QuestLog is a lightweight full-stack web application designed to help multi-platform video game enthusiasts manage choice paralysis, catalog digital game collections, and monitor personal backlogs without ad-heavy clutter. 

The application dynamically interfaces with the live public **RAWG API** to aggregate comprehensive game metadata, processing relational data state updates locally inside an asynchronous Python Flask micro-server pipeline.


##  Live Production Deployments
The application is fully deployed and synchronized across a secure, split cloud infrastructure network on the live public internet:

*  **Frontend Client Interface (Vercel)**:[https://quest-log-phase-two.vercel.app/] 
*  **Backend Database API Server (Render)**:[https://questlog-backend-2.onrender.com]



## Tech Stack & Cloud Hosting Architecture

### Production Cloud Architecture Map
```text
  [ Client Browser UI Workspace ]
                │
                ▼ (Asynchronous HTTPS Data Handshake)
     [ Vercel Web Service ] ────────────> [ Render Application Cloud ]
     (Hosts React SPA Build)               (Hosts Flask API & Serverless Database)
                                                          │
                                                          ▼ (OR/M Schema Map)
                                                   [ questlog.db ]
```

### Core Production Technologies Matrix
* **Frontend Hosting Platform:** Hosted on **Vercel**. Operates a compiled React.js production bundle using React Router DOM, Vite compilation engines, and Vanilla CSS3 custom variables.
* **Backend Hosting Service:** Hosted on **Render** (Free Tier). Operates a persistent Python Flask application layer running on a high-performance Gunicorn production server engine.
* **Database & OR/M Engine:** SQLite Instance Database (`questlog.db` serverless file storage inside the Render cloud container), Flask-SQLAlchemy Object Relational Mapper, and Flask-Alembic DDL migration schemas.

### Production Environment Variables Configuration
To link the decoupled server clusters, the following cloud configuration variables are injected inside the web dashboards:
* **Vercel Settings:** `VITE_API_BASE_URL` is mapped directly to our live production database routing target: .
* **Render Settings:** `RAWG_API_KEY` is hardcoded globally within the app config context to securely pass credential verification to the RAWG metadata gateways.



##  Tech Stack & Architecture

### Frontend Workspace
* **Framework:** React.js (Single Page Application via Vite compilation engine)
* **Routing Control:** React Router DOM (Dynamic NavMesh routes)
* **Styling Matrix:** Vanilla CSS3 Variables (Custom deep purple and navy gaming layout theme)

### Backend Service API
* **Engine:** Python Flask Framework
* **OR/M Matrix:** Flask-SQLAlchemy (Object Relational Mapping layer)
* **Database Driver:** SQLite Engine (`questlog.db` serverless disk instance storage)
* **Migrations Manager:** Flask-Alembic (DDL schema migration version loops)



##  Relational Database Schema Model Design
The relational architecture links active players to nested data entries natively using explicit One-to-Many cascade foreign key constraints:

```text
  [ USER ]
     │
     ├─── (1-to-Many) ───> [ COLLECTION ] ─── (1-to-Many) ───> [ COLLECTION_GAME ]
     │                                                              (game_id)
     └─── (1-to-Many) ───> [ FAVOURITE ]
                                (game_id)
```

1. **User Model:** Tracks account rows (`id`, `username`, `password_hash`).
2. **Collection Model:** Tracks custom dashboard list channels (`id`, `name`, `user_id`).
3. **CollectionGame Model:** Maps specific video game assets stored inside collection lists (`id`, `collection_id`, `game_id`).
4. **Favourite Model:** Holds persistent liked heart indices tied to user rows (`id`, `user_id`, `game_id`).


##  Full-Stack Local Installation Guide

Follow these sequential setup commands to fire up both local development servers on your machine.

### Part 1: Initializing the Flask Backend Server
Open your system terminal and change directories into your server workspace root folder:
```bash
cd ~/Capstone-Project/QuestLog-Phase1/server
```

1. Initialize your isolated Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Download all required core team libraries:
   ```bash
   pip install -r requirements.txt
   ```
3. Generate your local structural database files and apply migration schemas:
   ```bash
   flask db upgrade
   ```
4. Run your team's structural seeding script to populate your default player test profiles:
   ```bash
   python -m app.seed
   ```
5. Turn on your live local API development loop:
   ```bash
   python run.py
   ```
*The backend API server will boot up cleanly listening on: `http://127.0.0.1:5000`*

### Part 2: Initializing the React Frontend Client
Open a **completely new terminal tab/window**, then navigate directly into your frontend code workspace folder:
```bash
cd ~/Capstone-Project/QuestLog-Phase1/client
```

1. Secure your network pipeline base path and inject your keys by creating an environment file:
   ```bash
   # FIXED: Appended the mandatory /api route endpoint mapping path securely
   echo "VITE_API_BASE_URL=http://127.0.0.1:5000/api" > .env
   echo "VITE_RAWG_API_KEY=6744b8fd7cf2484b87174f26dfd242a3" >> .env
   ```
2. Install all required React modules and UI compilation assets:
   ```bash
   npm install
   ```
3. Fire up the Vite local compilation development engine server:
   ```bash
   npm run dev
   ```
*The client browser application will compile and launch on host link: `http://localhost:5173`*
