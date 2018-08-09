#!/bin/bash

logs=$(<output.xml)
newdata=$(echo "$logs" | tr '&' '~')
body="projectID=81024&testcycle=1439494&result=$newdata"

curl -d "$body" POST https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/8ec398ee-7bc2-41e7-8ea2-8fef64874f02