#!/bin/bash

#npm install nlogger
#npm install connect-form 
#npm install underscore
#npm install socket.io

echo '{ "counter": 0 }' > counter.json

mkdir audio

command_exists () {
      command -v  "$1" &> /dev/null ;
}
if command_exists mp3split ; then
  echo "Congratulations, your system already has mp3splt installed."
  echo "Setup is complete."
  exit 0;
fi


echo "checking OS type"
echo $OSTYPE

platform='unknown'
unamestr=${OSTYPE//[0-9.]/}
if [[ "$unamestr" == 'linux-gnu' ]]; then
     platform='linux'
elif [[ "$unamestr" == 'darwin' ]]; then
     platform='darwin'
fi

if [[ $platform == 'linux' ]]; then
  distro=$(lsb_release -c | sed -e 's/Codename://' -e 's/\t//g')
  echo $distro
  echo "deb http://mp3splt.sourceforge.net/repository $distro main" |sudo tee -a /etc/apt/sources.list
  sudo apt-get update
  sudo apt-get install libmp3splt0-mp3 libmp3splt0-ogg mp3splt mp3splt-gtk     
  #clean up and remove the mp3split line incase it makes trouble later
  sudo sed 's/^.*mp3splt.*//' /etc/apt/sources.list |sudo tee  /etc/apt/sources.list
  sudo apt-get update
elif [[ $platform == 'darwin' ]]; then
       echo "You need to install mp3split to run this app. http://mp3splt.sourceforge.net/mp3splt_page/downloads.php "
fi


echo "===================================================================="
echo "Setup is complete, you now have mp3splt installed on your machine. For more info on how to use it visit http://mp3splt.sourceforge.net/mp3splt_page/home.php"
which mp3splt
