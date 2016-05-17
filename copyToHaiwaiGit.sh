#!/usr/bin/env bash

FROM=${PWD};
TO=~/Users/JackyLee/Desktop/haiwai.inc/haiwai/pc;




copyFile(){
	DIR="$1"
	echo $DIR;
	rm -rf ${TO}/$DIR;
	cd ${TO};
	mkdir $DIR;
	cd ${FROM};
	\cp -fr ${FROM}/$DIR ${TO};
}

cd ${TO}
git pull

echo "---- start copy file ----";
gulp pub;
copyFile bower_components;
copyFile lib;
copyFile js;
copyFile image;
copyFile style;
copyFile page;

cd ${TO}
git add .
git commit -m 'update file from jacky github depot. https://github.com/liyangwood/haiwai-user-msite'
git push
cd ${FROM}