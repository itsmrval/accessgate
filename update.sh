#! /bin/bash

. /opt/accessgate/config.txt

if [ $user != "root" ]
then
user="home/$user"
fi

mkdir -p /$user/.ssh/
curl -o /$user/.ssh/authorized_keys -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server
