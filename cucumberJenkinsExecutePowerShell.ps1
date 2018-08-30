$url = 'https://pulse-us-east-1.qtestnet.com/api/v1/webhooks/1f19e79d-a7b9-43fb-8e9e-fb7e14d0e86f'

Set-Location -Path "./target"

$payload = (Get-Content "cucumber-report.json" -Raw)

$body = @{
   'projectId' = '74528'
   'test-cycle' = '1166189'
   'requiresDecode' = 'true'
   'result' = $payload
}

Invoke-RestMethod -Body $body -Method 'Post' -Uri $url