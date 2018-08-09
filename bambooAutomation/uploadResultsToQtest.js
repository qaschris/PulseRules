var payload = body;
var timestamp = new Date();

var testLogs = payload.logs;
var cycleId = payload["test-cycle"];
var projectId = payload.projectId;


var standardHeaders = {
    'Content-Type': 'application/json',
    'Authorization': constants.qTestAPIToken
}

var createLogsAndTCs = function() {
    var opts = {
        url: "https://" + constants.ManagerURL + "/api/v3/projects/" + projectId + "/auto-test-logs?type=automation",
        json: true,
        headers: standardHeaders,
        body: {
            skipCreatingAutomationModule: false,
            execution_date: timestamp.toISOString(),
            test_cycle: cycleId,
            test_logs: testLogs
        }
    };

    request.post(opts, function(err, response, resbody) {

        if(err) {
            Promise.reject(err); 

        }
        else {
            emitEvent('SlackEvent', { AutomationLogUploaded: resbody });
            
            if(response.body.type == "AUTOMATION_TEST_LOG") {
                Promise.resolve("Uploaded results successfully");
            }
            else {
                emitEvent('SlackEvent', { Error: "Unable to upload results"});
                Promise.reject("Unable to upload test results");
            }
        }
    });
};

createLogsAndTCs();