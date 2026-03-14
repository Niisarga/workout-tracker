let workouts = [];
let currentExerciseCount = 0;

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const workoutForm = document.getElementById('workout-form');
const exercisesContainer = document.getElementById('exercises-container');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const addWorkoutBtn = document.getElementById('add-workout-btn');
const workoutModal = document.getElementById('workout-modal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.getElementById('modal-body');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const SHEET_ENDPOINT = "https://api.sheety.co/07fc597a264c8328e3a403f20b473910/untitledSpreadsheet/sheet1";

document.addEventListener('DOMContentLoaded', async () => {

    loadLocalWorkouts();          // Load local data first
    await loadWorkoutsFromSheet(); // Then load API data

    initializeDatePicker();
    setupEventListeners();

    updateDashboard();
    updateHistory();
});

async function loadWorkoutsFromSheet() {
    try {
        const res = await fetch(SHEET_ENDPOINT);
        const data = await res.json();

        if(data.sheet1){

            const sheetWorkouts = data.sheet1.map(row => ({
                id: Date.now() + Math.floor(Math.random()*1000),
                name: row.exercise,
                date: row.date,
                duration: parseInt(row.duration) || 0,
                exercises: [{name: row.exercise, sets: []}],
                calories: parseFloat(row.calories) || 0,
                notes: ""
            }));

            const existing = new Set(workouts.map(w => w.name + w.date));

            sheetWorkouts.forEach(w=>{
                if(!existing.has(w.name + w.date)){
                    workouts.push(w);
                }
            });
        }

    } catch(err){
        console.error("Failed to load from Sheety:", err);
    }
}

function loadLocalWorkouts(){
    const stored = localStorage.getItem('workouts');

    if(stored){
        workouts = JSON.parse(stored);
    }
}

function saveWorkoutsToLocal(){
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

async function saveWorkoutToSheet(workout){

    const sheetData = {
        sheet1:{
            date: workout.date,
            time: new Date().toLocaleTimeString(),
            exercise: workout.name,
            duration: workout.duration,
            calories: workout.calories || 0
        }
    };

    try{

        const res = await fetch(SHEET_ENDPOINT,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(sheetData)
        });

        const data = await res.json();
        console.log("Saved to Sheety:", data);

    }catch(err){
        console.error("Sheety save failed:", err);
    }
}

function initializeDatePicker(){
    document.getElementById('workout-date').value =
        new Date().toISOString().split('T')[0];
}

function setupEventListeners() {

    tabBtns.forEach(btn =>
        btn.addEventListener('click', () => switchTab(btn.dataset.tab))
    );

    // Form submit
    if(workoutForm){
        workoutForm.addEventListener('submit', handleFormSubmit);
    }

    // Add workout button
    if(addWorkoutBtn){
        addWorkoutBtn.addEventListener('click', handleFormSubmit);
    }

    // Add exercise
    if(addExerciseBtn){
        addExerciseBtn.addEventListener('click', addExercise);
    }

    // Modal close
    if(modalClose){
        modalClose.addEventListener('click', closeModal);
    }

    if(workoutModal){
        workoutModal.addEventListener('click', (e)=>{
            if(e.target === workoutModal) closeModal();
        });
    }

    if(clearHistoryBtn){
        clearHistoryBtn.addEventListener('click', clearAllHistory);
    }

    document.addEventListener('keydown',(e)=>{
        if(e.key === 'Escape') closeModal();
    });
}
function switchTab(tabName){

    tabBtns.forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    tabContents.forEach(content=>{
        content.classList.toggle('active', content.id === tabName);
    });
}

function addExercise(){

    currentExerciseCount++;

    const exerciseId = `exercise-${currentExerciseCount}`;

    const html = `
        <div class="exercise-item" id="${exerciseId}">
            <div class="exercise-header">
                <input type="text" class="exercise-name-input" placeholder="Exercise name" required>
                <button type="button" class="remove-exercise-btn" onclick="removeExercise('${exerciseId}')">&times;</button>
            </div>
        </div>
    `;

    exercisesContainer.insertAdjacentHTML('beforeend', html);
}

function removeExercise(id){
    const el = document.getElementById(id);
    if(el) el.remove();
}

function handleFormSubmit(e){

    e.preventDefault();

    const name = document.getElementById('workout-name').value.trim();
    const date = document.getElementById('workout-date').value;
    const duration = parseInt(document.getElementById('workout-duration').value);

    const workout = {
        id: Date.now(),
        name,
        date,
        duration,
        exercises:[{name, sets:[]}],
        calories:0,
        notes:""
    };

    workouts.push(workout);

    saveWorkoutsToLocal();
    saveWorkoutToSheet(workout);

    updateDashboard();
    updateHistory();

    showNotification(`Workout "${name}" added! ✅`);

    workoutForm.reset();
    exercisesContainer.innerHTML = '';
    currentExerciseCount = 0;

    initializeDatePicker();

    switchTab('dashboard');
}

function updateDashboard(){

    const total = workouts.length;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7*24*60*60*1000);

    const thisWeek = workouts.filter(w => new Date(w.date) >= weekAgo).length;

    const totalMinutes = workouts.reduce((sum,w)=>sum + (w.duration || 0),0);

    const totalHours = Math.round(totalMinutes/60*10)/10;

    document.getElementById('total-workouts').textContent = total;
    document.getElementById('this-week').textContent = thisWeek;
    document.getElementById('total-time').textContent = totalHours;
    document.getElementById('streak').textContent = calculateStreak();

    const recentList = document.getElementById('recent-workouts-list');

    recentList.innerHTML = workouts.slice(-5).reverse().map(w=>`
        <div class="workout-card">
            ${w.name} • ${w.date} • ${w.duration} min • ${w.calories} cal
        </div>
    `).join('');
}

function updateHistory(){

    const historyList = document.getElementById('history-list');

    if(!historyList) return;

    if(workouts.length === 0){
        historyList.innerHTML = '<p class="empty-state">No workouts yet.</p>';
        return;
    }

    const recentWorkouts = workouts
        .slice(-5)      // last 5
        .reverse();     // newest first

    historyList.innerHTML = recentWorkouts.map(w => `
        <div class="workout-card">
            ${w.name} • ${w.date} • ${w.duration} min • ${w.calories} cal
        </div>
    `).join('');
}

function viewWorkout(id){

    const workout = workouts.find(w=>w.id === id);

    if(!workout) return;

    modalBody.innerHTML = `
        <div>
            ${workout.name} • ${workout.date} • ${workout.duration} min • ${workout.calories} cal
        </div>
    `;

    workoutModal.classList.add('active');
}

function closeModal(){
    workoutModal.classList.remove('active');
}

function clearAllHistory(){

    const historyList = document.getElementById('history-list');

    if(!historyList) return;

    if(confirm("Clear history view? (Dashboard data will stay)")){

        // Clear only the UI
        historyList.innerHTML = '<p class="empty-state">History cleared.</p>';

    }
}
function showNotification(message, duration = 3000){

    const notif = document.getElementById('notification');

    notif.textContent = message;

    notif.style.display = 'block';

    setTimeout(()=>{
        notif.style.display = 'none';
    }, duration);
}

function calculateStreak(){
    return workouts.length; // simple placeholder
}

window.addExercise = addExercise;
window.removeExercise = removeExercise;
window.viewWorkout = viewWorkout;
