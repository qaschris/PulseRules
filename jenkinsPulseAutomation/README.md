# Jenkins Automation with Pulse

## Overview:

This guide illustrates how to automate testing with qTest Pulse. The workflow incorporates Jenkins, Slack and TestNG. In this example, the Jenkins Build has a post build action and makes a curl request to Pulse with the testng-results.xml file. Pulse will parse the results and upload to qTest Manager. In addition, Slack will get notified during each step of the process. This repository contains an rules.json file that can be uploaded to Pulse, and the shell script that can be used in the Jenkins workflow.

Note: Slack is not needed with uploading results.

## Set up qTest Pulse:

### Import Rules:

Import the rules.json file to Pulse. The import button is located in the bottom right under the Rule Section.

### Constants:

Create constants as shown in the image below with your information:

![](/jenkinsPulseAutomation/images/pulseconstants.png)

**qTestAPIToken** Your qTest API Token

**JenkinsURL** The base Jenkins Url

**SlackWebHook** Slack Webhook that can be created using [https://slack.com/apps/A0F7XDUAZ-incoming-webhooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)

**JenkinsUserName** The login username for Jenkins

**JenkinsAPIToken** The API Token for Jenkins

**JenkinsJobToken** Build Trigger for Jenkins Job, only needed if you want to trigger builds remotely

**JenkinsJobName** Name of Jenkins Job, only needed if you want to trigger builds remotely

**ManagerURL** Your qTest base URL


## Set up qTest Manager:

To post testcases and testruns to qTest, the automation test-logs API requires a ProjectId and Test-Cycle Id. Navigate to the project, in which you would like the results to be updated. Aquire the Project Id which can be found in the URL directly after the baseURL. 

![](/jenkinsPulseAutomation/images/qtestprojectid.png)


Next, click on the Test Execution tab and add a new test cycle, which is the button located in the top right in the image below.

![](/jenkinsPulseAutomation/images/testcycleqtest.png)

Aquire the Test-Cycle Id, which is the last string of numbers in the URL directly following "id=". 

![](/jenkinsPulseAutomation/images/qtesttestcycleid.png)

Save the Project Id and Test-Cycle Id, which will be used in an execution script in Jenkins.

## Set up Jenkins:

Create a Project and Plan in Jenkins. In the job add a Source Code Checkout task linked to the repository where the project source code is located. Add an execution script to run tests. Finally, add an execution script to post results to qTest Pulse. Examples of execution script is included in the repository. In the $body variable replace the projectID and testcycle inputs with your values from qTest Manager. In addition replace the jobName with the name of your Jenkins Job which is getting built. In the request, replace the URL with the JenkinsConsoleOutput event in qTest Pulse. 


### Example Jenkins Configuration

For this example we will be pulling a TestNg Sample Test from QASymphony GitHub&#39;s testng-sample https://github.com/QASymphony/testng-sample. 

1) Link the testng-sample repository in the Source Code Coniguration Tab

2) Add a build step and add a task to run maven tests. Make sure you have maven installed on your machine, and choose an interpreter that can be used on machine. In the script body add the following command:

`mvn clean compile package test`

3) Choose the "script" task again, and copy the contents of jenkinsPostBuildScript.bash into the shell script inpterpreter.

In the script, replace the values of projectId and testcycle with the values that you acquired from qTest Manager. Also replace the jobName with the name of the Jenkins Job that you are running. The values are located in the $body variable. Finally replace the url in the request with the "jenkinsConsoleOutput" Event URL, which can be found in Pulse.


Note: If you run this build, the results from the TestNG tests will be parsed and uploaded to qTest Manager in the project that you specified. If testcases have not been created yet, they will be made automatically.

## Pulse Workflow:

Once Pulse, Slack, Manager, and Jenkins are setup properly, this workflow example is ready! 

Throughout the workflow Slack will notify you with a short message when a Jenkins XML results are parsed, the Jenkins Console Log is acquired, and results uploaded to qTest Manager. Slack will also notify you if there are any errors in the workflow.  













