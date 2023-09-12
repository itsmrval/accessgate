#! /bin/bash

. /opt/accessgate/config.txt
curl -o a -s -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server
