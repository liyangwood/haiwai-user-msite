#!/usr/bin/env bash

FROM=${PWD};
TO=~/haiwai.com/pc;




copyFile(){
	DIR="$1"
	echo $DIR;
	rm -rf ${TO}/$DIR;
	cd ${TO};
	mkdir $DIR;
	cd ${FROM};
	\cp -fr ${FROM}/$DIR ${TO};
}

echo "---- start copy file ----";
gulp pub;
copyFile bower_components;
copyFile lib;
copyFile js;
copyFile image;
copyFile style;
copyFile page;

cd ${TO}
svn st | awk '{if ($1 == "?") {print $2} }' | xargs svn add;
svn ci -m 'update file from jacky github depot';
cd ${FROM}