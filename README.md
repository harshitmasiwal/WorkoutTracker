# Track Better – Workout Tracker

Track Better is a fitness tracking application that helps users manage workouts, follow structured training routines, and visualize exercises with demonstration GIFs.

It provides a simple and organized way to plan workouts by day and maintain consistency with fitness goals.

Website: https://track-better.vercel.app/  
Documentation: https://harshitmasiwal-workouttracker.mintlify.app

---

## Features

- Day-wise workout planning
- Exercise-based training routines
- Exercise demonstration GIFs
- Structured workout data
- Fast and lightweight interface
- Clean and simple UI

---

## Workout Structure

The application organizes workouts into structured training days such as:

- Push Day (Chest, Shoulders, Triceps)
- Pull Day (Back, Biceps)
- Leg Day
- Core & Abs
- Cardio / Recovery

Each workout includes:

- Exercise name  
- Sets  
- Reps  
- Rest time  
- Demonstration GIF  

Example workout format:

```json
{
  "exercise": "Push Ups",
  "sets": 3,
  "reps": "12-15",
  "rest": "60 sec"
}
```

---

## Tech Stack

- Frontend: JavaScript, HTML, CSS  
- Framework: SvelteKit  
- Documentation: Mintlify  
- Assets: Exercise GIFs  
- Deployment: Vercel

---

## Project Structure

```
WorkoutTracker
│
├── src
│   ├── routes
│   ├── components
│   ├── data
│
├── static
│   └── exercise-gifs
│
├── docs
│
├── package.json
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/harshitmasiwal/WorkoutTracker.git
```

Navigate to the project directory:

```bash
cd WorkoutTracker
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Future Improvements

- User authentication
- Workout history tracking
- Progress analytics
- Custom workout builder
- Mobile responsive UI
- AI workout recommendations

---

## Author

Harshit Masiwal  
