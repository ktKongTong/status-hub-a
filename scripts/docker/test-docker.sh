#!/bin/bash

MAX_RETRIES=3

docker compose -f docker/docker-compose.ci.yml up -d

if [[ $? -ne 0 ]]
then
    echo "failed to run docker"
    exit 1
fi

RETRY=1

curl --fail http://localhost:8418/api/ping
while [[ $? -ne 0 ]] && [[ $RETRY -lt $MAX_RETRIES ]]; do
    sleep 5
    ((RETRY++))
    echo "RETRY PING: ${RETRY}"
    curl --fail http://localhost:8418/api/ping
done

docker compose -f docker-compose.ci.yml down


if [[ $RETRY -ge $MAX_RETRIES ]]
then
    echo "Unable to receive PONG, aborted"
    exit 1
else
    echo "received PONG, passing"
    exit 0
fi