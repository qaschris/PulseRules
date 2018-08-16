const xml2js = require("xml2js");

var payload = body;
var testResults = payload.result;
var projectId = payload.projectID;
var cycleId = payload.testcycle;
var testLogs = [];
var timestamp = new Date();

function formatDate(obj) {
  if (obj.length < 9) {
    return null;
  }
  var year = obj.substring(0,4);
  var month = obj.substring(4,6);
  var day = obj.substring(6,8);
  var time = obj.substring(9, obj.length);
  return year + "-" + month + "-" + day + "T" + time + "Z";
}

var xmlString = decodeURI(testResults);
xmlString = xmlString.replace(/~/g, '&');

xml2js.parseString(xmlString, {
    preserveChildrenOrder: true,
    explicitArray: false,
    explicitChildren: false
}, function (err, result) {
    if (err) {
        emitEvent('SlackEvent', { Error: "Unexecpted Error Parsing XML Document: " + err }); 
    } else {
        testSuites = Array.isArray(result.robot.suite.suite) ? result.robot.suite.suite : [result.robot.suite.suite]
        testSuites.forEach(function(suiteobj) {
            var testcases = Array.isArray(suiteobj.test) ? suiteobj.test : [suiteobj.test]
            var suiteName = suiteobj.$.name;
            testcases.forEach(function(obj) {
                var testCaseName = obj.$.name;
                var status = obj.status.$.status;
                var startingTime = formatDate(obj.status.$.starttime);
                var endingTime = formatDate(obj.status.$.endtime);
                var note = "";
                var testMethods = Array.isArray(obj.kw) ? obj.kw : [obj.kw];
                testMethods.forEach(function(tm) {
                    var methodName = tm.$.name
                    var status = tm.status.$.status;
                    var stepCount = 0;
                    var stepLog = []
                    if (Array.isArray(tm.kw)) {
                        var testStepsArray  = tm.kw;
                        testStepsArray.forEach(function(ts) {
                            stepLog.push({
                            order: stepCount++,
                            status: ts.status.$.status,
                            description: ts.$.name,
                            expected_result: ts.doc
                            });
                            if (ts.msg !== undefined) {
                            note = ts.msg._;
                            }
                        });
                    }
                    var testLog = {
                        status: status,
                        name: methodName,
                        note: note,
                        exe_start_date: startingTime,
                        exe_end_date: endingTime,
                        automation_content: testCaseName + "#" + methodName,
                        test_step_logs: stepLog,
                        module_names: [testCaseName, methodName]
                    };
                    testLogs.push(testLog);
                });
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