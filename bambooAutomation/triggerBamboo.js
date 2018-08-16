var bambooProjectCode = body.commits[0].message;

//Either place project code in constants or pass in an argument from the GitHub payload
// var url = "http://" + constants.BambooURL + '/rest/api/latest/queue/' + constants.BambooProjectandPlan + '?stage&executeAllStages&customRevision&os_authType=basic';

var url = "http://" + constants.BambooURL + '/rest/api/latest/queue/' + bambooProjectCode + '?stage&executeAllStages&customRevision&os_authType=basic';


var opts = {
    url: url,
    insecure: true,
    contentType: "application/json; charset=UTF-8",
    auth: {
       "user": constants.BambooUserName,
       "pass": constants.BambooPassword
    }
}

request.post(opts, function(err, res, bd) {
        if(err) {
            Promise.reject(err);
            emitEvent('SlackEvent', { GitPushBambooProject: "Git Push but commit message is not project name code" }); 


        }
        else {
            emitEvent('SlackEvent', { BambooCallSuccess: "Bamboo Build just kicked off for this plan " + bambooProjectCode }); 

        }
    // emitEvent('SlackEvent', { BambooCallSuccess: "Bamboo Build just kicked off for this plan " + bambooProjectCode }); 
})