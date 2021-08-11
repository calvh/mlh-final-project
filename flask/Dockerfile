FROM python:3.8-slim-buster
WORKDIR /flask
COPY requirements.txt . 
RUN pip3 install -r requirements.txt
COPY . ./ 
RUN chmod u+x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
