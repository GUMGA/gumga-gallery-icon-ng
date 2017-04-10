(() => {
  'use strict';

  const TEMPLATE = require('./gallery.template.js').default;
  const TEMPLATE_MODAL = require('./gallery.template.modal.js').default;
  const ModalController = require('./gallery.controller.modal.js').default;
  require('./gallery.service.js');

  const GumgaGalleryIcon = ($uibModal, GumgaGalleryService) => {
     return {
        restrict: 'E',
        template : TEMPLATE,
        scope: {
           ngModel: '=',
           galleries: '=?',
           buttonClass: '@?',
           buttonText: '@?',
           buttonShowIconText: '=?',
           buttonIconSize: '@?',
           buttonSelectIconText: '@?',
           buttonSelectIconClass: '@?',
           modalSize: '@?',
           modalTitle: '@?',
           inputSearchPlaceholder: '@?',
           backdrop: '@?'
        },
        require: '^ngModel',
        link: (scope, elm, attrs) => {

          const init = () => {
            scope.buttonClass = scope.buttonClass || 'btn btn-default';
            scope.buttonText = scope.buttonText || 'Escolher ícone';
            scope.modalSize = scope.modalSize || 'medium';
            scope.backdrop = scope.backdrop || 'true';
            scope.buttonIconSize = scope.buttonIconSize || '14';
            scope.buttonShowIconText = scope.hasOwnProperty('buttonShowIconText') ? scope.buttonShowIconText : true;
            scope.modalProperties = {
              title: scope.modalTitle || 'Galeria de Ícones',
              buttonSelectIconText: scope.buttonSelectIconText || 'Usar esse ícone',
              inputSearchPlaceholder: scope.inputSearchPlaceholder || 'Qual ícone está procurando?',
              buttonSelectIconClass: scope.buttonSelectIconClass || 'btn btn-default'
            }
            scope.galleries = scope.galleries || GumgaGalleryService.getGalleries();
            GumgaGalleryService.applyImports(scope.galleries);
          }

          const getModalSize = () => {
            switch (scope.modalSize.toLowerCase()) {
              case 'small':
                return 'sm';
                break;
              case 'medium':
                return 'md';
                break;
              case 'large':
                return 'lg';
                break;
              default:
                return 'md';
            }
          }

          init();

          scope.openModalIcons = () => {
            let modal = $uibModal.open({
              animation: false,
              ariaLabelledBy: 'modal-title-bottom',
              ariaDescribedBy: 'modal-body-bottom',
              template: TEMPLATE_MODAL,
              size: getModalSize(),
              backdrop: scope.backdrop,
              windowClass: 'gumga-gallery-icon-modal',
              controller: 'GalleryIconModalController',
              resolve: {
                modalProperties: () => scope.modalProperties,
                ngModel: () => angular.copy(scope.ngModel),
                galleries: () => scope.galleries
              }
            });
            modal.result.then(function (icon) {
              if(icon) scope.ngModel = icon.icon;
            });
          }

        }
     }
  }

  GumgaGalleryIcon.$inject = ['$uibModal', 'GumgaGalleryService'];

  angular.module('gumga.gallery-icon', ['ui.bootstrap', 'gumga.gallery-icon.service'])
    .directive('gumgaGalleryIcon', GumgaGalleryIcon)
    .controller('GalleryIconModalController', ModalController);

})();
