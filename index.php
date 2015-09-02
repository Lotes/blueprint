<?php 

require 'vendor/autoload.php';

$app = new \Slim\Slim();
$app->config(array(
    'templates.path' => '.',
));

$app->get('/', function () use ($app) {  
  //TODO auto-load for CSS, JS and templates
  $directory = new RecursiveDirectoryIterator('app/');
  $iterator = new RecursiveIteratorIterator($directory);
  $regexIter = new RegexIterator($iterator, '/\.(js|css)$/i', RecursiveRegexIterator::GET_MATCH);
  $jsPaths = array();
  $cssPaths = array();
  foreach ($regexIter as $path => $dir) {
    if(preg_match("/\.js$/i", $path)) {
      if(!preg_match("/worker\.js$/i", $path))
        $jsPaths[] = $path;
    } 
    else if(preg_match("/\.css$/i", $path))
      $cssPaths[] = $path;
  }
  $app->render('templates/start.php', array(
    "scripts" => $jsPaths,
    "styles" => $cssPaths
  ));
});
$app->get('/data/:name', function ($name) use($app) {    
  $path = "private/$name.json";    
  if(is_file($path)) {
    header("Content-Type: application/json");
    readfile($path);
  } else
    $app->notFound();    
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
    $path = "private/$name.json";
  } while(is_file($path));  
  $body = $app->request->getBody();
  file_put_contents($path, $body);
  header("Content-Type: application/json");
  $result = array(
    'name' => $name
  );
  echo json_encode($result);
});
$app->run();

?>