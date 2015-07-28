<?php 

require 'Slim/Slim.php';
require 'includes/helpers.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->config(array(
    'templates.path' => '.',
));

$app->get('/', function () use ($app) {
  $app->render('templates/start.html');
});
$app->get('/data/:name', function ($name) {    
  $maximum = getMaximumRevision($name);
  $file = "$maximum.json";
  $path = "private/$name/$file";  
  header("Content-Type: application/json");
  readfile($path);
});
$app->get('/data/:name/:revision', function ($name, $revision) use($app) {  
  $path = "private/$name/$revision.json";  
  header("Content-Type: application/json");
  if(!is_file($path))
    return $app->notFound();
  readfile($path);
});
$app->post('/data', function() use($app) {
  function generateRandomString($length = 16) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }    
  do {
    $name = generateRandomString();      
    $path = "private/$name";
  } while(is_dir($path));  
  mkdir($path);
  $revision = 1;
  $path = "$path/$revision.json";
  $body = $app->request->getBody();
  file_put_contents($path, $body);
  header("Content-Type: application/json");
  $result = array(
    'name' => $name, 
    'revision' => $revision
  );
  echo json_encode($result);
});
$app->post('/data/:name', function($name) use($app) {
  $path = "private/$name";
  if(!is_dir($path)) {
    $app->notFound();
    return;
  }
  $revision = getMaximumRevision($name)+1;
  $path = "$path/$revision.json";
  $body = $app->request->getBody();
  file_put_contents($path, $body);
  header("Content-Type: application/json");
  $result = array(
    'name' => $name, 
    'revision' => $revision
  );
  echo json_encode($result);
});
$app->run();

?>