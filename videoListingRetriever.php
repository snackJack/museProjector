<?php
  header('Content-Type: application/json');
  $fileList = array();
  $files = glob('./videos/*.mp4');
  foreach ($files as $file) {
      $fileList[filectime($file)] = substr(strrchr($file, '/'),1);
  }
  ksort($fileList);
  $fileList = array_reverse($fileList, TRUE);
  echo json_encode($fileList);
?>