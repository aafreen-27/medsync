from flask import Flask, jsonify, request
from flask_cors import CORS
from pso import run_pso_optimization
import json

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "AI Microservice for PSO is running"})

@app.route('/optimize-schedule', methods=['POST'])
def optimize_schedule():
    '''
    Endpoint to trigger Particle Swarm Optimization for shift scheduling.
    Expects data such as staff vectors, workload parameters.
    '''
    try:
        data = request.get_json() or {}
        num_staff = data.get('num_staff', data.get('num_employees', 50))
        num_shifts = data.get('num_shifts', 3)
        
        # Run optimization
        optimal_schedule = run_pso_optimization(num_staff, num_shifts)
        
        return jsonify({
            "status": "success",
            "message": "PSO Schedule Generated",
            "data": optimal_schedule
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
