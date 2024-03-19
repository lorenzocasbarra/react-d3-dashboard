FROM python:3.10-slim
ENV PYTHONUNBUFFERED=1

WORKDIR /api

COPY . .
RUN \
	pip install --upgrade pip && \
	pip install -r requirements.txt
	#pip install fastapi uvicorn numpy pandas pydantic scipy

EXPOSE 8000
