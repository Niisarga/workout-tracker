// // Workout Tracker App - JavaScript

// // App State
// let workouts = [];
// let currentExerciseCount = 0;

// // DOM Elements
// const tabBtns = document.querySelectorAll('.tab-btn');
// const tabContents = document.querySelectorAll('.tab-content');
// const workoutForm = document.getElementById('workout-form');
// const exercisesContainer = document.getElementById('exercises-container');
// const addExerciseBtn = document.getElementById('add-exercise-btn');
// const workoutModal = document.getElementById('workout-modal');
// const modalClose = document.querySelector('.modal-close');
// const modalBody = document.getElementById('modal-body');
// const clearHistoryBtn = document.getElementById('clear-history-btn');

// // Initialize App
// document.addEventListener('DOMContentLoaded', () => {
//     loadWorkouts();
//     initializeDatePicker();
//     setupEventListeners();
//     updateDashboard();
// });

// // Load workouts from localStorage
// function loadWorkouts() {
//     const storedWorkouts = localStorage.getItem('workouts');
//     if (storedWorkouts) {
//         workouts = JSON.parse(storedWorkouts);
//     }
// }

// // Save workouts to localStorage
// function saveWorkouts() {
//     localStorage.setItem('workouts', JSON.stringify(workouts));
// }

// // Initialize date picker to today's date
// function initializeDatePicker() {
//     const dateInput = document.getElementById('workout-date');
//     const today = new Date().toISOString().split('T')[0];
//     dateInput.value = today;
// }

// // Setup all event listeners
// function setupEventListeners() {
//     // Tab navigation
//     tabBtns.forEach(btn => {
//         btn.addEventListener('click', () => switchTab(btn.dataset.tab));
//     });

//     // Form submission
//     workoutForm.addEventListener('submit', handleFormSubmit);

//     // Add exercise button
//     addExerciseBtn.addEventListener('click', addExercise);

//     // Modal close
//     modalClose.addEventListener('click', closeModal);
//     workoutModal.addEventListener('click', (e) => {
//         if (e.target === workoutModal) closeModal();
//     });

//     // Clear history
//     clearHistoryBtn.addEventListener('click', clearAllHistory);

//     // Escape key to close modal
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape') closeModal();
//     });
// }

// // Tab switching
// function switchTab(tabName) {
//     tabBtns.forEach(btn => {
//         btn.classList.toggle('active', btn.dataset.tab === tabName);
//     });

//     tabContents.forEach(content => {
//         content.classList.toggle('active', content.id === tabName);
//     });

//     // Update dashboard when switching to it
//     if (tabName === 'dashboard') {
//         updateDashboard();
//     }

//     // Update history when switching to it
//     if (tabName === 'history') {
//         updateHistory();
//     }
// }

// // Add exercise to the form
// function addExercise() {
//     currentExerciseCount++;
//     const exerciseId = `exercise-${currentExerciseCount}`;

//     const exerciseHtml = `
//         <div class="exercise-item" id="${exerciseId}">
//             <div class="exercise-header">
//                 <input type="text" class="exercise-name-input" placeholder="Exercise name (e.g., Bench Press)" required>
//                 <button type="button" class="remove-exercise-btn" onclick="removeExercise('${exerciseId}')">&times;</button>
//             </div>
//             <div class="sets-container" id="${exerciseId}-sets">
//                 <div class="set-row">
//                     <div>
//                         <label>Weight (kg)</label>
//                         <input type="number" class="set-weight" placeholder="0" min="0" step="0.5">
//                     </div>
//                     <div>
//                         <label>Reps</label>
//                         <input type="number" class="set-reps" placeholder="0" min="0">
//                     </div>
//                     <div>
//                         <label>Sets</label>
//                         <input type="number" class="set-count" value="1" min="1">
//                     </div>
//                     <button type="button" class="remove-set-btn" onclick="this.parentElement.remove()">🗑️</button>
//                 </div>
//             </div>
//             <button type="button" class="add-set-btn" onclick="addSet('${exerciseId}-sets')">+ Add Set</button>
//         </div>
//     `;

//     exercisesContainer.insertAdjacentHTML('beforeend', exerciseHtml);
// }

// // Add set to an exercise
// function addSet(setsContainerId) {
//     const setsContainer = document.getElementById(setsContainerId);
//     const setHtml = `
//         <div class="set-row">
//             <div>
//                 <label>Weight (kg)</label>
//                 <input type="number" class="set-weight" placeholder="0" min="0" step="0.5">
//             </div>
//             <div>
//                 <label>Reps</label>
//                 <input type="number" class="set-reps" placeholder="0" min="0">
//             </div>
//             <div>
//                 <label>Sets</label>
//                 <input type="number" class="set-count" value="1" min="1">
//             </div>
//             <button type="button" class="remove-set-btn" onclick="this.parentElement.remove()">🗑️</button>
//         </div>
//     `;
//     setsContainer.insertAdjacentHTML('beforeend', setHtml);
// }

// // Remove exercise from the form
// function removeExercise(exerciseId) {
//     const exercise = document.getElementById(exerciseId);
//     if (exercise) {
//         exercise.remove();
//     }
// }

// // Handle form submission
// function handleFormSubmit(e) {
//     e.preventDefault();

//     // Get form values
//     const workoutName = document.getElementById('workout-name').value.trim();
//     const workoutDate = document.getElementById('workout-date').value;
//     const workoutDuration = parseInt(document.getElementById('workout-duration').value);
//     const workoutNotes = document.getElementById('workout-notes').value.trim();

//     // Get exercises
//     const exerciseItems = document.querySelectorAll('.exercise-item');
//     const exercises = [];

//     exerciseItems.forEach(item => {
//         const exerciseName = item.querySelector('.exercise-name-input').value.trim();
//         if (exerciseName) {
//             const sets = [];
//             const setRows = item.querySelectorAll('.set-row');
            
//             setRows.forEach(row => {
//                 const weight = parseFloat(row.querySelector('.set-weight').value) || 0;
//                 const reps = parseInt(row.querySelector('.set-reps').value) || 0;
//                 const setCount = parseInt(row.querySelector('.set-count').value) || 1;
                
//                 if (weight > 0 || reps > 0) {
//                     for (let i = 0; i < setCount; i++) {
//                         sets.push({ weight, reps });
//                     }
//                 }
//             });

//             if (sets.length > 0 || exerciseName) {
//                 exercises.push({ name: exerciseName, sets });
//             }
//         }
//     });

//     // Create workout object
//     const workout = {
//         id: Date.now(),
//         name: workoutName,
//         date: workoutDate,
//         duration: workoutDuration,
//         notes: workoutNotes,
//         exercises,
//         createdAt: new Date().toISOString()
//     };

//     // Save workout
//     workouts.push(workout);
//     saveWorkouts();

//     // Reset form
//     workoutForm.reset();
//     initializeDatePicker();
//     exercisesContainer.innerHTML = '';
//     currentExerciseCount = 0;

//     // Show success and switch to dashboard
//     alert('Workout saved successfully! 💪');
//     switchTab('dashboard');
// }

// // Update dashboard with stats
// function updateDashboard() {
//     // Calculate stats
//     const totalWorkouts = workouts.length;
    
//     // This week's workouts
//     const now = new Date();
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo).length;
    
//     // Total hours
//     const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
//     const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
    
//     // Calculate streak
//     const streak = calculateStreak();

//     // Update DOM
//     document.getElementById('total-workouts').textContent = totalWorkouts;
//     document.getElementById('this-week').textContent = thisWeekWorkouts;
//     document.getElementById('total-time').textContent = totalHours;
//     document.getElementById('streak').textContent = streak;

//     // Show recent workouts
//     const recentList = document.getElementById('recent-workouts-list');
//     if (workouts.length === 0) {
//         recentList.innerHTML = '<p class="empty-state">No workouts yet. Start your fitness journey!</p>';
//     } else {
//         const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
//         const recentWorkouts = sortedWorkouts.slice(0, 5);
        
//         recentList.innerHTML = recentWorkouts.map(workout => `
//             <div class="workout-card" onclick="viewWorkout(${workout.id})">
//                 <div class="workout-card-header">
//                     <div>
//                         <div class="workout-card-title">${workout.name}</div>
//                         <div class="workout-card-date">${formatDate(workout.date)}</div>
//                     </div>
//                     <span class="exercise-count">${workout.exercises.length} exercises</span>
//                 </div>
//                 <div class="workout-card-details">
//                     <div class="workout-detail">⏱️ <span>${workout.duration}</span> min</div>
//                     <div class="workout-detail">🏋️ <span>${getTotalSets(workout)}</span> sets</div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// // Update history view
// function updateHistory() {
//     const historyList = document.getElementById('history-list');
    
//     if (workouts.length === 0) {
//         historyList.innerHTML = '<p class="empty-state">No workout history yet.</p>';
//     } else {
//         const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
//         historyList.innerHTML = sortedWorkouts.map(workout => `
//             <div class="workout-card" onclick="viewWorkout(${workout.id})">
//                 <div class="workout-card-header">
//                     <div>
//                         <div class="workout-card-title">${workout.name}</div>
//                         <div class="workout-card-date">${formatDate(workout.date)}</div>
//                     </div>
//                     <span class="exercise-count">${workout.exercises.length} exercises</span>
//                 </div>
//                 <div class="workout-card-details">
//                     <div class="workout-detail">⏱️ <span>${workout.duration}</span> min</div>
//                     <div class="workout-detail">🏋️ <span>${getTotalSets(workout)}</span> sets</div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// // View workout details in modal
// function viewWorkout(workoutId) {
//     const workout = workouts.find(w => w.id === workoutId);
//     if (!workout) return;

//     const exercisesHtml = workout.exercises.map(exercise => `
//         <div class="modal-exercise">
//             <div class="modal-exercise-name">${exercise.name}</div>
//             ${exercise.sets.length > 0 ? `
//                 <table class="modal-sets-table">
//                     <thead>
//                         <tr>
//                             <th>Set</th>
//                             <th>Weight</th>
//                             <th>Reps</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${exercise.sets.map((set, i) => `
//                             <tr>
//                                 <td>${i + 1}</td>
//                                 <td>${set.weight} kg</td>
//                                 <td>${set.reps}</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             ` : '<p style="color: var(--text-secondary);">No sets recorded</p>'}
//         </div>
//     `).join('');

//     modalBody.innerHTML = `
//         <div class="modal-workout-title">${workout.name}</div>
//         <div class="modal-workout-meta">
//             📅 ${formatDate(workout.date)} • ⏱️ ${workout.duration} min
//         </div>
//         ${workout.notes ? `<p style="margin-bottom: 16px;"><strong>Notes:</strong> ${workout.notes}</p>` : ''}
//         <div class="modal-exercises">
//             <h3>Exercises</h3>
//             ${exercisesHtml || '<p style="color: var(--text-secondary);">No exercises added</p>'}
//         </div>
//         <button class="btn btn-danger modal-delete-btn" onclick="deleteWorkout(${workout.id})">Delete Workout</button>
//     `;

//     workoutModal.classList.add('active');
// }

// // Close modal
// function closeModal() {
//     workoutModal.classList.remove('active');
// }

// // Delete workout
// function deleteWorkout(workoutId) {
//     if (confirm('Are you sure you want to delete this workout?')) {
//         workouts = workouts.filter(w => w.id !== workoutId);
//         saveWorkouts();
//         closeModal();
//         updateDashboard();
//         updateHistory();
//     }
// }

// // Clear all history
// function clearAllHistory() {
//     if (workouts.length === 0) {
//         alert('No workouts to clear.');
//         return;
//     }
    
//     if (confirm('Are you sure you want to delete all workout history? This cannot be undone.')) {
//         workouts = [];
//         saveWorkouts();
//         updateDashboard();
//         updateHistory();
//     }
// }

// // Utility functions
// function formatDate(dateString) {
//     const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
// }

// function getTotalSets(workout) {
//     return workout.exercises.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 0), 0);
// }

// function calculateStreak() {
//     if (workouts.length === 0) return 0;

//     const sortedDates = [...new Set(workouts.map(w => w.date))].sort().reverse();
//     const today = new Date().toISOString().split('T')[0];
//     const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

//     // Check if there's a workout today or yesterday
//     if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
//         return 0;
//     }

//     let streak = 1;
//     for (let i = 1; i < sortedDates.length; i++) {
//         const current = new Date(sortedDates[i - 1]);
//         const previous = new Date(sortedDates[i]);
//         const diffDays = Math.round((current - previous) / (1000 * 60 * 60 * 24));

//         if (diffDays === 1) {
//             streak++;
//         } else {
//             break;
//         }
//     }

//     return streak;
// }

// // Make functions globally accessible
// window.removeExercise = removeExercise;
// window.addSet = addSet;
// window.viewWorkout = viewWorkout;
// window.deleteWorkout = deleteWorkout;

// ---------------- App State ----------------
// ---------------- App State ----------------
let workouts = [];
let currentExerciseCount = 0;

// ---------------- DOM Elements ----------------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const workoutForm = document.getElementById('workout-form');
const exercisesContainer = document.getElementById('exercises-container');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const workoutModal = document.getElementById('workout-modal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.getElementById('modal-body');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// ---------------- Sheety Endpoint ----------------
const SHEET_ENDPOINT = "https://api.sheety.co/07fc597a264c8328e3a403f20b473910/untitledSpreadsheet/sheet1";

// ---------------- Initialize App ----------------
document.addEventListener('DOMContentLoaded', () => {
    loadWorkoutsFromSheet();
    initializeDatePicker();
    setupEventListeners();
});

// ---------------- Fetch workouts from Google Sheets ----------------
async function loadWorkoutsFromSheet() {
    try {
        const response = await fetch(SHEET_ENDPOINT);
        const data = await response.json();
        // Map the sheet data into app workout objects
        workouts = data.sheet1.map((row, index) => ({
            id: Date.now() + index, // simple unique ID
            name: row.exercise,
            date: row.date,
            duration: parseInt(row.duration),
            notes: row.notes || "",
            exercises: [{ name: row.exercise, sets: [] }],
            createdAt: new Date().toISOString()
        }));
        updateDashboard();
        updateHistory();
    } catch (err) {
        console.error("Failed to load workouts from Sheet:", err);
        workouts = []; // fallback empty
        updateDashboard();
        updateHistory();
    }
}

// ---------------- Save new workout to Google Sheets ----------------
async function saveWorkoutToSheet(workout) {
    const sheetData = {
        sheet1: {
            date: workout.date,
            time: new Date().toLocaleTimeString(),
            exercise: workout.name,
            duration: workout.duration,
            calories: 0, // can be left 0
            notes: workout.notes
        }
    };
    try {
        const response = await fetch(SHEET_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sheetData)
        });
        const data = await response.json();
        console.log("Saved to Google Sheets:", data);
    } catch (err) {
        console.error("Failed to save workout to Sheet:", err);
    }
}

// ---------------- DOM & Form Utilities ----------------
function initializeDatePicker() {
    const dateInput = document.getElementById('workout-date');
    dateInput.value = new Date().toISOString().split('T')[0];
}

function setupEventListeners() {
    // Tab navigation
    tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

    // Form submission
    workoutForm.addEventListener('submit', handleFormSubmit);

    // Add exercise button
    addExerciseBtn.addEventListener('click', addExercise);

    // Modal close
    modalClose.addEventListener('click', closeModal);
    workoutModal.addEventListener('click', e => { if (e.target === workoutModal) closeModal(); });

    // Clear history
    clearHistoryBtn.addEventListener('click', clearAllHistory);

    // Escape key
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ---------------- Tabs ----------------
function switchTab(tabName) {
    tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
    tabContents.forEach(content => content.classList.toggle('active', content.id === tabName));

    if (tabName === 'dashboard') updateDashboard();
    if (tabName === 'history') updateHistory();
}

// ---------------- Exercises ----------------
function addExercise() {
    currentExerciseCount++;
    const exerciseId = `exercise-${currentExerciseCount}`;
    const exerciseHtml = `
        <div class="exercise-item" id="${exerciseId}">
            <div class="exercise-header">
                <input type="text" class="exercise-name-input" placeholder="Exercise name" required>
                <button type="button" class="remove-exercise-btn" onclick="removeExercise('${exerciseId}')">&times;</button>
            </div>
        </div>
    `;
    exercisesContainer.insertAdjacentHTML('beforeend', exerciseHtml);
}

function removeExercise(exerciseId) {
    const exercise = document.getElementById(exerciseId);
    if (exercise) exercise.remove();
}

// ---------------- Form Handling ----------------
function handleFormSubmit(e) {
    e.preventDefault();
    const workoutName = document.getElementById('workout-name').value.trim();
    const workoutDate = document.getElementById('workout-date').value;
    const workoutDuration = parseInt(document.getElementById('workout-duration').value);
    const workoutNotes = document.getElementById('workout-notes').value.trim();

    if (!workoutName || !workoutDate || !workoutDuration) {
        alert("Please fill in all required fields.");
        return;
    }

    const workout = {
        id: Date.now(),
        name: workoutName,
        date: workoutDate,
        duration: workoutDuration,
        notes: workoutNotes,
        exercises: [{ name: workoutName, sets: [] }],
        createdAt: new Date().toISOString()
    };

    workouts.push(workout);
    saveWorkoutToSheet(workout);

    workoutForm.reset();
    initializeDatePicker();
    exercisesContainer.innerHTML = '';
    currentExerciseCount = 0;

    alert('Workout saved successfully! 💪');
    switchTab('dashboard');
}

// ---------------- Dashboard ----------------
function updateDashboard() {
    const totalWorkouts = workouts.length;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7*24*60*60*1000);
    const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo).length;
    const totalMinutes = workouts.reduce((sum,w)=>sum+(w.duration||0),0);
    const totalHours = Math.round(totalMinutes/60*10)/10;
    const streak = calculateStreak();

    document.getElementById('total-workouts').textContent = totalWorkouts;
    document.getElementById('this-week').textContent = thisWeekWorkouts;
    document.getElementById('total-time').textContent = totalHours;
    document.getElementById('streak').textContent = streak;

    const recentList = document.getElementById('recent-workouts-list');
    if(workouts.length===0){
        recentList.innerHTML = '<p class="empty-state">No workouts yet.</p>';
    } else {
        const sorted = [...workouts].sort((a,b)=> new Date(b.date)-new Date(a.date));
        recentList.innerHTML = sorted.slice(0,5).map(w=>`
            <div class="workout-card" onclick="viewWorkout(${w.id})">
                ${w.name} • ${w.date} • ${w.duration} min
            </div>
        `).join('');
    }
}

// ---------------- History ----------------
function updateHistory() {
    const historyList = document.getElementById('history-list');
    if(workouts.length===0){
        historyList.innerHTML = '<p class="empty-state">No workout history yet.</p>';
    } else {
        const sorted = [...workouts].sort((a,b)=> new Date(b.date)-new Date(a.date));
        historyList.innerHTML = sorted.map(w=>`
            <div class="workout-card" onclick="viewWorkout(${w.id})">
                ${w.name} • ${w.date} • ${w.duration} min
            </div>
        `).join('');
    }
}

// ---------------- Modal ----------------
function viewWorkout(workoutId){
    const workout = workouts.find(w=>w.id===workoutId);
    if(!workout) return;
    modalBody.innerHTML = `<div>${workout.name} • ${workout.date} • ${workout.duration} min</div>`;
    workoutModal.classList.add('active');
}

function closeModal(){ workoutModal.classList.remove('active'); }

// ---------------- Clear History ----------------
function clearAllHistory(){
    if(!confirm("Delete all workouts?")) return;
    workouts.forEach(async w=> {
        // optional: delete from sheet via API if you want
    });
    workouts=[];
    updateDashboard();
    updateHistory();
}

// ---------------- Streak ----------------
function calculateStreak(){
    if(workouts.length===0) return 0;
    const sortedDates = [...new Set(workouts.map(w=>w.date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    let streak=0;
    for(let i=0;i<sortedDates.length;i++){
        const current = new Date(sortedDates[i]);
        const yesterday = new Date(Date.now() - 24*60*60*1000*i);
        if(current.toISOString().split('T')[0]===yesterday.toISOString().split('T')[0]) streak++;
        else break;
    }
    return streak;
}

// ---------------- Globals ----------------
window.addExercise = addExercise;
window.removeExercise = removeExercise;
window.viewWorkout = viewWorkout;