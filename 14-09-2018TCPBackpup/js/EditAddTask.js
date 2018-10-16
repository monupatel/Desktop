
function editAddTask(tid,listName,mydata,storeidlist,imagesrc,storstatus,statusId,mediatype,roleId,userId,url,statusOld,Assignment,did,rid){
	var boolval =true;				         
  var urls =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('"+listName+"')/items('"+tid+"')";

					$.ajax({
						 url: urls,
						 type: "PATCH",
						 async: false,
						 //data: datavalue,
						 data:JSON.stringify(mydata),
					     headers:{
						 "accept":"application/json;odata=verbose",
						 "content-type": "application/json;odata=verbose",
						 "X-RequestDigest":$("#__REQUESTDIGEST").val(),
						 "X-Http-Method": "PATCH",
						 "If-Match": "*"
						},
						 success: onSuccess,
						 error: onError
						 });
						  function onSuccess(data) {
													  
						  	
						}
						function onError(error) {
						//alert(JSON.stringify(error));
						}
	
	
					if(Assignment)
					{				  
				       var j=0;		
				       var arr=[];								   
						  for(var i=0;i<storeidlist.length;i++)
						  {	                           
							var mdata ={
							             __metadata: { 'type': 'SP.Data.TaskAssignmentTrlListItem' },
							             taskIdId:parseInt(tid),
							             storeIdId:parseInt(storeidlist[i].ID),
							             statusId : storstatus,
						               };
						      j++;
							  arr.push(mdata);
							  if(j==100)
							  {	
							    j=0;
							    addEmployeeInfoBatchRequest(arr,'0');
							    arr.length=0;
						      }
							  else if((i+1)==(storeidlist.length))
							  {
							   addEmployeeInfoBatchRequest(arr,i);
							   arr.length=0;
							   // alert("Saved Assignment...");
							  }           
							              	              	               
						  }
						}
													  
 
			 for(var j=0;j<imagesrc.length;j++)
			 {
			 
			 	var guidname = uuidv4()+imagesrc[j].Name;
			    var uploadfilename = imagesrc[j].Name;
			    var DataArray = imagesrc[j].Src;
			     var url1 =  _spPageContextInfo.webAbsoluteUrl +
					   "/_api/Web/Lists/getByTitle('TaskMediaTrl')/RootFolder/Files/Add(url='" + guidname+ "', overwrite=false)?$expand=ListItemAllFields";
			
			 	$.ajax({
						 url: url1,
						 type: "POST",
						 async: false,
						 processData: false,
						 data:DataArray,
						 headers:{ "ACCEPT": "application/json;odata=verbose",
						           "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
									"content-length": DataArray.byteLength,
									"X-Atlassian-Token": "nocheck"
								 },
					     success: onSuccess,
						 error: onError
					 });
						function onSuccess(data) 
						{
																  var mediaId = data.d.ListItemAllFields.ID;
																  var ur =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskMediaTrl')/items("+mediaId+")";
																	 var mdta ={ __metadata: { 'type': 'SP.Data.TaskMediaTrlItem' },
																	taskIdId:parseInt(tid),
																	medTypeId:parseInt(mediatype),
																	fileName:uploadfilename,
																	 };
																				      	                                     
														                     $.ajax({
																					  url: ur,
																					  type: "POST",
																					  async: false,
																					  data: JSON.stringify(mdta),
																					  headers:{
																					  "accept": "application/json;odata=verbose",
																					  "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
																					  "content-Type": "application/json;odata=verbose",
																					  "X-Http-Method": "PATCH",
																					  "If-Match": "*"
																					  },
																					  success: onSuccess,
																				     error: onError
																				  });
																				  function onSuccess(data) {													        
												
																				  }
																				  function onError(error) {
																				     //alert(JSON.stringify(error));
																				  }
								 }
											       
						function onError(error) {
						 //alert(JSON.stringify(error));
					  }
			 }
 
      var logurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskLogTrl')/items"; 
			var mdta1 = "";
			
		if(statusOld != 4)
		{
			if(roleId == 1)
			{
				var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:2,
					logDescription:"Task has been edited",
			        };
																		
				tasklog(logurl,mdta1);
				
			}
			else if(roleId == 2)
			{
				var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:1,
					responsibleUserId:userId,
					logDescription:"Task has been edited",
			        };
																		
				tasklog(logurl,mdta1);
				
			}
			else if(roleId == 3)
			{
				var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:5,
					regionId:parseInt(rid),
					logDescription:"Task has been edited",
			        };
																		
				tasklog(logurl,mdta1);
				
			}
			else if(roleId == 5)
			{
				var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:3,
					districtId:parseInt(did),
					logDescription:"Task has been edited",
					};
				
														
				tasklog(logurl,mdta1);
				
  			}
  		}
  		else
  		{
  			if(roleId == 5 || roleId == 3)
  			{
  			var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:5,
					regionId:parseInt(rid),
					logDescription:"Task has been edited",
			        };
																		
				tasklog(logurl,mdta1);
			}
			else
			{
				var mdta1 ={ __metadata: { 'type': 'SP.Data.TaskLogTrlListItem' },
				    taskIdId:parseInt(tid),
					logType:"Update",
					logStatusId: statusId,
					roleIdId:2,
					logDescription:"Task has been edited",
			        };
																		
				tasklog(logurl,mdta1);
			}	

  		}
  			if(statusId == 3)
  			{
  				if(storeidlist.length > 0)
  				{
  					var query = "";
  					for(var k=0;k<storeidlist.length;k++)
		               {
		                 query = query +"( storeIdId eq "+storeidlist[k].ID+" ) or ";
		               }
		               var pos=query.lastIndexOf(")");
					   query=query.substring(0,pos+1);

  					$.ajax({
					     url:_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/GetByTitle('TaskAssignmentTrl')/Items?$select=*,storeId/districtId,storeId/regionId,storeId/ID,storeId/storeNumber,storeId/storeName,taskId/ID,taskId/taskName,taskId/taskStartDate,taskId/taskEndDate,taskId/districtId,taskId/regionId,taskId/taskEndDate,taskId/taskLiveDate,status/name,status/ID&$expand=storeId,taskId,status&$filter=(taskId/Id eq '"+tid+"') and ("+query+") and (deleteFlag eq 'No') &$orderby=ID&$top=5000",
					     type:"GET",
					     async: false,
					     headers:{'accept':'application/json;odata=verbose'},		     
					    success:function(data){
						      var NewSavedData = data.d.results;
						      var logurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskLogTrl')/items";
						     for(var m=0;m<NewSavedData.length;m++)
			                 {
			             	    var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt(tid),logType:"Update",logStatusId:5,storeIdId:parseInt(NewSavedData[m].ID),roleIdId:6,logDescription:"Task is Open",storeNumberId:parseInt(NewSavedData[m].storeId.ID)};
			                    tasklog(logurl,dvalue1);
			                   }
	    			     //}
			        
					    }});
  					
  					
  					
  				}
  			}
  			alert("Task has been Edited");
  			window.location = url;
  			
  			return boolval;
  		}
  			
  			function tasklog(logurl,dataval)
             {
                      $.ajax({
						  url:logurl,
						  type: "POST",
						  async: false,
						  data: JSON.stringify(dataval),
						  headers:{
						  "accept":"application/json;odata=verbose",
						  "content-type": "application/json;odata=verbose",
						  "X-RequestDigest":$("#__REQUESTDIGEST").val(),
						  },
						    success: onSuccess,
							 error: onError
						 });
					  function onSuccess(data) {													        
							
							}
					  function onError(error) {
						//alert(JSON.stringify(error));
					  }

             }
             
             

  		//}	

  function uuidv4() {
 /*  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
   return v.toString(16);
 });*/
  var d = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
     var r = (d + Math.random() * 16) % 16 | 0;
     d = Math.floor(d / 16);
     return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
   });
   return uuid;
  }



function addEmployeeInfoBatchRequest(storeAsjson) {


  

    // generate a batch boundary
    var batchGuid = uuidv4();
    var batchContents = new Array();
    var changeSetId = uuidv4();
    var temp = document.createElement('a');
    temp.href = _spPageContextInfo.webAbsoluteUrl;
    var host = temp.hostname;

  
    for (var storeindex= 0; storeindex< storeAsjson.length; storeindex++) {

        var employee = storeAsjson[storeindex];
        
        var endpoint = _spPageContextInfo.webAbsoluteUrl
                       + '/_api/web/lists/getbytitle(\'TaskAssignmentTrl\')'
                       + '/items';
        // create the changeset
        batchContents.push('--changeset_' + changeSetId);
        batchContents.push('Content-Type: application/http');
        batchContents.push('Content-Transfer-Encoding: binary');
        batchContents.push('');
        batchContents.push('POST ' + endpoint + ' HTTP/1.1');
        batchContents.push('Content-Type: application/json;odata=verbose');
        batchContents.push('');
        batchContents.push(JSON.stringify(employee));
        batchContents.push('');
    }

    // END changeset to create data
    batchContents.push('--changeset_' + changeSetId + '--');

    // batch body
    var batchBody = batchContents.join('\r\n');
    batchContents = new  Array();

    // create batch for creating items
    batchContents.push('--batch_' + batchGuid);
    batchContents.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetId + '"');
    batchContents.push('Content-Length: ' + batchBody.length);
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push(batchBody);
    batchContents.push('');

    // create request in batch to get all items after all are created
    endpoint = _spPageContextInfo.webAbsoluteUrl
                  + '/_api/web/lists/getbytitle(\'TaskAssignmentTrl\')'
                  + '/items?$orderby=Title';

    batchContents.push('--batch_' + batchGuid);
    batchContents.push('Content-Type: application/http');
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push('GET ' + endpoint + ' HTTP/1.1');
    batchContents.push('Accept: application/json;odata=verbose');
    batchContents.push('');
    batchContents.push('--batch_' + batchGuid + '--');
    batchBody = batchContents.join('\r\n');

    // create the request endpoint 
    var endpoint = _spPageContextInfo.webAbsoluteUrl +  '/_api/$batch';
       var batchRequestHeader = {
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'Content-Type': 'multipart/mixed; boundary="batch_'  + batchGuid + '"'
    };

	
	 
    // create request
    jQuery.ajax({
        url: endpoint,
        type: 'POST',
        headers: batchRequestHeader,
        data: batchBody,
        success: function  (response) {
           console.log(response);       
        },
        fail: function  (error) {
        }
    });
} 

