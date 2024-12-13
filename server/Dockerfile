FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11


COPY ./requirements.txt /tmp
COPY init_dbData.py /app/init_dbData.py

RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt


WORKDIR /app

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "python init_dbData.py && uvicorn main:app --host 0.0.0.0 --port 5000"]