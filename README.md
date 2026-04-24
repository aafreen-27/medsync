# MedSync

MedSync is a full-stack hospital management platform containing:
- A Node.js backend (`/backend`)
- A React frontend (`/frontend`) 
- A Python AI microservice for schedule optimization (`/ai-service`)

## Running the Project

Currently, the AI microservice must be started separately from the backend server to work. 

**Start the AI Service:**
```bash
cd ai-service
python app.py
```

**Start the Backend:**
```bash
cd backend
npm start
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
