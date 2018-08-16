#Navigating to Results Directory
cd $Env:bamboo_build_working_directory
cd target/surefire-reports

#Saving Results XML Document
$logs = Get-Content TEST-TestSuite.xml
$newdata = [uri]::EscapeUriString($logs)
$newdata = $newdata.replace('&','`')
$body = "projectID=81024&testcycle=1430468&result=$newdata"

#Curl Request
# If (Test-Path Alias:curl) {Remove-Item Alias:curl}
# If (Test-Path Alias:curl) {Remove-Item Alias:curl}
# curl -v -d $body -H "cache-control: no-cache" POST https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/8ec398ee-7bc2-41e7-8ea2-8fef64874f02

#Powershell Request
Invoke-WebRequest -Uri "https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/8ec398ee-7bc2-41e7-8ea2-8fef64874f02" -Method POST -Body $body
