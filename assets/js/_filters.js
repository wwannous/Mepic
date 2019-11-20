app.filter('htmlSafe', [
    '$sce', function($sce) {
      return $sce.trustAsHtml;
    }
]);  

app.filter('trusted', function($sce){
  return function(url) {
      return $sce.trustAsResourceUrl(url);
  }
});