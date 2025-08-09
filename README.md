# AI Job Hunter

AI Job Hunter is a web application that scrapes job listings using a Python bot, stores them via a Laravel API backend, and displays them through a React frontend.

## Features

- 🧠 Python bot to scrape job listings
- 🛠️ Laravel API to store and serve job data
- 💻 React frontend for browsing jobs
- 🐳 Dockerized for easy development and deployment

## Tech Stack

- Frontend: React + Vite
- Backend: Laravel (PHP)
- Scraper Bot: Python (Flask)
- Database: MySQL
- Web Server: Nginx
- Containerization: Docker & Docker Compose

## Setup Instructions

```bash
# Clone the repository
git clone git@github.com:arulmurugan-6102k/ai-job-hunter.git
cd ai-job-hunter

# Start services
sudo docker compose up --build
