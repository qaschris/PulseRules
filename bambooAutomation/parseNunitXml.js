const xml2js = require("xml2js");

var payload = body;
var testResults = payload.result;
var projectId = payload.projectID;
var cycleId = payload.testcycle;
var testLogs = [];
var timestamp = new Date();

function findTestSuiteArray(obj) {
  if (obj["test-suite"] === undefined) {
  	return obj;
  }
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return findTestSuiteArray(obj["test-suite"]);
  }
}

function findTestCaseTag(obj) {
  if (obj !== undefined && obj["test-case"] !== undefined) {
    return obj["test-case"];
  } else if (obj !== undefined) {
    return findTestCaseTag(obj["test-suite"]);
  }
}

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
        var testSuites = findTestSuiteArray(result["test-run"]);
        testSuites = Array.isArray(testSuites) ? testSuites : [testSuites];
        testSuites.forEach(function(suiteobj) {
            var testCasesArr = findTestCaseTag(suiteobj);
            var testcases = Array.isArray(testCasesArr) ? testCasesArr : [testCasesArr];
            testcases.forEach(function(obj) {
                var className = obj.$.classname;
                var methodName = obj.$.methodname;
                if (className === undefined || methodName === undefined) {
                    className = obj.$.fullname
                    methodName = obj.$.name
                }
                var methodStatus = obj.$.result;
                var startTime = obj.$["start-time"];
                var endTime = obj.$["end-time"];
                if (startTime === undefined || endTime === undefined) {
                    startTime = timestamp.toISOString();
                    endTime = timestamp.toISOString();
                } else {
                    var startDate = startTime.split(" ");
                    var endDate = endTime.split(" ");
                    startTime = startDate[0] + "T" + startDate[1];
                    endTime = endDate[0] + "T" + endDate[1];
                }
                var note = '';
                var stack = '';
                if (methodStatus == 'Failed') {
                    methodStatus = 'FAIL';
                } else if (methodStatus == 'Passed') {
                    methodStatus = 'PASS';
                } else {
                    methodStatus = 'SKIP';
                }
                if (methodStatus == 'FAIL') {
                    note = obj.failure.message;
                    stack = obj.failure["stack-trace"];
                }
                var testLog = {
                    status: methodStatus,
                    name: methodName,
                    attachments: [],
                    note: note,
                    exe_start_date: startTime,
                    exe_end_date: endTime,
                    automation_content: className + "#" + methodName,
                    module_names: [className, methodName]
                };
                if (stack !== undefined && stack !== '') {
                    testLog.attachments.push({
                        name: `${methodName}.txt`,
                        data: Buffer.from(stack).toString("base64"),
                        content_type: "text/plain"
                    });
                }
                testLogs.push(testLog);
            });
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