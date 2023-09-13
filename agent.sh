#!/bin/bash

url=$1
server=$2
secret=$3
user=$4
rootpath="/opt/accessgate"
updateScriptUrl=https://raw.githubusercontent.com/itsmrval/accessgate/scripts/update.sh


i=0
while [ $i -ne 100 ]
do
        i=$(($i+1))
        echo ""
done

printf "    ___                            ______      __      \n"
printf "   /   | _____________  __________/ ____/___ _/ /____  \n"
printf "  / /| |/ ___/ ___/ _ \/ ___/ ___/ / __/ __ \`/ __/ _ \ \n"
printf " / ___ / /__/ /__/  __(__  |__  ) /_/ / /_/ / /_/  __/ \n"
printf "/_/  |_\___/\___/\___/____/____/\____/\__,_/\__/\___/  \n\n\n\n"
                                          
echo -ne "[INFO] Checking agent directory.. "

if [ -d "$rootpath" ]
then
	rm -rf $rootpath
fi
mkdir -p $rootpath
echo -ne "✓\n"

echo -ne "[INFO] Testing parameters.. "

secretRequest=$(curl -s -X GET -H 'Content-Type: application/json' -d '{"secret": "'$secret'"}' $url/endpoint/update/$server)

if [ "$secretRequest" = "invalid request" ]
then
	echo -ne "✗\n"
	echo '[ERROR] Please verify your configuration'
	exit
else
	echo -ne "✓\n"
fi

echo -ne "[INFO] Creating agent directory.. "
touch $rootpath/config.txt
truncate -s 0 $rootpath/config.txt
tee -a $rootpath/config.txt > /dev/null <<EOT
server=$server
url=$url
secret=$secret
user=$user
EOT
echo -ne "✓\n"

echo -ne "[INFO] Downloading update script.. "
curl -s $updateScriptUrl --output $rootpath/update.sh
echo -ne "✓\n"

echo -n "[INFO] Creating crontab entry.. "

(crontab -u root -l; echo "* * * * * /bin/sh /opt/accessgate/update.sh" ) | crontab -u root -
sleep 0.5
echo -ne "✓\n"

echo -ne "[SUCCESS] Script ended \n\n"
