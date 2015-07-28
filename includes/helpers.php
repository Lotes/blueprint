<?php 

function getMaximumRevision($name) {
  $files = array_filter(scandir("private/$name"), function($file) {
    $regex = '/^\d+\.json$/';
    return preg_match($regex, $file) == 1;
  });
  $map = array_values(array_map(function($file) {
    $regex = '/^(\d+)\.json$/';
    preg_match($regex, $file, $treffer);
    return array($treffer[1], $file);
  }, $files));
  uasort($map, function($lhs, $rhs) {
    $left = $lhs[0];
    $right = $rhs[0];
    return $left == $right ? 0 : ($left < $right ? -1 : 1);
  });
  if(count($map) == 0)
    return 0;
  return $map[count($map)-1][0];
}

?>