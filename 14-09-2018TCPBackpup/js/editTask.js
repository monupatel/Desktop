 var app = angular.module("EditTasKApp", ['myservice','fupApp','commonApp','customefilterApp']);
 
 
	function loaderOpen() {
      $('.wrapper').append('<div class="loadLoader"></div>');
      $('.loadLoader').show();
    }
 
	function loaderClose() {   
	    $('.loadLoader').hide();
	    $('.loadLoader').remove();
	}

	app.controller("EditTasKCtrl",['$scope','customer','$http','commonCtrl',function($scope,customer,$http,commonCtrl) {
	   
	   //orderBy:'storeName':false:localeSensitiveComparator
	   /*$scope.localeSensitiveComparator = function(v1, v2) {
		    if (v1.type !== 'string' || v2.type !== 'string') {
		      return (v1.index < v2.index) ? -1 : 1;
           return v1.value.localeCompare(v2.value);
       };*/
	   $(document).ready(function(){

	   
	   $("#datepicker1").datepicker({
		    changeMonth: true, 
		    changeYear: true, 
		    dateFormat: 'mm-dd-yy',
		    showOn: "button",
		    buttonImage: "/sites/vsm/SiteApplication/Assets/images/calander-icon.png",
		    buttonImageOnly: true,

		    minDate: 0, // 0 days offset = today
		    //maxDate: 'today',
		    onSelect: function(dateText) {
		        $sD = new Date(dateText);
		        $("#datepicker2").datepicker('option', 'minDate', $sD);
		    }
		});
		
		$("#datepicker2").datepicker({
		    changeMonth: true, 
		    changeYear: true, 
		    dateFormat: 'mm-dd-yy',
		    showOn: "button",
		    buttonImage: "/sites/vsm/SiteApplication/Assets/images/calander-icon.png",
		    buttonImageOnly: true,
		    minDate: 0, // 0 days offset = today
		    //maxDate: 'today',
		    
		});

		
	   
	   });

	    $scope.taskId =localStorage.getItem("editTaskId");
	    //$scope.taskId = 233;
	     var preUrl=localStorage.getItem('previousUrl');
	    //$scope.NewStoreSelect = [];
	    		
	   function uuidv4() {
		    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		    return v.toString(16);
		  });
	   }
	   var editdata = "";
	   //$scope.userdata =JSON.parse(localStorage.getItem('UserInfo'));
	   //$scope.role = $scope.userdata.roleId.roleName;
	       // $scope.DistrictNameUser = $scope.userdata.districtId.name;
	        //$scope.RegionNameUser = $scope.userdata.regionId.name;
      $scope.draftVisible = false;
	   //$scope.role = $scope.userdata.roleId.roleName;
	   //$scope.roleId = $scope.userdata.roleId.ID;
	   //$scope.districtid = $scope.userdata.districtId.ID;
	   
	   
	   $scope.userdata =JSON.parse(localStorage.getItem('UserinfoData'));
	   $scope.role = $scope.userdata.role;
	   $scope.roleId = $scope.userdata.roleId.ID;
	   $scope.DistrictNameUser = $scope.userdata.districtName;
	        $scope.RegionNameUser = $scope.userdata.regionName;
	        
	         $scope.DistrictIDUser = $scope.userdata.districtId;
	        $scope.RegionIDUser = $scope.userdata.regionId;
	        $scope.profileImage = localStorage.getItem('ProfileImage');


	   
	    var userid = _spPageContextInfo.userId;
		$scope.Uname = _spPageContextInfo.userDisplayName;

	   /*******************Draft Coding*****************/
	   $scope.hideDraftCheck = false;
	   $scope.ArchiveVisible = false;
	   loadDraft();
	   
	   $scope.CommanDraftcount = 3;
	  	    $scope.orderByFieldDrfatComman = 'ID';
		    $scope.reverseDrfatComman = true;
		 
			 $scope.DraftExpand = function(){
			 window.location="/sites/vsm/SiteApplication/TaskManagement/Draft.aspx";
			 /*if($scope.CommanDraftcount > 3)
			 $scope.CommanDraftcount = 3;
			 else
			 $scope.CommanDraftcount = 500;*/
			 }
	   
	   $scope.CheckDraft = function(){
	   loadDraft();
	   if($scope.DraftData != undefined && $scope.DraftData != null)
		   {
		   		if($scope.DraftData.length > 0)
			   	{
					   	$.fancybox({
		                content: $('#createNewtask').show(),
		                   padding:0
		            });
			   	}
			   	else
			   	{
			   		var pth =window.location.pathname;
                localStorage.setItem("previousUrl",pth);

			   		window.location = "/sites/vsm/SiteApplication/AddTask/AddTask.aspx";
			   	}
		   }
		   else
		   {
		   	var pth =window.location.pathname;
                localStorage.setItem("previousUrl",pth);

		   	 window.location = "/sites/vsm/SiteApplication/AddTask/AddTask.aspx";
		   }

	   }
	   
	   function loadDraft(){
	     var querydraft = "";
					if($scope.role == "Corporate Employee")
					{
						querydraft = _spPageContextInfo.webAbsoluteUrl+"/_api/Web/Lists/GetByTitle('TaskHdr')/Items?$select=*,Author/Id,Author/Title,status/ID,status/name&$expand=status,Author&$filter=(Author/Id eq '"+userid +"') and (status/name eq 'Draft') and (deleteFlag eq 'No')&$orderby=ID desc";
						$scope.DraftData = commonCtrl.getDraftData(querydraft);
					}
					else
					{
						querydraft = _spPageContextInfo.webAbsoluteUrl+"/_api/Web/Lists/GetByTitle('TaskHdr')/Items?$select=ID,taskName,taskLiveDate,taskStartDate,taskEndDate,status/name,status/ID,Author/ID,statusPercentage&$expand=status,Author&$filter=substringof('"+$scope.DistrictIDUser+"',districtId) and (status/ID eq '1') and (roleId/ID eq '3') and (deleteFlag eq 'No')&$orderby=ID desc"
						$scope.DraftData = commonCtrl.getDraftData(querydraft);
					}

	   	
	   		if($scope.DraftData != undefined && $scope.DraftData != null)
		   {
		   	if($scope.DraftData.length > 0)
		   	{
		   	$scope.hideDraftCheck = true;
		   	}
	   	}

	   	console.log($scope.DraftData );
	   }
	   
	   
	   
	   $scope.Logout = function(){
	   
	   	localStorage.setItem("UserinfoData",null)
	   	window.location = "https://cplace.sharepoint.com/sites/vsm/_layouts/closeConnection.aspx?loginasanotheruser=true";
	   }
	   
	   if($scope.role == "Regional Manager" || $scope.role == "Corporate VP Visual" || $scope.role == "Corporate VP Operational" || $scope.role == "Store Associate")
		        {
		        $scope.roleVisible = {'display': 'none'};
			    }

	   var queryhdr = "/_api/web/lists/getByTitle('TaskHdr')/items?$select=*,ID,taskName,taskStartDate,taskEndDate,season/name,roleId/ID,roleId/roleName,status/name,Author/ID&$expand=season,roleId,Author,status&$filter=(deleteFlag eq 'No') and (status/name eq 'Archived')";
	             
	             if($scope.role == "District Manager")
		            queryhdr = queryhdr + " and substringof('"+$scope.userdata.districtId+"',districtId)&$orderby=ID desc&$top=1000";
                 else if($scope.role == "Regional Manager")
                    queryhdr = queryhdr + " and substringof('"+$scope.userdata.regionId+"',regionId)&$orderby=ID desc&$top=1000";
                 else
		            queryhdr =queryhdr+" &$orderby=ID desc&$top=1000" ;
		
		          $.ajax({
           		    url :_spPageContextInfo.webAbsoluteUrl+queryhdr ,
		            method: 'GET',
		            async: false,
		              headers:    
		              {    
		                 'accept': 'application/json;odata=verbose'    
		              },
		              success: function(response) {	
		                  $scope.Archived =response.d.results;	
		                  if($scope.Archived.length > 0)
		                  {
		                  $scope.ArchiveVisible = true;
		                  }	                 
		                  
		            }
		         });

	   
	   
	   $scope.confirmDelete = function(a)
	   {
	   	$scope.draftId = a;
	   }
	   
	   $scope.deleteDraft = function(){
	   
	      if($scope.draftId != "" || $scope.draftId != undefined)
	       {
	       //alert($scope.draftId);
	             $.ajax({
							     url:_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/getByTitle('TaskHdr')/items('"+$scope.draftId+"')",
							     type:"DELETE",
							     //data:dvalue,
							     headers:{ "accept": "application/json;odata=verbose",
							                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
							                    "content-Type": "application/json;odata=verbose",
							                    "X-Http-Method": "DELETE",
							                    "If-Match": "*"
		                                  },		     
							    success:function(data){
							        			$.fancybox.close();
								             
								             $("#alertPopup h6").html("Task "+$scope.draftId+" has been successfully delete");
						
						                    $.fancybox({
								                content: $('#alertPopup').show(),
								                   padding:0
								            });
	
							        			location.reload();		        
							    }});
			}
	   }
	   
	   
	   $scope.deleteTaskAlert = function(){
            
			            $.fancybox({
		                content: $('#ConfimPopup').show(),
		                   padding:0
		            });
            }
            
            
            $scope.deleteTask=function()
            {
              //var answer = confirm('Are You Sure'); 
	            // if(answer)  
	             //{
	             if($scope.statusOld == 3)
	             {                                     
		             var ur=_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskHdr')/items('"+$scope.taskId+"')";
		             var dvalue = {__metadata:{'type':'SP.Data.TaskHdrListItem'},deleteFlag:"Yes"};
		             commonCtrl.deleteByFlag(ur,dvalue);
		             var logurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskLogTrl')/items";

		             if($scope.userdata.role == "Corporate VP Visual")
		                      		{
		                      			var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:1,responsibleUserId:$scope.CreaterId,logDescription:"Task is Delete"};
										commonCtrl.tasklog(logurl,dvalue1);
										var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:7,logDescription:"Task is Delete"};
										commonCtrl.tasklog(logurl,dvalue1);
										
										 for(var i=0;i<$scope.DistrictArrId.length-1;i++)
                                          {
                                  	         var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,districtId:parseInt($scope.DistrictArrId[i]),roleIdId:3,logDescription:"Task is Delete"};
                                             commonCtrl.tasklog(logurl,dvalue1);                                  
                                          }
										
										 for(var j=0;j<$scope.ReginoalArrId.length-1;j++)
		                                  {
		                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,regionId:parseInt($scope.ReginoalArrId[j]),roleIdId:5,logDescription:"Task is Delete"};
		                                    commonCtrl.tasklog(logurl,dvalue1);
		                                  }
		                                  
		                                  for(var k=0;k<$scope.storeidlistOld.length;k++)
		                                  {
		                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,storeIdId:parseInt($scope.storeidlistOld[k].ID),roleIdId:6,logDescription:"Task is Delete",storeNumberId:parseInt($scope.storeidlistOld[k].storeId.ID)};
		                                    commonCtrl.tasklog(logurl,dvalue1);
		                                  }
								
										
			                      		}
			                      		else if($scope.userdata.role == "Regional Manager")
			                      		{
			                      			var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:2,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);
											var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:7,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);
											
											for(var i=0;i<$scope.DistrictArrId.length-1;i++)
                                          {
                                  	         var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,districtId:parseInt($scope.DistrictArrId[i]),roleIdId:3,logDescription:"Task is Delete"};
                                             commonCtrl.tasklog(logurl,dvalue1);                                  
                                          }
	
			                      			
			                      			/*var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskid),logType:"Update",logStatusId:11,roleIdId:5,regionId:$scope.userdata.regionId.ID,logDescription:"Task is Delete"};										//console.log(mdta1);					      	                                     
											commonCtrl.tasklog(logurl,dvalue1);	*/
			                      				
			                      			/*for(var j=0;j<$scope.ReginoalArrId.length-1;j++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskid),logType:"Update",logStatusId:$scope.statusid,regionId:parseInt($scope.ReginoalArrId[j]),roleIdId:5,logDescription:"Task is Open"};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }*/
			                                  
			                                  for(var k=0;k<$scope.storeidlistOld.length;k++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,storeIdId:parseInt($scope.storeidlistOld[k].ID),roleIdId:6,logDescription:"Task is Delete",storeNumberId:parseInt($scope.storeidlistOld[k].storeId.ID)};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }
			                      		}
			                      		else if($scope.userdata.role == "Corporate Employee")
										{
									    	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:2,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);
											var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:7,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);
											
											for(var i=0;i<$scope.DistrictArrId.length-1;i++)
                                          {
                                  	         var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,districtId:parseInt($scope.DistrictArrId[i]),roleIdId:3,logDescription:"Task is Delete"};
                                             commonCtrl.tasklog(logurl,dvalue1);                                  
                                          }
	
			                      			
			                      			/*var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskid),logType:"Update",logStatusId:11,roleIdId:5,regionId:$scope.userdata.regionId.ID,logDescription:"Task is Delete"};										//console.log(mdta1);					      	                                     
											commonCtrl.tasklog(logurl,dvalue1);	*/
			                      				
			                      			for(var j=0;j<$scope.ReginoalArrId.length-1;j++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,regionId:parseInt($scope.ReginoalArrId[j]),roleIdId:5,logDescription:"Task is Delete"};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }
			                                  
			                                  for(var k=0;k<$scope.storeidlistOld.length;k++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,storeIdId:parseInt($scope.storeidlistOld[k].ID),roleIdId:6,logDescription:"Task is Delete",storeNumberId:parseInt($scope.storeidlistOld[k].storeId.ID)};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }		
										}
										else
										{
											var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:2,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);
											var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,roleIdId:7,logDescription:"Task is Delete"};
											commonCtrl.tasklog(logurl,dvalue1);	
											for(var j=0;j<$scope.ReginoalArrId.length-1;j++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,regionId:parseInt($scope.ReginoalArrId[j]),roleIdId:5,logDescription:"Task is Delete"};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }
			                                  
			                                  for(var k=0;k<$scope.storeidlistOld.length;k++)
			                                  {
			                                  	var dvalue1 = {__metadata:{'type':'SP.Data.TaskLogTrlListItem'},taskIdId:parseInt($scope.taskId),logType:"Update",logStatusId:11,storeIdId:parseInt($scope.storeidlistOld[k].ID),roleIdId:6,logDescription:"Task is Delete",storeNumberId:parseInt($scope.storeidlistOld[k].storeId.ID)};
			                                    commonCtrl.tasklog(logurl,dvalue1);
			                                  }	
																									
							  			}
							  	}
							  	
						else
						{
									             
		             $.ajax({
							     url:_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/getByTitle('TaskHdr')/items('"+$scope.taskId+"')",
							     type:"DELETE",
							     //data:dvalue,
							     headers:{ "accept": "application/json;odata=verbose",
							                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
							                    "content-Type": "application/json;odata=verbose",
							                    "X-Http-Method": "DELETE",
							                    "If-Match": "*"
		                                  },		     
							    success:function(data){
							        				        
							    }});
		             	 
							
						}		
		             $.fancybox.close();
		             
		             $("#alertPopup h6").html("Task has been deleted");

                    $.fancybox({
		                content: $('#alertPopup').show(),
		                   padding:0
		            });
		            
		             window.location=preUrl;

		            
		             //alert("Task has been deleted");
		             
		            
		             
		         //} 
            }
	   $scope.setDeleteClass = function(bool){
				    if(bool)
				      return 'del-but ShowHover';
				      else
				      return 'del-but-grayout ShowHover';

	       }   
	   
	   var pth =window.location.pathname;
		$scope.SearchById = function(){
		      var sid =$scope.searchId;
		      
		      var searchData ={};
		      searchData.searchId = sid;
		      searchData.previousUrl=pth;
		      localStorage.setItem("SearchLocalData",JSON.stringify(searchData));
		      window.location ="/sites/vsm/SiteApplication/Search/Search.aspx";
        }
		
		 $scope.taskEdit = function(a){
        
        	var pth =window.location.pathname;
                  localStorage.setItem("previousUrl",pth);
		         localStorage.setItem("edittadkid",a);
        	window.location ="/sites/vsm/SiteApplication/AddTask/EditTask.aspx";
        }
		
		$scope.HomeRedirect=function()
		       {
		         window.location="/sites/vsm/SiteApplication/Dashboard/DashBoard.aspx";
		       }

               $scope.TaskManagementRedirect=function()
		       {
		         window.location="/sites/vsm/SiteApplication/TaskManagement/TaskManagement.aspx";
		       }

		var preUrl=localStorage.getItem('previousUrl');
	         $scope.back = function(){
          	window.location = preUrl;
          	}

	   
	   /*******************Draft Coding End*****************/

	   
	   
	   		$scope.year = new Date().format("yyyy");

	     $scope.FilterSelectorNot = false;
				 // $scope.allchk=[];
				 
         customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskHdr')/items?$select=*,Author/ID,Author/Title,season/name,season/ID,roleId/ID,roleId/roleName&$expand=season,Author,roleId&$filter=(ID eq '"+$scope.taskId+"')")
	            .then(function (response) {
	                console.log(response.data.d.results);
	                $scope.edittaskdata = response.data.d.results[0];
	                $scope.TaskID =$scope.edittaskdata.ID;
	                $scope.TASK_NAME =$scope.edittaskdata.taskName;
	                $scope.TASK_LIVE_DATE=moment($scope.edittaskdata.taskLiveDate).format("MM/DD/YYYY");
	                $scope.TASK_END_DATE = moment($scope.edittaskdata.taskEndDate).format("MM/DD/YYYY");
	                $scope.TASK_DESCRIPTION=$scope.edittaskdata.taskDescription;
	                $scope.season =$scope.edittaskdata.season.ID;
	                $scope.seasonName =$scope.edittaskdata.season.name;
	                $("#uniform-season span").text($scope.seasonName);
					
					$scope.DistrictIdString = $scope.edittaskdata.districtId;
		             $scope.ReginoalIdString =  $scope.edittaskdata.regionId;
		             $scope.CreaterId = $scope.edittaskdata.Author.ID;
		             $scope.DistrictArrId = $scope.DistrictIdString.split(',');
		             $scope.ReginoalArrId = $scope.ReginoalIdString.split(',');
		             
		             if($scope.edittaskdata.roleId.ID == "3")
		             {
		             	customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('DistrictMst')/items?$select=*&$filter=ID eq '"+$scope.DistrictArrId[0]+"'")
		                  .then(function (response) {
							$scope.DMNameForRm = response.data.d.results[0].name;
							
							console.log($scope.StatusData);
				                     }, function (error) {
					                $scope.statuserror = 'Unable to load customer data: ' + error.message;
					       });

		             }

	                
	                console.log($scope.season);
	                $scope.statusOld = $scope.edittaskdata.statusId;
	                if($scope.statusOld == 1)
	                {
	                $scope.draftVisible = true;
	                }
	                $scope.CreaterId = $scope.edittaskdata.Author.ID;
	                $scope.CreaterName = $scope.edittaskdata.Author.Title;
	                console.log($scope.CreaterName);
	                
                    editdata= $scope.edittaskdata.filterValues;                   
                    
                     $scope.allchk=JSON.parse(editdata);
                     $scope.disabledChecked =JSON.parse(editdata);
                     //alert($scope.edittaskdata.statusId);
                     customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskStatusWF')/items?$select=*,currentStatus/name,currentStatus/Id,nextStatus/name,nextStatus/Id&$expand=currentStatus,nextStatus&$filter=currentStatus eq '"+$scope.edittaskdata.statusId+"' and statusType eq 'task'")
	                  .then(function (response) {
						$scope.StatusData = response.data.d.results;
						
						console.log($scope.StatusData);
			                     }, function (error) {
				                $scope.statuserror = 'Unable to load customer data: ' + error.message;
				       });

	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });

     customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskMediaTrl')/items?$select=*,taskId/ID,medType/name,FieldValuesAsText/FileRef,File/Name&$expand=taskId,medType,FieldValuesAsText,File&$filter=(taskIdId eq '"+$scope.taskId+"')")
	            .then(function (response) {
	                console.log(response.data.d.results);
	                $scope.mediadata = response.data.d.results;
	                console.log("Attch");

	                console.log($scope.mediadata);
	                
	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });
	       
	     /*customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskStatusWF')/items?$select=*,currentStatus/name,currentStatus/Id,nextStatus/name,nextStatus/Id&$expand=currentStatus,nextStatus&$filter=currentStatus eq null and statusType eq 'store'")
	            .then(function (response) {
	                //console.log(response.data.d.results);
	                $scope.storstatus = response.data.d.results[0].nextStatus.Id;
	            }, function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	       }); */
	       
		 customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('TaskAssignmentTrl')/Items?$select=*,storeId/districtId,storeId/regionId,storeId/storeNumber,storeId/storeName,storeId/ID,taskId/ID,taskId/taskName,taskId/taskStartDate,taskId/taskEndDate,taskId/districtId,taskId/regionId,taskId/taskEndDate,taskId/taskLiveDate,status/name,status/ID&$expand=storeId,taskId,status&$filter=(taskId/Id eq '"+$scope.taskId+"') and (deleteFlag eq 'No') &$orderby=ID&$top=5000")
	            .then(function (response) {
	                //console.log("StoreList"+response.data.d.results);
	                $scope.storeidlistOld = response.data.d.results;
	                //var old = response.data.d.results;
	                //$scope.NewStoreSelect = old;
	                console.log("OK");
	                console.log($scope.storeidlistOld);
	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });   


	    $scope.filterdataget=function()
		{
		  loaderOpen();
			var query = "";
			//console.log($scope.userdata.roleId.roleName);
			if($scope.role == "District Manager" || $scope.role == "Regional Manager")
			{
				query = "/_api/Web/Lists/GetByTitle('FilterMappingMst')/Items?$select=filterName,tableName,columnName,filterType,roleId/roleName&$expand=roleId&$filter=(roleId/roleName eq 'District Manager') and (deleteFlag eq 'No') and (viewPermission eq 'Yes') and (filterAppFlag eq 'Yes') and (filterType eq 'Store')";
			}
			else
			{
				query = "/_api/web/lists/getByTitle('FilterMappingMst')/items?select=filterName,tableName,columnName,filterType&$filter=filterAppFlag eq 'Yes' and filterType eq 'Store'";
			}
		
	       customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + query)
	            .then(function (response) {
	                loaderClose();
	                $scope.test = response.data.d.results;
	            }, function (error) {
	                loaderClose();
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });	
	     } 
	      customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('SeasonMst')/items")
	            .then(function (response) {
	                $scope.Seasondata = response.data.d.results;
	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });
	        
	        customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('TaskStatusWF')/items?$select=*,currentStatus/name,currentStatus/Id,nextStatus/name,nextStatus/Id&$expand=currentStatus,nextStatus&$filter=currentStatus eq null and statusType eq 'store'")
	            .then(function (response) {
	                //console.log(response.data.d.results);
	                $scope.storstatus = response.data.d.results[0].nextStatus.Id;
	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });
	       
          $scope.getfilterdata = function(a){         
                    loaderOpen();
                      $scope.chkval='';             
                $scope.filterval=a.f.filterName;
                var query = "";
                if($scope.role == "District Manager" && a.f.tableName == "StoreMst")
				  query = "/_api/web/lists/getByTitle('"+a.f.tableName+"')/items?$filter=districtId eq '"+$scope.DistrictNameUser+"'&$top=5000";
				  else if($scope.role == "Regional Manager" && a.f.tableName == "StoreMst")
					query = "/_api/web/lists/getByTitle('"+a.f.tableName+"')/items?$filter=districtId eq '"+$scope.DMNameForRm+"'&$top=5000";
				else
				  query = "/_api/web/lists/getByTitle('"+a.f.tableName+"')/items?$top=5000";
			                
		          customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + query)
		            .then(function (response) {
		                loaderClose();
		                $scope.chkval = response.data.d.results;		                
		               // console.log($scope.chkval);
		            }, function (error) {
		                loaderClose();
		                $scope.statuserror = 'Unable to load customer data: ' + error.message;
		          });		        
          }
				
           customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('MediaTypeMst')/items?$select=ID,name&$filter=name eq 'task'")
	            .then(function (response) {
	                $scope.mediatype = response.data.d.results[0].ID;
	            }, function (error) {
	                $scope.statuserror = 'Unable to load customer data: ' + error.message;
	       });
			

			//alert($scope.userdata.roleId.roleName == "District Manager"? $scope.userdata.rmUserAdId.ID:$scope.userdata.vpUserAdId.ID);
	
		// Save Code		
				$scope.saveDraft = function(){
				 loaderOpen();
				$scope.isDisabled = true;
				  $scope.SaveTask(1);
				   if(!$scope.savereturnVal)
				     $scope.isDisabled = false;
				     loaderClose();		
				}	
				
				$scope.sendForApproval = function(){
				  loaderOpen();
				$scope.isDisabled = true;
				  $scope.SaveTask(2);
				  if(!$scope.savereturnVal)
				     $scope.isDisabled = false;	
				  loaderClose();
				}
				/*if($scope.userdata.roleId.roleName == "District Manager")
				{
					$scope.ApprovalId = $scope.userdata.rmUserAdId.ID;
				}
				else
				{
					$scope.ApprovalId = $scope.userdata.vpUserAdId.ID;
				}*/
			
				 $scope.listName ="TaskHdr";
				$scope.districtid = "";
				$scope.regionid = "";
				$scope.savereturnVal = null;
					           
	           $scope.SaveTask=function(sid){
	           	var checkerror = false;	
					var error = "";
			           if($scope.TASK_NAME == undefined || $scope.TASK_NAME == null || $scope.TASK_NAME == "")
			           {
			           //	alert("Please enter Task Name");
			           	error = error + "Please enter Task Name<br/>";
			           	checkerror = true;

			           	
			           	//return false;
			           }
			           if($('#season option:selected').text() == "Please Select Season"|| $('#season option:selected').text() == null || $('#season option:selected').text() == undefined)
			           {
			           	//alert("Please select Season");
			           	error = error + "Please select Season<br/>";
			           	checkerror = true;

			           //	return false;
			           }
			           		
			           if($("#datepicker1").val() == undefined || $("#datepicker1").val() == null || $("#datepicker1").val() == "")
			           {
			           	//alert("Please enter Live Date");
			           	error = error + "Please enter Live Date<br/>";
			           	checkerror = true;
			           	
			           //	return false;
			           }
			           if($("#datepicker2").val() == undefined || $("#datepicker2").val() == null || $("#datepicker2").val() == "")
			           {
			           	//alert("Please enter Close Date");
			           	error = error + "Please enter Close Date<br/>";
			           	checkerror = true;

			           	//return false;
			           }
			           
			           /*if($('#status option:selected').text() == "Please Select Season"|| $('#status option:selected').text() == null || $('#status option:selected').text() == undefined)
			           {
			           	alert("Please select Season");
			           	
			           	return false;
			           }*/
						
			           if(sid == 2)
			           {
			           	 if($scope.FilterSelectorNot)
			           	 {
				           	if($scope.storeidlist.length == 0 && $scope.storeidlistOld.length == 0)
				           	{
				           		//alert("Please specify the filter criteria");
				           		error = error + "Please specify the filter criteria<br/>";
			           	        checkerror = true;

				           		//return false;
				           	}
				          }
				          else
				          {
				          	if($scope.storeidlistOld.length == 0)
				           	{
				           		//alert("Please specify the filter criteria");
				           		error = error + "Please specify the filter criteria<br/>";
			           	       checkerror = true;

				           		//return false;
				           	}

				          }
			           }
			           
			           if(checkerror)
			           {
			            $("#alertPopup h6").html(error);
			            $.fancybox({
					        content: $('#alertPopup').show(),
					        padding:0,
					        closeBtn:false,
					        helpers:{ 
					           overlay : {
					               closeClick: false
					           }
					        }
					    });
					     loaderClose();

					    
			            return false;

			           }

			          			           //var 
			           
			             	           
                      var bool = false;
                      var Assignment = true;
	               var currentcolumn="";
	               
	               //if(editdata === JSON.stringify($scope.allchk))
	               //{
	               	// Assignment = false;
	               //}
	               if($scope.FilterSelectorNot)
	               {
	               if($scope.statusOld == 1 || $scope.statusOld == 2 || $scope.statusOld == 4){
	                   var j=0;		
					   var arr=[];								   
						  for(var i=0;i<$scope.storeidlistOld.length;i++)
						  {	                           
							var mdata =$scope.storeidlistOld[i].ID;
						      j++;
							  arr.push(mdata);
							  if(j==100)
							  {	
							    j=0;
							    deleteDriversBatchRequest(arr);
							    arr.length=0;
						      }
							  else if((i+1)==($scope.storeidlistOld.length))
							  {
							   deleteDriversBatchRequest(arr);
							   arr.length=0;
							   // alert("Saved Assignment...");
							  }           
								              	              	               
						   }	
				     }
				     }
				     $scope.DistingStore = "";
				     if($scope.NewStoreSelect != undefined || $scope.NewStoreSelect != null)	
				     {
				     	$scope.DistingStore = $scope.NewStoreSelect;
				     }
				     else {
					     if($scope.storeidlist != undefined || $scope.storeidlist != null)
					     {
					     $scope.DistingStore = $scope.storeidlist;
					     }
					     else
					     {
					     $scope.DistingStore = $scope.storeidlistOld;
					     Assignment = false;
					     }


				     }                  	
	                 $scope.CheckArr = "";
					 if($scope.FilterSelectorNot)
					 {
					 	$scope.CheckArr = $scope.allcheckd;
					 }	
	                  else
	                  {
	                  	$scope.CheckArr = $scope.allchk;
	                  }	
	              	
	                  	var statusOldId = "";
						if($scope.statusOld == 3)
						{
							statusOldId = 3;
						}	
						else if($scope.statusOld == 4)
						{
							statusOldId = 2;
						}
						else
						{
						    statusOldId = sid;
						}	
	                  	
	               
	               var filterstring="";
	               var mydata = "";
	               if(statusOldId == 1 || statusOldId == 2)
	               {
	                  
	                			  var mydata =	{ __metadata: { 'type': 'SP.Data.TaskHdrListItem' },
					           	    taskName: $scope.TASK_NAME,
							       taskLiveDate:moment($("#datepicker1").val(),'MM/DD/YYYY').format("MM/DD/YYYY"),
							       taskStartDate:moment(new Date()).format("MM/DD/YYYY"),
							       taskEndDate:moment($("#datepicker2").val(),'MM/DD/YYYY').format("MM/DD/YYYY"),
							       taskDescription:$scope.TASK_DESCRIPTION,
							       statusId: statusOldId,
							       seasonId: $scope.seasonId,
							       filterValues:JSON.stringify($scope.CheckArr),
							       year:$scope.year,
							       districtId:$scope.disId,
							       regionId:$scope.regId,
							       						           		    
                                       };
                        }
                        else
                        {
                        	  var mydata =	{ __metadata: { 'type': 'SP.Data.TaskHdrListItem' },
					           	    taskName: $scope.TASK_NAME,
							       taskLiveDate:moment($("#datepicker1").val(),'MM/DD/YYYY').format("MM/DD/YYYY"),
							       taskEndDate:moment($("#datepicker2").val(),'MM/DD/YYYY').format("MM/DD/YYYY"),
							       taskDescription:$scope.TASK_DESCRIPTION,
							       statusId: statusOldId,
							       seasonId: $scope.seasonId,
							       filterValues:JSON.stringify($scope.CheckArr),
							       year:$scope.year,
							       districtId:$scope.disId,
							       regionId:$scope.regId,
							       						           		    
                                       };

                        
                        }
                                       
                         // alert(Assignment); 
                          //console.log(editdata);
                          //console.log(JSON.stringify($scope.allchk));            
     					if($scope.userdata.roleId == 1 || $scope.userdata.roleId == 2)
     					{
     						$scope.savereturnVal = editAddTask($scope.taskId,$scope.listName,mydata,$scope.DistingStore,$scope.imagesrc,$scope.storstatus,statusOldId,$scope.mediatype,$scope.userdata.roleId,$scope.CreaterId,preUrl,$scope.statusOld,Assignment);
     					}
     					
     					else
     					{
     						$scope.savereturnVal = editAddTask($scope.taskId,$scope.listName,mydata,$scope.DistingStore,$scope.imagesrc,$scope.storstatus,statusOldId,$scope.mediatype,$scope.userdata.roleId,$scope.CreaterId,preUrl,$scope.statusOld,Assignment,$scope.userdata.districtId,$scope.userdata.regionId);
     					}
	                        
	                        //alert("Data Saved Successfully");
				         // window.location = "/SiteApplication/PixaCore/Pixa/TaskManagement.aspx";
                         
	                }		
	                
			      /*$scope.allchk=[];
		          $scope.chkclick=function(a,b,c,d,e,f){
				       commonCtrl.getcheckeddata(a,b,c,d,e,f,function(r){
				         $scope.allchk=r;
				       }); 
				      
				       $scope.chechtest = JSON.stringify($scope.allchk);
				       console.log(JSON.parse($scope.allchk));

			      }

	 			  $scope.chekchecked = function(a,b)
				  {		  
				     return  commonCtrl.returnbool(a,b,$scope.allchk);
				  }*/
				  
				  //new with all	
				  $scope.AllCheckedValues =[];			          	            
	              $scope.chkclick=function(a,b,c,d,e,f){
	              		              	
	           	     commonCtrl.getcheckeddata(a,b,c,d,e,f,$scope.allchk,$scope.chkval,function(r){
				         $scope.allchk=r;
				         $scope.AllCheckedValues=r;
				       }); 
	              }
	              
	               $scope.isfilterdisplay=function()
	              {
	                 var fbool=false;
	                if($scope.AllCheckedValues.length >0 )
	                  fbool=true;
	                else
	                  fbool=false;
	                return fbool;
	              }

	               // $scope.all=null;
	 			  $scope.chekchecked = function(a,b)
				  {
				     var bool =false;
				     var bb = "";
				     if($scope.edittaskdata.statusId =='3')
				     {
				         bb =commonCtrl.returnbool(a,b,$scope.disabledChecked);
					      if(!bb);
	                     {
					       bool = commonCtrl.returnbool(a,b,$scope.allchk);
					     }
				    }
				    else
				    {
				    	bb = commonCtrl.returnbool(a,b,$scope.allchk);

				    }				    
				     if(bb)
				     {				     
				      bool = true;
				     }
				     return bool;
				  }
			  $scope.storeidlist=[];
	           $scope.GetStoreData = function(){
	                  loaderOpen();    
                   var spurl =_spPageContextInfo.webAbsoluteUrl;
	                var chkcolumnname="";
	                 var notequalto = ""; 
	                 var equalto = "";    
	                  var finalurl = ""; 
	                 var url ="/_api/web/lists/getByTitle('StoreMst')/items?select=*&$filter="; 
	                    $scope.allcheckd =$scope.allchk;
		                   $scope.allcheckd.sort(function(a, b){
							      if(a.columnname< b.columnname) return -1;
							      if(a.columnname> b.columnname) return 1;
							      return 0;
							    }); 
							    
							    
							    var indid =-1;
				              $scope.allcheckd.some(function(obj, i) {
									  return obj.isAll === true && obj.unchkvalue.length==0? indid = i : false;
									});			    
							    //alert(indid);
					 if($scope.allcheckd.length == 0)
					 {
					 	
			            $("#alertPopup h6").html("Please specify the filter criteria");
			            $.fancybox({
					        content: $('#alertPopup').show(),
					        padding:0,
					        closeBtn:false,
					        helpers:{ 
					           overlay : {
					               closeClick: false
					           }
					        }
					        });
					   
					   //alert("Please specify the filter criteria");
					   return false;
					   
					 }
					 else
					 {
					     
					   if(indid>(-1))
					   {
					   	  if($scope.role == "District Manager")
                           	{

					   	       finalurl ="/_api/web/lists/getByTitle('StoreMst')/items??select=*&$filter=(districtId eq '"+$scope.DistrictNameUser+"')"+"&$top=50000";
					   	    }
					   	    else if($scope.role == "Regional Manager")
			                {
			                   finalurl ="/_api/web/lists/getByTitle('StoreMst')/items??select=*&$filter=(districtId eq '"+$scope.DMNameForRm+"')"+"&$top=50000";
							}

					   	    else
					   	    {
					   	    	finalurl ="/_api/web/lists/getByTitle('StoreMst')/items?$top=50000";

					   	    }
					   }
					   else
					   {
						    for(var i=0;i<$scope.allcheckd.length;i++)
			                {
			                  if($scope.allcheckd[i].unchkvalue.length>0 &&$scope.allcheckd[i].isAll)
			                  {
			                   for(var j=0;j<$scope.allcheckd[i].unchkvalue.length;j++)
			                   {
			                   		notequalto = notequalto +"("+$scope.allcheckd[i].columnname+ " ne '"+$scope.allcheckd[i].unchkvalue[j]+"') and";	                     
			                   }
			                  }
			                  else
			                  {
			                   for(var j=0;j<$scope.allcheckd[i].chkvalue.length;j++)
			                   {			                   	
			                   	    equalto = equalto +"("+$scope.allcheckd[i].columnname+ " eq '"+$scope.allcheckd[i].chkvalue[j]+"') or";
			                   }
			                  }			                   
			                }
			                var pos = notequalto.lastIndexOf(')');
                             notequalto= notequalto.substring(0 , pos+1);
                            pos=null;
                             pos = equalto.lastIndexOf(')');
                            equalto= equalto.substring(0 , pos+1);

			                if(equalto!=""&&notequalto=="")
			                {
			                	if($scope.role == "District Manager")
                           		{

				                   finalurl = url+"(districtId eq '"+$scope.DistrictNameUser+"') and ("+ equalto+")&$top=50000";
				                }
				                else if($scope.role == "Regional Manager")
			                    {
			                      finalurl = url+"(districtId eq '"+$scope.DMNameForRm+"') and ("+ equalto+")&$top=50000";
			                    }

				                else
				                {
				                	finalurl = url+ equalto+"&$top=50000";

				                }
			                 }
			                else if(equalto==""&&notequalto!="")
			                {
			                	if($scope.role == "District Manager")
                           		{

			                       finalurl = url+"(districtId eq '"+$scope.DistrictNameUser+"') and ("+ notequalto +")&$top=50000";
			                    }
			                     else if($scope.role == "Regional Manager")
			                    {
			                      finalurl = url+"(districtId eq '"+$scope.DMNameForRm+"') and ("+ notequalto +")&$top=50000";
			                    }

			                    else
			                    {
			                    	finalurl = url+ notequalto +"&$top=50000";

			                    }
			                 }
			                else
			                {
			                	if($scope.role == "District Manager")
                           		{
                                  finalurl = url+"(districtId eq '"+$scope.DistrictName+"') and ("+ equalto+")and ("+notequalto+")&$top=50000";			                       
			                    }
			                     else if($scope.role == "Regional Manager")
			                    {
			                      finalurl = url+"(districtId eq '"+$scope.DMNameForRm+"') and ("+ equalto+")and ("+notequalto+")&$top=50000";
			                    }

			                    else
			                    {
			                       finalurl = url+"("+ equalto+")and ("+notequalto+")&$top=50000";
			                    }
			                }			                    
			            } 		                 
                     }
                      
                       
                   //console.log(finalurl);
                   finalurl = spurl+finalurl;
                      customer.getCustomers(finalurl).then(function (response) {
                      	
                      	loaderClose();
		                $scope.storeidlist = response.data.d.results;
		                
		                
						//console.log(disId);	
						//console.log(regId);					
						
		               // console.log($scope.storeidlist);
		               // loading.out();
		               		
		                 if($scope.storeidlist.length == 0)
				          {
				          	
				           //alert("Please specify the filter criteria");
				            $("#alertPopup h6").html("Please specify the filter criteria");
			            $.fancybox({
					        content: $('#alertPopup').show(),
					        padding:0,
					        closeBtn:false,
					        helpers:{ 
					           overlay : {
					               closeClick: false
					           }
					        }
					        });

				           return false;
				          } 
				          else
				          {
							     $scope.FilterSelectorNot = true;
							     if($scope.statusOld == 3)
					              {
						           $scope.NewStoreSelect = [];
						                
						            for(var i=0;i<$scope.storeidlist.length;i++)
						              {
						                	var insertChk = 0;
						                	for(var j=0;j<$scope.storeidlistOld.length;j++)
						                	{	
						                		
						                		if($scope.storeidlist[i].storeNumber == $scope.storeidlistOld[j].storeId.storeNumber)
						                		{
						                			insertChk = 1;
						                		}
						                		
						                	}
						                	if(insertChk == 0)
						                		{
						                			$scope.NewStoreSelect.push($scope.storeidlist[i]);
						                		}
						                		
						                		
						                		
						                }
						                
						                
						                /*for(var i=0;i<$scope.storeidlist.length;i++)
						              {
						                	var insertChk = 0;
						                	for(var j=0;j<$scope.storeidlistOld.length;j++)
						                	{	
						                		
						                		if($scope.storeidlist[i].storeNumber == $scope.storeidlistOld[j].storeId.storeNumber)
						                		{
						                			insertChk = 1;
						                		}
						                		
						                	}
						                	if(insertChk == 0)
						                		{
						                			$scope.NewStoreSelect.push($scope.storeidlist[i]);
						                		}
						                }*/
						                
				                   }
		                
		                
		                
		                	               
						
						console.log("New");
                      	console.log($scope.NewStoreSelect);
                      	console.log($scope.storeidlist);

                      	console.log($scope.allcheckd);
		                
		                //console.log($scope.storeidlist);
		               $scope.disId = unique($scope.storeidlist,"districtLookupIdId");
		               $scope.regId = unique($scope.storeidlist,"regionLookupIdId");
						
		               
		                   function unique(arraydata,p1){
		                   
		                   
				                var Uniquedata = "";
				                var uniqueNames = [];
				              	 for(i = 0; i< arraydata.length; i++){ 
				              	 if(p1 == "districtLookupIdId")
				              	 {   
								    if(uniqueNames.indexOf(arraydata[i].districtLookupIdId) === -1){
								    	 uniqueNames.push(arraydata[i].districtLookupIdId);
								        Uniquedata += arraydata[i].districtLookupIdId+",";        
								    }
								  } 
								  else if(p1 == "regionLookupIdId")
								  {
								  	if(uniqueNames.indexOf(arraydata[i].regionLookupIdId) === -1){
								    	 uniqueNames.push(arraydata[i].regionLookupIdId);
								        Uniquedata += arraydata[i].regionLookupIdId+",";        
								    }

								  }       
								}
								return Uniquedata;
		                  }
				            
				          }              	               
		            }, function (error) {
		                loaderClose();
		                $scope.statuserror = 'Unable to load customer data: ' + error.message;
		           });              
	           }
	           
	           $scope.getseason= function(a){	           
	              $scope.seasonId = a.ID;       	             
	           }
	         
	           $scope.getstatus= function(a){
	              $scope.statusId = a.nextStatus.Id;     	             
	           }

	            $scope.imgpah=[];
	          $scope.imagesrc = [];			    
			   $scope.getTheFiles = function (files) {				
				   var files1 = angular.element("input[type='file']");
				     for (var i = 0; i < files.length; i++) {			
				            var reader = new FileReader();
				            reader.fileName = files[i].name;			
				            reader.onload = function (event) {			
				                var image = {};
				                image.Name = event.target.fileName;
				                image.Size = (event.total / 1024).toFixed(2);
				                image.Src = event.target.result;
				                //image.mgpath=pth+event.target.fileName; 			               
				                $scope.imagesrc.push(image);
				                $scope.$apply();
				            }
				            reader.readAsArrayBuffer(files[i]);	            
				        }	
			   }
			    
			  /*$scope.PreviewImage=function(a)
			  {
				 $scope.imgp=$scope.imgpah[a];
			  }*/
			  		    
			   $scope.restearray=function(){
			      $scope.allchk.length=0;
			      //console.log($scope.allchk); 
			   }
			   
			   $scope.delete =function(a)
			   {
			      $scope.imagesrc.splice(a, 1);
			       angular.element("input[type='file']").val(null);			     
			      //console.log($scope.imagesrc);
			   }	
			   
			   $scope.datechange = function(){
				   var currentdate = $("#dtstartdate").find("input").val();
	               $("#dtenddate").data("DateTimePicker").minDate(currentdate);
	               $("#dtenddate").find("input").val("");
			  }
			  
			  $scope.setClassEdit = function(name){
					
					var nameArray = name.split(".");
					var extension = nameArray[(nameArray.length)-1];
					console.log(extension);
					if(extension == "pdf")
				      return 'attachPdf';
				    if(extension == "pptx")
				      return 'attachDoc';
				      if(extension=='png')
				      return 'attachImg';
				       if(extension =='jpeg')
				      return 'attachImg';
				      if(extension =='gif')
				      return 'attachImg';
				      else
				      return 'attachDoc';
				}
			  
				$scope.setClass = function(name){
				    if(name == "application/pdf")
				      return 'attachPdf';
				    if(name == "application/vnd.openxmlformats-officedocument.presentationml.presentation")
				      return 'attachDoc';
				      if(name=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
				      return 'attachDoc';
				       if(name=='image/png')
				      return 'attachImg';
				       if(name=='image/jpeg')
				      return 'attachImg';
				      if(name=='image/gif')
				      return 'attachImg';
				      else
				      return 'attachDoc';

	       }   				
			
			  $scope.deletesaved = function(mid)
			  {
			     //alert(mid);
			     $.ajax({
					     url:_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/getByTitle('TaskMediaTrl')/items('"+mid+"')",
					     type:"DELETE",
					     //data:dvalue,
					     headers:{ "accept": "application/json;odata=verbose",
					                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
					                    "content-Type": "application/json;odata=verbose",
					                    "X-Http-Method": "DELETE",
					                    "If-Match": "*"
                                  },		     
					    success:function(data){
					        			alert("Your attchment has been delete!");
					        			
					        			location.reload();	        
					    }});

			  }
			  
			  $scope.chkdisabled =function(a,b)
			  {
			    if($scope.edittaskdata.statusId =='3')
			    {
			      return  commonCtrl.returnbool(a,b,$scope.disabledChecked);
			    }
			    else
			    {
			      return false;
			    }
                 			     
			  }
     	
	}]);
app.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="/sites/vsm/SiteApplication/PixaCore/image/testgif.gif" width="100%" height="100%" />LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })