from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for tasks (for simplicity)
tasks = []
next_task_id = 1

# Helper function to find a task by ID
def find_task(task_id):
    return next((task for task in tasks if task['id'] == task_id), None)

# Route to get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# Route to create a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    global next_task_id
    if not request.json or not 'title' in request.json:
        abort(400, description="Title is required")  # Bad request if title is missing

    new_task = {
        'id': next_task_id,
        'title': request.json['title'],
        'description': request.json.get('description', ''),
        'status': 'pending',
        'due_date': request.json.get('due_date', None),  # Optional due date
        'priority': request.json.get('priority', 'Medium'),  # Default priority
        'category': request.json.get('category', 'Uncategorized'),  # Default category
        'history': [{'action': 'created', 'timestamp': datetime.now().isoformat()}]  # Task history
    }
    tasks.append(new_task)
    next_task_id += 1
    return jsonify(new_task), 201  # 201 = Created

# Route to update a task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = find_task(task_id)
    if not task:
        abort(404, description="Task not found")  # Not found if task doesn't exist

    if 'title' in request.json:
        task['title'] = request.json['title']
    if 'description' in request.json:
        task['description'] = request.json['description']
    if 'status' in request.json:
        task['status'] = request.json['status']
    if 'due_date' in request.json:
        task['due_date'] = request.json['due_date']
    if 'priority' in request.json:
        task['priority'] = request.json['priority']
    if 'category' in request.json:
        task['category'] = request.json['category']

    # Add update to task history
    task['history'].append({'action': 'updated', 'timestamp': datetime.now().isoformat()})

    return jsonify(task)

# Route to delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = find_task(task_id)
    if not task:
        abort(404, description="Task not found")  # Not found if task doesn't exist
    tasks.remove(task)
    return jsonify({'result': True})

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': str(error)}), 404

# Error handler for 400
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': str(error)}), 400

if __name__ == '__main__':
    app.run(debug=True)