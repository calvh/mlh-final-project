#!/bin/bash

root_url="https://rockpaperscissors.duckdns.org/"

function get_endpoint() {

  description=$1
  url=$2
  expected_status_code=$3

  args=(
        --head 
        --silent 
        --output /dev/null 
        --write-out %{http_code}
        --connect-timeout 5
        --max-time 10
        --retry 5
        --retry-delay 0
        --retry-max-time 40
    "$url")

  status=$(curl "${args[@]}")
  message="Test: ${description} ${expected_status_code} ->"

  if [[ "${status}" == "${expected_status_code}" ]]; then
    echo "${message} succeeded."
  else
    echo "${message} failed. Got ${status} instead."
    exit 1
  fi
}

# test index page
get_endpoint "GET '/' ..." "${root_url}" 200

# test projects page
get_endpoint "GET '/play' ..." "${root_url}play" 200

# test contact page
get_endpoint "GET '/auth/login/' ..." "${root_url}auth/login/" 200

# test resume page
get_endpoint "GET '/auth/register/' ..." "${root_url}auth/register/" 200

# test 404 page
get_endpoint "GET '/oops/' ..." "${root_url}oops/" 404
