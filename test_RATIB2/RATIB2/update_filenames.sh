#!/bin/bash

PREVIMGFRAME=$((1))
NUM2=$((0))

for FILE in `ls -d *.dcm`
do
    NUM1=$(echo "$FILE" | cut -d- -f2)
    NUM1=$((10#$NUM1 - 8))

    if [ $NUM1 -eq $PREVIMGFRAME ]
    then
	NUM2=$(($NUM2 + 1))
    else
	PREVIMGFRAME=$(($NUM1))
	NUM2=$((1))
    fi

    NEWFILE=$(printf "%02d-%03d.dcm" $NUM1 $NUM2)
    mv $FILE $NEWFILE
done
