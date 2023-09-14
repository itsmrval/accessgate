#! /bin/bash

. /opt/accessgate_agent/config.txt

if [ $user == "accessgatemultiuser"]
then
	tmp_file=/opt/accessgate_agent/tmp_user.txt
	old_file=/opt/accessgate_agent/old_user.txt
	isDifferent=false
	curl -o $tmp_file -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/users
	[[ -f filename ]] || touch $old_file
	cmp --silent $old_file $tmp_file || isDifferent=true

	for x in $(head $tmp_file)
	do

		userPath=$x
		echo $x
		if [ $x != "root"  ]
		then
			userPath=home/$x
		fi
		mkdir -p $userPath/.ssh
		curl -o $userPath/.ssh -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/key/$x
	done

else
	if [ $user != "root"  ]
		then
			userPath=home/$x
		fi
	mkdir -p $userPath/.ssh
	curl -o $userPath/.ssh -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/allKeys

fi

mv $tmp_file $old_file
