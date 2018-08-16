# Navigating to Results Directory
cd SeleniumDemoProject/bin/Debug

# Saving Results XML Document
$logs = Get-Content TestResult.xml
$newdata = [uri]::EscapeUriString($logs)
$newdata = $newdata.replace('&','`')
$body = "projectID=81024&testcycle=1439298&result=$newdata"

# Curl Request
#  If (Test-Path Alias:curl) {Remove-Item Alias:curl}
#  If (Test-Path Alias:curl) {Remove-Item Alias:curl}
#  curl -v -d $body -H "cache-control: no-cache" POST https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/8ec398ee-7bc2-41e7-8ea2-8fef64874f02

# Powershell Request
Invoke-WebRequest -Uri "https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/dec2b523-373d-4a91-826e-44b2c3ab3b68" -Method POST -Body $body
