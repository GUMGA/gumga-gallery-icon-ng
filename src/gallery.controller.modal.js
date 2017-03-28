const ModalController = (scope, modalProperties, $uibModalInstance, $http, ngModel, galleries, $timeout) => {
  scope.close = () => $uibModalInstance.close();

  scope.uidModal = 'gumga-gallery-'+Math.random().toString(36).substring(7);

  scope.galleries = angular.copy(galleries);

  scope.modal = modalProperties;

  scope.getIconsByGallery = (gallery, callback) => {
    if(gallery.icons.length > 0){
      if(!ngModel) scope.selectIconDetails(gallery.icons[0]);
      if(callback) callback(gallery);
      return;
    };
    gallery.loading = true;
    $.ajax({
          url: gallery.url,
          type: 'GET',
          success: function (resp) {
            let css = resp, regex = /\.([\w-]*):before/g;
            gallery.icons = css.match(regex).map(icon => {
              let item = {
                icon: icon.replace(':before', '').replace('.', gallery.prefix.trim() + ' '),
                selected: false
              };
              return item;
            })
            if(!ngModel) scope.selectIconDetails(gallery.icons[0]);
            gallery.loading = false;
            if(callback) callback(gallery);
            scope.$digest();
          }
        })
  }

  if(ngModel){
    var prefix = ngModel.split(" ")[0];
    scope.galleries.forEach((gallery, galleryIndex) => {
      if(gallery.prefix == prefix){
        scope.galleryActiveIndex = galleryIndex;
        scope.getIconsByGallery(gallery, (gallery) => {
          gallery.icons.forEach((icon, index) => {
            if(icon.icon == ngModel){
              scope.selectIconDetails(icon);
              const scroll = (32 * index) / 3.4;
              const elm = document.getElementById(scope.uidModal);
              $timeout(()=>{
                elm.scrollTop = scroll;
              }, 500);
            }
          })
        });
      }
    });
  }else{
    scope.galleryActiveIndex = 0;
  }

  scope.selectIconDetails = icon => scope.iconDetails = angular.copy(icon);

  scope.setNgModelAndCloseModal = icon => $uibModalInstance.close(angular.copy(icon));

}

ModalController.$inject = ['$scope', 'modalProperties', '$uibModalInstance', '$http', 'ngModel', 'galleries', '$timeout'];

export default ModalController;
