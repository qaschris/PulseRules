# Bamboo Automation with Pulse

## Overview:

This guide illustrates how to automate testing with qTest Pulse. The workflow incorporates GitHub, Bamboo, Slack and testing frameworks including TestNG + Selenium, Robot + Python, and NUnit + Selenium. In this example, the Bamboo builds are triggered after a push event that contains the specific project/plan code in the commit message. After the project runs the XML results file is sent to Pulse. Pulse will parse the results and upload to qTest Manager. In addition, Slack will get notified during each step of the process. This repository contains Java Script files that can be uploaded to Pulse, and PowerShell/Bash Scripts that are implemented in the Bamboo Build.

## Set up qTest Pulse:

### Import Rules:

Import the rules.json file to Pulse. The import button is located in the bottom right under the Rule Section.

### Constants:

Create constants as shown in the image below with your information:

![](/bambooAutomation/images/pulseconstants.png)

**BambooURL** The base Bamboo Url

**BambooUserName** The login username for Bamboo

**BambooPassword** The login password for Bamboo

**qTestAPIToken** Your qTest API Token

**ManagerURL** Your qTest base URL

**SlackWebHook** Slack Webhook that can be created using [https://slack.com/apps/A0F7XDUAZ-incoming-webhooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)


## Set up GitHub:

Navigate to the repository where the project will be located. Go to settings and click on the Webhooks tab. Add a Webhook and in the section for a Payload URL place the Pulse URL for the "triggerBamboo" Event in Pulse. To find the Pulse URL click on the Edit Event Button (Pencil Icon) next to the triggerBamboo Event. Finally, save the Webhook.

![](/bambooAutomation/images/pulseurl.png)

![](/bambooAutomation/images/githubwebhook.png)

## Set up qTest Manager:

To post testcases and testruns to qTest, the automation test-logs API requires a ProjectId and Test-Cycle Id. Navigate to the project, in which you would like the results to be updated. Aquire the Project Id which can be found in the URL directly after the baseURL. 

![](/bambooAutomation/images/qtestprojectid.png)


Next, click on the Test Execution tab and add a new test cycle, which is the button located in the top right in the image below.

![](/bambooAutomation/images/testcycleqtest.png)

Aquire the Test-Cycle Id, which is the last string of numbers in the URL directly following "id=". 

![](/bambooAutomation/images/qtesttestcycleid.png)

Save the Project Id and Test-Cycle Id, which will be used in an execution script in Bamboo.

## Set up Bamboo:

Create a Project and Plan in Bamboo. In the job add a Source Code Checkout task linked to the repository where the project source code is located. Add an execution script to run tests. Finally, add an execution script to post results to qTest Pulse. Examples of execution scripts are included for PowerShell and Bash Scripts. In the $body variable replace the projectID and testcycle inputs with your values from qTest Manager. In the request, replace the URL with the parser event in qTest Pulse that you would like to implement. 


### Example Bamboo Configuration

The in the Default Job for the Plan add the following three tasks:

For this example we will be pulling a TestNg Sample Test from QASymphony GitHub&#39;s testng-sample https://github.com/QASymphony/testng-sample. 

1) Choose the "Source Code Checkout" task and link the testng-sample repository in the Source Code Coniguration Tab as shown below:

![](/bambooAutomation/images/sourcecodeconf.PNG)

2) Choose the "script" task, and add a task to run maven tests. Make sure you have maven installed on your machine, and choose an interpreter that can be used on machine. In the script body add the following command:

`mvn clean compile package test`

3) Choose the "script" task again, and copy the contents of either "bambooTestNGScript.ps1" or "bambooTestNGBashScript.bash" into the script body based on the Interpreter that you would like to use.

In the script, replace the values of projectId and testcycle with the values that you acquired from qTest Manager. The values are located in the $body variable. Finally replace the url in the request with the "parseTestNGResults" Event URL, which can be found in Pulse.

![](/bambooAutomation/images/bambooscript.png)

The tasks should be formatted as below:

![](/bambooAutomation/images/bambootasks.PNG)

Note: If you run this build, the results from the TestNG tests will be parsed and uploaded to qTest Manager in the project that you specified. If testcases have not been created yet, they will be made automatically.

## Pulse Workflow:

Once Pulse, GitHub, Slack, Manager, and Bamboo are setup properly, this workflow example is ready! The first rule "TriggerBamboo" gets intiatied when there is a push event to the GitHub repository that has the Pulse webhook configured in settings. The rule "triggerBamboo" is set up to start the build if the GitHub commit message is the Bamboo Project/Plan Id. The projectID can be found in the Bamboo URL on the plan homepage as shown below.

![](/bambooAutomation/images/bambooprojectid.png)

For example the commit message below will trigger the plan SP-NP when the push event occurs.

`git commit -m "SP-NP"` 

This can be useful if there are multiple plans in Bamboo configured for the same project. 

Note: If you would like to have the same build triggered every time there is a push event regardless of message, you can add another constant for the Project Plan code and update the "triggerBamboo" Action in Pulse.


Throughout the workflow Slack will notify you with a short message when a Bamboo Build gets triggered, XML results are parsed, and results uploaded to qTest Manager. Slack will also notify you if there are any errors in the workflow.  













