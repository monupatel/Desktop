  var app = angular.module("deleteApp", []);

app.controller("deleteController",['$http','$scope',function($http,$scope) {
  $scope.startNo=0;
  $scope.endNo=0;
  $scope.errormsg=true;
  $scope.chklist =false;
  $scope.firstrecordNo=false;
  $scope.lastrecordNo=false;
  $scope.isreadonlyFrom =true;
  $scope.isreadonlyTo =true;
  
	$scope.commonfunction = function(){
	        if($scope.listname!=null && $scope.listname!='undifind')
	        {
			   $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('"+$scope.listname+"')/items?$select=ID&$top=1&$orderby=ID asc")
			      .then(function(response) {
			        if(response.data.value.length>0)
			          $scope.startNo = response.data.value[0].ID;
			        else
			        {
			         
			          alert("There is No Data in this List...");  
			          $scope.startNo=0; 
			          $scope.startfrom=0;
			          $scope.endto=0; 
			        }
			          $scope.errormsg =false;
			          $scope.chklist =false;
			          $scope.isreadonlyFrom =false;
                      $scope.isreadonlyTo =false;
                      

			      }, function(response){
			        $scope.errormsg =true;	
			         $scope.chklist=true;
			         $scope.startNo=0;
                     $scope.endNo=0;
                     $scope.isreadonlyFrom =true;
                     $scope.isreadonlyTo =true;
	
			   });
			   
			   $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('"+$scope.listname+"')/items?$select=ID&$top=1&$orderby=ID desc")
			      .then(function(response) {
			      if(response.data.value.length>0)
			          $scope.endNo= response.data.value[0].ID;
			       else
			       {
			          $scope.endNo=0;
			          $scope.startfrom=0;
			          $scope.endto=0;
			       }
			          $scope.chklist =false;
			          $scope.errormsg =false;
			          $scope.isreadonlyFrom =false;
                      $scope.isreadonlyTo =false;

			      }, function(response){
			        $scope.errormsg =true;
			        $scope.chklist=true;
			        $scope.startNo=0;
                    $scope.endNo=0;
                    $scope.isreadonlyFrom =true;
                    $scope.isreadonlyTo =true;
			   });

			} 
    };
    
    $scope.FunctionForFrom =function(){
      if($scope.startfrom =='undefind' || $scope.startfrom == null)
           $scope.startfrom=$scope.startNo;
           
       if($scope.startfrom<$scope.startNo)
       {
         $scope.firstrecordNo =true;
         $scope.errormsg=true;
         //$scope.isreadonlyTo =true;
       }
        else
        {
          $scope.errormsg=false;
         //$scope.isreadonlyTo =false;
         $scope.firstrecordNo=false; 
        }    
    }
    
    $scope.FunctionForTo =function(){
        if($scope.endto=='undefind' ||$scope.endto==null)
           $scope.endto =$scope.endNo;       
       
       if($scope.endto>$scope.endNo && $scope.endto<$scope.startNo)
       {
         $scope.errormsg=true;
         $scope.lastrecordNo=true;
        // $scope.isreadonlyFrom =true;
       }  
       else
       {         
          $scope.errormsg=false;
        // $scope.isreadonlyFrom =false;
         $scope.lastrecordNo=false;
       } 
    }
    
    $scope.deleteRecord=function(){
    
        if($scope.startfrom =='undefind' || $scope.startfrom == null)
           $scope.startfrom=$scope.startNo;
           
       if($scope.endto=='undefind' ||$scope.endto==null)
           $scope.endto =$scope.endNo;        
          
          var j=0;
          var arr=[];
          var endval =($scope.endto)+1;
              for(var i=$scope.startfrom;i<endval;i++)
			  {	   
			      j++;
				  arr.push(i);
				  if(j==100)
				  {	
				    j=0;
				    batchdeleteData(arr,$scope.listname);
				    arr.length=0;
			      }
				  else if((i+1)== endval)
				  {
				   batchdeleteData(arr,$scope.listname);
				   arr.length=0;
				  }               	              	               
			   }	      
    }
  
  function batchdeleteData(arr,splistname) {
    alert("sbc");
      var batchGuid = uuidv4();
      var batchContents = new Array();
      var changeSetId = uuidv4();
      var temp = document.createElement('a');
      temp.href = _spPageContextInfo.webAbsoluteUrl;
      var host = temp.hostname;
      for (var driverIndex = 0; driverIndex < arr.length; driverIndex++) {

       // var driver = testdata[driverIndex];
            alert(arr[driverIndex]);
        // create the request endpoint
        var endpoint = _spPageContextInfo.webAbsoluteUrl
                       + "/_api/web/lists/getbytitle(\'"+splistname+"\')"
                       + '/items(' + arr[driverIndex] + ')';

        // create the changeset
        batchContents.push('--changeset_' + changeSetId);
        batchContents.push('Content-Type: application/http');
        batchContents.push('Content-Transfer-Encoding: binary');
        batchContents.push('');
        batchContents.push('DELETE ' + endpoint + ' HTTP/1.1');
        batchContents.push('If-Match: *');

        batchContents.push('');
      }
      // END changeset to delete data
      batchContents.push('--changeset_' + changeSetId + '--');


      // generate the body of the batch
      var batchBody = batchContents.join('\r\n');

      // start with a clean array
      batchContents = new Array();

      // create batch for deleting items
      batchContents.push('--batch_' + batchGuid);
      batchContents.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetId + '"');
      batchContents.push('Content-Length: ' + batchBody.length);
      batchContents.push('Content-Transfer-Encoding: binary');
      batchContents.push('');
      batchContents.push(batchBody);
      batchContents.push('');

      // create request in batch to get all items after all are deleted
      endpoint = _spPageContextInfo.webAbsoluteUrl
                    + "/_api/web/lists/getbytitle(\'"+splistname+"\')"
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

      // create the batch
      console.debug(batchBody);

      // create the request endpoint 
      var endpoint = _spPageContextInfo.webAbsoluteUrl
                     + '/_api/$batch';

      // batches need a specific header
      var batchRequestHeader = {
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'Content-Type': 'multipart/mixed; boundary="batch_' + batchGuid + '"'
      };

      // create request
      jQuery.ajax({
        url: endpoint,
        type: 'POST',
        headers: batchRequestHeader,
        data: batchBody,
        success: function (response) {
           $scope.commonfunction();
           if($scope.startNo > 0)
             alert('Data Deleted');          
        },
        fail: function (error) {
         
        }
      });
    }
    
    
    function uuidv4() {
			    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			    return v.toString(16);
			  });
		   }

 }]); 
