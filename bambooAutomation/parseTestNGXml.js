const xml2js = require("xml2js");

var payload = body;
var testResults = payload.result;
var projectId = payload.projectID;
var cycleId = payload.testcycle;
var testLogs = [];
var timestamp = new Date();

var xmlString = decodeURI(testResults);
xmlString = xmlString.replace(/`/g, '&');

xml2js.parseString(xmlString, {
    preserveChildrenOrder: true,
    explicitArray: false,
    explicitChildren: false
}, function (err, result) {
    if (err) {
        emitEvent('SlackEvent', { Error: "Unexecpted Error Parsing XML Document: " + err }); 
    } else {
        var testcases = Array.isArray(result.testsuite.testcase) ? result.testsuite.testcase : [result.testsuite.testcase]
        testcases.forEach(function(obj) {
            var name = `${obj.$.classname}#${obj.$.name}`;
            var exe_start_date = timestamp;
            var exe_end_date = timestamp;
            exe_end_date.setSeconds(exe_start_date.getSeconds() + (Math.floor(obj.$.time || 0)));

            var status = (undefined !== obj.skipped) ? "SKIP" : obj.failure ? "FAIL" : "PASS";
            var testCase = {
                status: status,
                name: name,
                attachments: [],
                exe_start_date: exe_start_date.toISOString(),
                exe_end_date: exe_end_date.toISOString(),
                automation_content: name,
                module_names: [obj.$.classname, obj.$.name],
                test_step_logs: [{
                    order: 0,
                    status: status,
                    description: obj.$.name,
                    expected_result: obj.$.name
                }]
            };
            if (obj.failure) {
                testCase.attachments.push({
                    name: `${obj.$.name}.txt`,
                    data: Buffer.from(obj.failure._).toString("base64"),
                    content_type: "text/plain"
                });
            }
            testLogs.push(testCase);
        });

    }
});

var formattedResults = {
    "projectId" : projectId,
    "test-cycle" : cycleId,
    "logs" : testLogs
};

emitEvent('SlackEvent', { ResultsFormatSuccess: "Results formatted successfully for project" }); 
emitEvent('UpdateQTestWithFormattedResultsEvent', formattedResults );
