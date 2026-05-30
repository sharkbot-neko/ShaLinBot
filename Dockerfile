FROM python:latest

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

ENTRYPOINT ["gunicorn", "-w", "2", "-b", "0.0.0.0:3003", "main:app"]