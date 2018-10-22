var app = angular.module("Contentapp", ['myservice','fupApp']);

app.controller('Contentcntrl', ['$scope','customer','$http', function($scope,customer,$http) {

      $scope.menuArray =[];
       $scope.widgetArray=[];
       $scope.tabArray=[];
   var editContentId = sessionStorage.getItem('EditContentId');
   //editContentId = '97';
   /* for Edit Page */
   if(editContentId != null || editContentId != 'undefind')
   {
     customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('contentList')/Items("+editContentId+")")
	        .then(function (response) {              
                $scope.allImageGallery =response.data.d.mediaIdId.results;
                $scope.docsArray =response.data.d.documentIdId.results;
                $scope.title = response.data.d.Title;
                $scope.templateId = response.data.d.templateIdId;
                var descriptiondEl = angular.element(document.querySelector('#contentDiv'));
                descriptiondEl.empty();
                  descriptiondEl.append(response.data.d.description);
                  
                  $scope.widgetArray = response.data.d.widgetContentId.results;
                  $scope.tabArray = response.data.d.TabContentIdId.results;
                  sessionStorage.setItem('key',response.data.d.description);
            }, function (error) {
	            $scope.status = 'Unable to load customer data: ' + error.message;					                  
	    });
	    
	    customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('navigationList')/Items?$select=*&$filter=(contentIdId eq '"+editContentId+"') ")
	        .then(function (response) {
	        $scope.url=response.data.d.results[0].url;
	        console.log("94 Id Data");console.log(response);
	          angular.forEach(response.data.d.results, function(value, key){
				     $scope.menuArray.push(value.Id);
				});
             }, function (error) {
	            $scope.status = 'Unable to load customer data: ' + error.message;					                  
	    });	    
  }




 
function reuseFunction(query,purpose){
   customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + query)
	        .then(function (response) {	           
	           if(purpose == 'Menu')
	                $scope.selectedMenuData =response.data.d.results;
	           else if(purpose == 'Template')
	                $scope.templateData =response.data.d.results;
	           else if(purpose == 'Widget')
	                $scope.widgetData =response.data.d.results;
	           else if(purpose == 'Tab')
	                $scope.tabData =response.data.d.results;	         
	         }, function (error) {
	            $scope.status = 'Unable to load customer data: ' + error.message;					                  
	    });
} 

        /* Get Menu Names For Selection */
        $scope.getMenu =function(){
		  $scope.query ="/_api/Web/Lists/GetByTitle('navigationList')/Items?$select=Id,Title";
		  reuseFunction($scope.query,'Menu');
		}
		/* Get Templates Names For Selection */
		$scope.query ="/_api/Web/Lists/GetByTitle('templateList')/Items?$select=Id,Title"; 
		reuseFunction($scope.query,'Template');
		
		/* Get Widget Names For Selection */
		$scope.query ="/_api/Web/Lists/GetByTitle('widgetContent')/Items?$select=Id,Title";
		reuseFunction($scope.query,'Widget');
		
		/* Get Tab Names For Selection */
		$scope.query ="/_api/Web/Lists/GetByTitle('tabContentList')/Items?$select=Id,Title"; 
		reuseFunction($scope.query,'Tab');


       /* Get All Menu , Tab , Widget Selected Item*/      
       
      $scope.checkedValue=function(checkedStatus,dropDownName,id,index){                   
         if(checkedStatus){
	          if(dropDownName==='Menu')
	            $scope.menuArray.push(id);
	          else if(dropDownName==='Widget')
	            $scope.widgetArray.push(id);
	          else if(dropDownName==='Tab')
	            $scope.tabArray.push(id);
         }         
         else{
             if(dropDownName==='Menu'){ 
                var valueIndex =  $scope.getindex($scope.menuArray,id);           
	             $scope.menuArray.splice(valueIndex,1);
             }
	         else if(dropDownName==='Widget'){
	              var valueIndex = $scope.getindex($scope.widgetArray,id);
	            $scope.widgetArray.splice(valueIndex,1);
	          }
	         else if(dropDownName==='Tab'){
	             var valueIndex = $scope.getindex($scope.tabArray,id);
	             $scope.tabArray.splice(valueIndex,1);
	          }
	       }    
       }
       
       
       $scope.isCheckBoxChecked=function(menu,id)
       { 
         var allchk;
          if(menu==='Menu')
            allchk = $scope.menuArray;
          else if(menu==='Widget')
            allchk = $scope.widgetArray;
          else if(menu==='Tab')
            allchk = $scope.tabArray;
            
           var index = -1;
            allchk.some(function(obj, i) {
			  return obj === id? index = i : false;
			});					  
		   return index != (-1)?true:false;
       }
       
       $scope.getindex =function(dropDownName,value){
          var allchk=[];
            if(dropDownName==='Menu')
               allchk = $scope.menuArray;
            else if(dropDownName==='Widget')
              allchk = $scope.widgetArray;  
            else if(dropDownName==='Tab')
              allchk = $scope.tabArray;
            var index = -1;
            allchk.some(function(obj, i) {
			  return obj === value ? index = i : false;
			});
			return index;
       }
      /* Get All Menu , Tab , Widget Selected Item*/

      
      /* Start  Get And Set Description Data From PopUp */
      setInterval(function(){
		  $scope.save();
		}, 200)
      
      $scope.divData='';    

      $scope.save=function(){  
         if(sessionStorage.getItem('key') != $scope.divData){  
            $scope.divData = sessionStorage.getItem('key');
            var myEl = angular.element(document.querySelector('#contentDiv'));
            myEl.empty();
            myEl.append($scope.divData);
	      }
      };
      /*End Get And Set Description Data From PopUp */
       
		   
		$scope.openImageLibrary = function(){   		   
		    var galleryQuery =	"/_api/Web/Lists/GetByTitle('mediaContentLibrary')/Items?$select=*,File&$expand=File"; 
			    customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + galleryQuery)
			        .then(function (response) {
	                 $scope.imageData = response.data.d.results;
	                 console.log('$scope.imageData'); console.log($scope.imageData);
				     }, function (error) {
			            $scope.status = 'Unable to load customer data: ' + error.message;					                  
		        });
		};   
		
		  /*get Selected Image data*/
		  $scope.imagesrc = [];			    
	    $scope.getTheImages = function (files) {
			    $scope.imgfilesData = angular.element("#file1");
			   for (var i = 0; i < files.length; i++) {			
			            var reader = new FileReader();
			            reader.fileName = files[i].name;
			            reader.type = files[i].type;		
			            reader.onload = function (event) {			            	
			                var image = {};
			                image.Name = event.target.fileName;
			                image.Size = (event.total / 1024).toFixed(2);
			                image.Src = event.target.result;
			                image.typeName = event.target.type;
			                image.isView=false;
			                image.isDownload=false; 			                			               
			                $scope.imagesrc.push(image);
			                $scope.$apply();
			            }
			            reader.readAsArrayBuffer(files[i]);					            	            
			        }
			        document.getElementById('imp-pop-up').style.display = "none";
                     document.getElementById('imgdemo').style.display = "block";
	 	   }
  
		   
		   
		   
	/* Preview selected  Image*/	   
  $scope.imageUpload = function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.img = e.target.result;            
        });
    }
		 
    /*For Check Image*/  
     $scope.isCheckImage=function(Id)
     {
      var bool =false;
       $scope.allImageGallery.some(function(obj, i) {
		  return obj === Id ? bool= true : false;
		});
       return bool;
     }; 
	/* Get All checked Images from Image Library*/
	$scope.allImageGallery = [];
	$scope.pictureLibrary = function(id,index ){
	       var imgIndex = -1;
		    $scope.allImageGallery .some(function(obj, i) {
			  return obj === id ? imgIndex = i : false;
			});	  
		  if(imgIndex > -1 )
			 $scope.allImageGallery.splice(imgIndex , 1);
		  else    
			  $scope.allImageGallery.push(id);
	}	   
		   
    $scope.idForContent =null;
    $scope.imageIdForContent = function(id,index){
      $scope.idForContent = id;
      $scope.contentForImage = $scope.imageData[index].imageContent;
       document.getElementById('imp-pop-up').style.display = "none";
       document.getElementById('img-pop-up1').style.display = "block";
    }		   
		   
	/*Save Image Content Against Image Id*/	  
	
   $scope.saveImageContent = function(){  
          var orderData =	{ __metadata: { 'type': 'SP.Data.MediaContentLibraryItem' },imageContent:$scope.contentForImage};	          	        
			$scope.reuseUpdatefunction($scope.idForContent,orderData,'mediaContentLibrary');
			document.getElementById('imp-pop-up').style.display = "block";
	        document.getElementById('img-pop-up1').style.display = "none";
   } 
   
		
  /* save new Image */
	$scope.ImageSave = function()
	{
	 var name = uuidv4()+$scope.imagesrc[0].Name; 
		$.ajax({
				  url:  _spPageContextInfo.webAbsoluteUrl  +"/_api/Web/Lists/getByTitle('mediaContentLibrary')/RootFolder/Files/Add(url='" + name+ "', overwrite=false)?$expand=ListItemAllFields",
				  type: "POST",
				  async: false,
				  processData: false,
				  data:$scope.imagesrc[0].Src,
				  headers:{ "ACCEPT": "application/json;odata=verbose","X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,"content-length": $scope.imagesrc[0].Src.byteLength,"X-Atlassian-Token": "nocheck"},
				  success: function(data) {					
					  document.getElementById('imp-pop-up').style.display = "block"; document.getElementById('imgdemo').style.display = "none";
                         $scope.savedImageId = data.d.ListItemAllFields.ID;
                         var imgRwaData =  	{ __metadata: { 'type': 'SP.Data.MediaContentLibraryItem' },displayName:$scope.imagesrc[0].Name};	
	                      $scope.reuseUpdatefunction($scope.savedImageId,imgRwaData,'mediaContentLibrary');
	               },
                  error:function(){
                    alert("ds");
                  }
		  });
		  $scope.saveImageConten();
	}



  /*Send For Approval */
      $scope.saveContent=function(){    
      
          var contentdata={ __metadata: { 'type': 'SP.Data.ContentListListItem' },
		            Title :$scope.title,
	                description: $scope.divData,
	                widgetContentId:{results:$scope.widgetArray},
	                TabContentIdId:{results:$scope.tabArray},
	                mediaIdId:{results:$scope.allImageGallery},
	                statusIdId:2,
	                url:$scope.url
		   };
    
         if(editContentId == null || editContentId == 'undefind')
         {
            var savequery ="/_api/Web/Lists/GetByTitle('contentList')/Items";          
           customer.insertCustomer( _spPageContextInfo.webAbsoluteUrl  + savequery,contentdata) 
		       .then(function (response) {
		         $scope.newContentId = response.data.d.Id;
		           $scope.menuSaveFunction();			           
		           sessionStorage.removeItem('key');
		          }, function (error) {
					 alert("save error");				                  
			});
         }
         else(editContentId != null || editContentId != 'undefind')
         {
           $scope.reuseUpdatefunction(editContentId,contentdata,'Content');
           sessionStorage.removeItem('key');

         }
       }

     /* put url in navigation against this content*/
     /* $scope.menuSaveFunction =  function(){
          var menuData={ __metadata: { 'type': 'SP.Data.NavigationListListItem' },
			               url:$scope.url,
			               contentIdId:$scope.newContentId
			   };
	          for(var i=0;i<$scope.menuArray.length;i++)
	          {
			    var updatequery ="/_api/Web/Lists/GetByTitle('navigationList')/Items("+$scope.menuArray[i]+")";			            
			     customer.updateCustomer( _spPageContextInfo.webAbsoluteUrl  + updatequery,menuData) 
			       .then(function (response) {	
			          }, function (error) {
						 alert("error navigatio");				                  
			        });
			   }
      }*/
      
      
      
      $scope.openFileLibrary = function(){   		   
		    var galleryQuery =	"/_api/Web/Lists/GetByTitle('contentLibrary')/Items?$select=*,File&$expand=File"; 
			    customer.getCustomers(_spPageContextInfo.webAbsoluteUrl + galleryQuery)
			        .then(function (response) {
	                 $scope.fileLibData = response.data.d.results;
	                 document.getElementById("tablepop").style.width = "100%";
				     }, function (error) {
			            $scope.status = 'Unable to load customer data: ' + error.message;					                  
		        });
		}; 
      
         /* Get Upload DOcs */
	  $scope.filesrc = [];			    
	    $scope.getTheFiles = function (files) {	
			   var files1 = angular.element("input[type='file']");
			   for (var i = 0; i < files.length; i++) {			
			            var reader = new FileReader();
			            reader.fileName = files[i].name;
			            reader.type = files[i].type;		
			            reader.onload = function (event) {			
			                var image = {};
			                image.Name = event.target.fileName;
			                image.Size = (event.total / 1024).toFixed(2);
			                image.Src = event.target.result;
			                image.typeName = event.target.type;
			                image.isView=false;
			                image.isDownload=false; 			                			               
			                $scope.filesrc.push(image);
			                $scope.$apply();
			            }
			            reader.readAsArrayBuffer(files[i]);					            	            
			        }
			       // console.log($scope.filesrc );
			      $('#popLabel').css('display','block');
	              $('#labelOver').css('display','none');
	 	   }
	 	   
	 	     /* Remove  Selected File*/
	 	       $scope.delete =function(a)
			   {
			      $scope.filesrc.splice(a, 1);
			       angular.element("input[type='file']").val(null);
			   }
			   
			   /* set permission for view*/
			   $scope.isView = function(index){			    
			     $scope.filesrc[index].isView = $scope.filesrc[index].isView == false?true:false;
			     $scope.count  = $scope.demo('viewcount');
			     var viewEl = angular.element( document.querySelector('#viewAll'));
			    if($scope.count == $scope.filesrc.length)
			        viewEl.prop('checked', true);
			     else
                    viewEl.prop('checked', false);
			   }
			   
			   /* set permission for download*/
			   $scope.isDownload = function(index){
			     $scope.filesrc[index].isDownload= $scope.filesrc[index].isDownload == false?true:false;
			     $scope.count  =  $scope.demo('downloadcount');
			       var downloadEl = angular.element( document.querySelector('#downAll'));
			     if($scope.count == $scope.filesrc.length)
			        downloadEl.prop('checked', true);
			     else
                    downloadEl.prop('checked', false);
			   }
			   
			   /* Save All selected Files */
      $scope.saveFiles=function(){     
      
         for(var i=0;i< $scope.filesrc.length;i++)
         {
           var name = uuidv4()+$scope.filesrc[i].Name; 
		    $.ajax({
				  url:  _spPageContextInfo.webAbsoluteUrl  +"/_api/Web/Lists/getByTitle('contentLibrary')/RootFolder/Files/Add(url='" + name+ "', overwrite=false)?$expand=ListItemAllFields",
				  type: "POST",
				  async: false,
				  processData: false,
				  data:$scope.filesrc[i].Src,
				  headers:{ "ACCEPT": "application/json;odata=verbose","X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,"content-length": $scope.filesrc[i].Src.byteLength,"X-Atlassian-Token": "nocheck"},
				  success: function(data) {										
                      $scope.savedfileId = data.d.ListItemAllFields.ID;
                      var fileRwaData ={ __metadata: { 'type': 'SP.Data.ContentLibraryItem' },
								           fileDisplayName:$scope.filesrc[i].Name,
								           isView:($scope.filesrc[i].isDownload).toString(),
								           isDownload:($scope.filesrc[i].isView).toString()
				                       };	
                       $scope.reuseUpdatefunction($scope.savedfileId,fileRwaData,'contentLibrary');
	                },
	                error:function(){
	                   alert("ds");
	                }
		      });
            }
           $scope.openFileLibrary();
           $('#popLabel').css('display','none');
		   $('#labelOver').css({'background-color':'#fff' , 'display' : 'block'});

      }
      
      
      /* Function for Update docs/Images Info */
      $scope.reuseUpdatefunction =  function (id,data,libName)
      {
        var updatequery = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('"+libName+"')/Items("+id+")";
         $.ajax({
				  url: updatequery,
				  type: "PATCH",
				  async: false,
				  data: JSON.stringify(data),
				  headers:{"accept": "application/json;odata=verbose","X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,"content-Type": "application/json;odata=verbose","X-Http-Method": "PATCH","If-Match": "*"},
				  success: function(data) {
				    alert("Save File");
				  },
				  error:function(){
				        alert("error update");
				  }
			  });
      }
      
      $scope.deleteAllFiles=function()
      {
        $scope.filesrc.length=0;
        $('#popLabel').css('display','none');
		$('#labelOver').css({'background-color':'#fff' , 'display' : 'block'});
      }
      
      /* Set Permission To Show View Button For All*/
      $scope.viewAllFiles=function()
      { 
        alert($scope.viewAllChk);
        if($scope.viewAllChk){for(var j =0;j<$scope.filesrc.length;j++){$scope.filesrc[j].isView = true;}}
	    else{for(var j =0;j<$scope.filesrc.length;j++){$scope.filesrc[j].isView = false;}}  
	    $scope.viewAllChk = !$scope.viewAllChk;
	    alert($scope.viewAllChk); 
      }

    /* Set Permission To Show Download  Button For All*/
      $scope.downloadAllFiles=function()
      {
        if($scope.downloadAllChk){for(var k =0;k<$scope.filesrc.length;k++){$scope.filesrc[k].isDownload = true;}}
	    else{for(var k =0;k<$scope.filesrc.length;k++){$scope.filesrc[k].isDownload = false;}}
	     $scope.downloadAllChk= !$scope.downloadAllChk;
      }
      
      $scope.isChecked =function(index,type)
      {
        var bool =false;  
          if(type =='View') 
          {    
	        if($scope.filesrc[index]!=null && $scope.filesrc[index].isView)
	           bool = true;
	         else
	           bool = false;
	       }
	       else if(type = 'Download')
	       {
	         if($scope.filesrc[index]!=null && $scope.filesrc[index].isDownload)
	           bool = true;
	         else
	           bool = false;
	       }
         return bool; 
      }      
     /* Get Count of View And Download For Check Unchek All View and Downlaod*/
     $scope.demo = function(typeval)
     {
	      var viewcount =0;
	      var downloadcount =0;
			 angular.forEach($scope.filesrc, function (item) {
		       if(item.isView)
		         viewcount = viewcount + 1 ;
		       if(item.isDownload)
		          downloadcount = downloadcount +1; ;
		    }); 
		    if(typeval == 'viewcount')
		     return viewcount;
		    else
		     return downloadcount;
     }
     
     /* for Edit Page if Content have already Selected Doc */
     $scope.docsArray =[];
     $scope.isCheckDocs=function(Id)
     {
       var bool =false;
       $scope.docsArray.some(function(obj, i) {
		  return obj === Id ? bool= true : false;
		});
       return bool;
     };
     
     
     $scope.checkDocs = function(id,index)
     {
         var docIndex = -1;
	    $scope.docsArray.some(function(obj, i) {
		  return obj === id ? docIndex = i : false;
		});	  
		  if(docIndex > -1 )
			 $scope.docsArray.splice(docIndex, 1);	
		  else   
			  $scope.docsArray.push(id);
		  //console.log($scope.docsArray);
     }
       
   function uuidv4() { 
	   var d = new Date().getTime();
	   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	     var r = (d + Math.random() * 16) % 16 | 0;
	     d = Math.floor(d / 16);
	     return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
	   });
	   return uuid;
   }
  
}]);
  