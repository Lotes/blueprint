<!DOCTYPE html>
<html ng-app="blueprint">
<head>
  <title>Blueprint</title>
  <script type="text/javascript" src="components/angular/angular.min.js"></script>
  <script type="text/javascript" src="components/angular-route/angular-route.min.js"></script>
  <script type="text/javascript" src="components/angular-sanitize/angular-sanitize.min.js"></script>
  
  <link rel="stylesheet" href="components/bootstrap/dist/css/bootstrap.min.css">  
  <script type="text/javascript" src="components/jquery/dist/jquery.min.js"></script> 
  <script type="text/javascript" src="components/bootstrap/dist/js/bootstrap.min.js"></script>  
  <script type="text/javascript" src="components/mousetrap/mousetrap.min.js"></script>  
  <script type="text/javascript" src="components/underscore/underscore-min.js"></script>  
  <script type="text/javascript" src="components/backbone/backbone.js"></script>  
  
  <? foreach($scripts as $path) { ?>
  <script type="text/javascript" src="<?= $path ?>"></script>
  <? } ?>
  
  <? foreach($styles as $path) { ?>
  <link rel="stylesheet" href="<?= $path ?>">
  <? } ?>
  
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="svg.css">
</head>
<body ng-view></body>
</html>