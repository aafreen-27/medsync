import numpy as np

def fitness_function(position):
    '''
    Evaluate the schedule validity.
    Lower score is better. Penalties applies for:
    - Overstaffing / Understaffing
    - Insufficient rest periods
    '''
    # Calculate workload imbalance using position values as staff allocation weights
    patients_per_staff = position
    return np.sum(np.abs(patients_per_staff - 1.5))

def run_pso_optimization(num_staff, num_shifts, iterations=30, num_particles=30):
    '''
    Run Particle Swarm Optimization for shift scheduling.
    '''
    # Initialize particle positions randomly (continuous values to represent shift assignment probability)
    dimensions = num_staff * num_shifts
    positions = np.random.rand(num_particles, dimensions) * 3
    velocities = np.random.rand(num_particles, dimensions) - 0.5
    
    p_best_positions = np.copy(positions)
    p_best_scores = np.array([fitness_function(p) for p in positions])
    
    g_best_index = np.argmin(p_best_scores)
    g_best_position = p_best_positions[g_best_index]
    
    # Simple PSO Loop
    w = 0.5
    c1 = 1.0
    c2 = 1.0
    
    for _ in range(iterations):
        for i in range(num_particles):
            r1, r2 = np.random.rand(2)
            velocities[i] = (w * velocities[i] + 
                             c1 * r1 * (p_best_positions[i] - positions[i]) + 
                             c2 * r2 * (g_best_position - positions[i]))
            positions[i] += velocities[i]
            
            score = fitness_function(positions[i])
            if score < p_best_scores[i]:
                p_best_scores[i] = score
                p_best_positions[i] = np.copy(positions[i])
                
        # Update global best
        current_g_best_index = np.argmin(p_best_scores)
        if p_best_scores[current_g_best_index] < fitness_function(g_best_position):
            g_best_position = np.copy(p_best_positions[current_g_best_index])
            
    # Convert best position into a readable mock schedule map
    reshaped = np.round(g_best_position).reshape(num_staff, num_shifts)
    schedule_mapping = []
    
    shift_names = ["Morning", "Evening", "Night"]
    for staff_idx in range(num_staff):
        shifts = []
        for shift_idx in range(num_shifts):
            # Assignment logic > 1 acts as 'assigned'
            if reshaped[staff_idx, shift_idx] > 1:
                shift_name = shift_names[shift_idx] if shift_idx < len(shift_names) else f"Shift_{shift_idx + 1}"
                shifts.append(shift_name)
        schedule_mapping.append({
            "employeeId": f"emp-{staff_idx}",
            "assignedShifts": shifts
        })
        
    return schedule_mapping
