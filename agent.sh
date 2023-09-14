#! /bin/bash


. config.txt

if [ $user == "accessgatemultiuser"]
then
	tmp_file=tmp_user.txt
	old_file=old_user.txt
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




# mkdir -p /$user/.ssh/
# curl -o /$user/.ssh/authorized_keys -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server/key/$1

mv $tmp_file $old_file
