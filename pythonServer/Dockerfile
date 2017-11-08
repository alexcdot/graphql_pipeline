FROM python:2.7-onbuild

WORKDIR /usr/src/app

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "graphqlServer.py"]