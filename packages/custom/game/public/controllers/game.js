'use strict';

/* jshint -W098 */

angular.module('mean.game').filter('Modified_date', function() {
  return function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  };
});



angular.module('mean.game').controller('GameController', ['$scope', 'Global', 'Game','$http',
  function($scope, Global, Game, $http) {
   $scope.final_cost=0;
   $scope.total_cost=0;
   $scope.replace_num=1;
   $scope.moles={};
   $scope.email_sent_status=false;
   $scope.table_result_status=false;
   $scope.table_result=false;
   $scope.email_status=false;
   $scope.info_name=false;
   $scope.mail= function(){
   $scope.email_status=true;
   }

   $scope.send_email =function(email){
   $http({
           method: 'GET',
           url: '/api/game/send_mail?name='+$scope.email_name+'&email='+email+'&score='+$scope.final_cost,
           headers: {
             'content-type': 'application/json; charset=utf-8',
             'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
           }
         }).success(function (data) {
           if (data) {
            $scope.email_sent_status= true;
           }else{
           $scope.email_sent_status= false;
           }
         }).error(function (data, status, headers, config) {
           $scope.status_code = status;
           $scope.info_error = false;
           $scope.info_show = false;
         });

   }

   $scope.insert= function(name,score){
     if(name && name.length >0){
     $http({  method: 'GET',
                url: '/api/game/insert?name='+name+'&score='+score,
                headers: {
                  'content-type': 'application/json; charset=utf-8',
                  'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
                }
              }).success(function (data, status) {
                if (data) {
                 console.log("Inserted successfully")
                }else{
                 console.log(" Didnt insert"+status)
                }
              }).error(function (data, status, headers, config) {
                $scope.status_code = status;
              });

     }else{
     console.log("The length of name is 0 Not sending the request")
     }
   }
   $scope.top_three= function(){
                  $http({  method: 'GET',
                  url: '/api/game/find_top_three',
                  headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
                  }
                }).success(function (data, status) {
                  if (data) {
                  $scope.table_result=true;
                  $scope.table_result_status=false;
                   $scope.totals_table =data;
                  }else{
                  $scope.table_result=false;
                   $scope.table_result_status=true;
                  }
                }).error(function (data, status, headers, config) {
                  $scope.status_code = status;
                });
}
   $scope.finish= function(){

     $scope.final_cost=$scope.total_cost;
     $scope.email_name= $scope.name;
    $scope.insert( $scope.name, $scope.final_cost)
    $scope.name='';
    $scope.total_cost=0;
    flush();
   $scope.moles={}
   }
   var flush= function(){
   var id_list= ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
   id_list.forEach(function(element){
   document.getElementById(element).style.backgroundColor='';
   })
   }
   $scope.set_by_id= function(id)
   {
      if(id){
      var count=document.getElementById(id).style.backgroundColor;
      if(count.length !=0){
      if( typeof $scope.moles[id]!== "undefined")
          {$scope.moles[id]=$scope.moles[id]+1
          $scope.total_cost= $scope.total_cost+10;
          document.getElementById(id).style.backgroundColor='';
          }else{
          $scope.moles[id]=1;
          $scope.total_cost= $scope.total_cost+10;
           document.getElementById(id).style.backgroundColor='';
         }
      }else{
      console.log("Missed Hitting")
      }
      }else{
      console.log("id is not set")
      }


   }

           $scope.startTimer = function (){
             $scope.final_cost=0;
              var name= $scope.name
               if(name && name.length >0){
               $scope.info_name=false;
                $scope.$broadcast('timer-start');
                }else{
                $scope.info_name=true;
                }
            };

            $scope.stopTimer = function (){
                $scope.$broadcast('timer-stop');
                 flush();
            };

            $scope.$on('timer-tick', function (event, args) {
            document.getElementById($scope.replace_num).style.backgroundColor='';
                $scope.rand_num=Math.floor((Math.random() * 9) + 1);
                document.getElementById($scope.rand_num).style.backgroundColor="#00ff00";
                $scope.replace_num=$scope.rand_num;

            });

    $scope.global = Global;
    $scope.package = {
      name: 'game'
    };
  }
]);
