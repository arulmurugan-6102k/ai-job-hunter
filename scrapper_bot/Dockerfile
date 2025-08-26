FROM python:3.11-slim

WORKDIR /app

# Install Chromium browser + dependencies (but NOT chromedriver from apt)
RUN apt-get update && apt-get install -y \
    wget unzip curl gnupg2 \
    chromium \
    fonts-liberation libnss3 libxss1 libayatana-appindicator3-1 libasound2 \
    libatk-bridge2.0-0 libgtk-3-0 libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# 🧩 Download matching ChromeDriver (v138) manually from Google's Testing repo
RUN wget https://storage.googleapis.com/chrome-for-testing-public/138.0.7204.183/linux64/chromedriver-linux64.zip && \
    unzip chromedriver-linux64.zip && \
    mv chromedriver-linux64/chromedriver /usr/bin/chromedriver && \
    chmod +x /usr/bin/chromedriver && \
    rm -rf chromedriver-linux64.zip chromedriver-linux64

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_DRIVER=/usr/bin/chromedriver

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy bot
COPY jophunter.py .

CMD ["python", "jophunter.py"]
