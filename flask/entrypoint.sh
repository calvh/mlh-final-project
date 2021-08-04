#!/bin/bash
#
# run flask-migrate scripts and start gunicorn

flask db migrate
flask db upgrade
gunicorn wsgi:app -w 1 -b 0.0.0.0:5000 --capture-output --log-level debug
