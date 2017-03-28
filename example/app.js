(function(angular){

    angular.module('app', ['gumga.gallery-icon', 'ui.bootstrap'])
      .controller('ctrl', function($scope, GumgaGalleryService) {


        console.log(GumgaGalleryService);

        $scope.galerias = [
          {
            name: 'Font Awesome',
            prefix: 'fa',
            url: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
            icons: []
          },
          {
            name: 'Material Icons',
            prefix: 'zmdi',
            url: 'http://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
            icons: []
          }
        ]

      });

})(window.angular);
