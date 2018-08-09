$logs = Get-Content output.xml
$newdata = [uri]::EscapeUriString($logs)
$newdata = $newdata.replace('&','~')
$body = "projectID=81024&testcycle=1439494&result=$newdata"

Invoke-WebRequest -Uri "https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/4b313ec6-29d9-450e-83c4-02feeb618079" -Method POST -Body $body
