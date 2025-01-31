# Task Manager

A full-stack Task Manager application built with **Flask** (backend) and **React** (frontend). This project helps users manage their tasks efficiently with features like task creation, editing, filtering, and exporting.

---

## **Features**

- **Task Management**:
  - Create, update, and delete tasks.
  - Mark tasks as completed.
  - Set due dates and priorities for tasks.
  - Categorize tasks (e.g., Work, Personal, Shopping).
- **Task History**:
  - View the history of task updates (e.g., created, updated).
- **Filtering**:
  - Filter tasks by status (All, Pending, Completed).
- **Search**:
  - Search tasks by title or description.
- **Export**:
  - Export tasks as CSV or JSON files.
- **Themes**:
  - Light and dark mode support.
- **Animations**:
  - Smooth animations for task cards and modals using Framer Motion.

---

## **Technologies Used**

- **Frontend**:
  - React (with Vite)
  - Tailwind CSS (for styling)
  - Framer Motion (for animations)
- **Backend**:
  - Flask (Python)
  - Flask-CORS (for handling cross-origin requests)
- **Other Tools**:
  - Postman (for API testing)
  - Git (for version control)

---

## **Setup Instructions**

```bash
### **1. Clone the Repository**
git clone https://github.com/thivsiv/Task-Manager.git

cd Task-Manager

### **2. Set Up the Backend**
 
Create a Virtual Environment:
python -m venv env

Activate the Virtual Environment:

On Windows:
env\Scripts\activate

On macOS/Linux:
source env/bin/activate

Install Python Dependencies:
pip install -r requirements.txt

Run the Flask Backend:
python app.py
The backend will run at http://127.0.0.1:5000.

### **3. Set Up the Frontend**

Navigate to the frontend folder:
cd frontend

Install Node.js dependencies:
npm install

Run the React Frontend:
npm run dev
The frontend will run at http://127.0.0.1:5173.

### **4. Environment Variables**
Create a .env file in the root directory with the following variables:

FLASK_ENV=development
FLASK_DEBUG=True
```


---
# Usage

Add a Task:
Enter the task title, description, due date, priority, and category.
Click "Add Task".

Edit a Task:
Click the "Edit" button on a task.
Update the task details and click "Save".

Mark as Completed:
Click the "Complete" button on a task.

Delete a Task:
Click the "Delete" button on a task.

Filter Tasks:
Use the filter dropdown to view tasks by status (All, Pending, Completed).

Search Tasks:
Use the search bar to find tasks by title or description.

Export Tasks:
Click "Export as CSV" or "Export as JSON" to download tasks.

Toggle Theme:
Click the "Dark Mode" or "Light Mode" button to switch themes.

---
# API Endpoints

Method	Endpoint	Description

GET	/api/tasks	Fetch all tasks

POST	/api/tasks	Create a new task

PUT	/api/tasks/<id>	Update a task

DELETE	/api/tasks/<id>	Delete a task


---

