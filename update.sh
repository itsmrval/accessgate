#! /bin/bash

. /opt/accessgate_agent/config.txt

if [ "$user" = "accessgatemultiuser" ]
then
        tmp_file=/opt/accessgate_agent/tmp_user.txt
        old_file=/opt/accessgate_agent/old_user.txt
        isDifferent=false
        curl -o $tmp_file -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/users
        touch $old_file
        cmp --silent $old_file $tmp_file || isDifferent=true

        if [ isDifferent = "true" ]
        then
        for x in $(head $old_file)
        do
                rm /home/$x/.ssh/authorized_keys        
        done
        fi

        for x in $(head $tmp_file)
        do

                mkdir -p /home/$x/.ssh
                curl -o /home/$x/.ssh/authorized_keys -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/key/$x
        done
        mv $tmp_file $old_file
else
        if [ $user != "root"  ]
                then
                        userPath=home/$x
                fi
        mkdir -p /$user
        mkdir -p /$user/.ssh/
        curl -o /$user/.ssh/authorized_keys -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/allKeys

fi
