#!/bin/bash
#
# run custom gunicorn command for socket.io

gunicorn -b 0.0.0.0:5000 --worker-class eventlet -w 1 --log-level debug wsgi:app 
