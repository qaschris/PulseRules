#!/bin/bash
 
cd target/surefire-reports
logs=$(<testng-results.xml)
newdata=$(echo "$logs" | tr '&' '`')
body="projectID=79992&testcycle=1491707&result=$newdata&jobName=JenkinsJobName"
echo "$body" >> ${BUILD_NUMBER}
 
curl -d @${BUILD_NUMBER} POST https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/e14a79dd-aa3e-4736-939d-866ac49be977