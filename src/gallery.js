(() => {
  'use strict';

  const TEMPLATE = require('./gallery.template.js').default;
  const TEMPLATE_MODAL = require('./gallery.template.modal.js').default;
  const ModalController = require('./gallery.controller.modal.js').default;

  const GumgaGalleryIcon = ($uibModal) => {
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

          const checkIfExistsImport = (children, url) => {
              let exists = false;
              for (let i = 0; i < children.length; i++) {
                if(children[i].nodeName == 'LINK'){
                  let lastPosition = url.lastIndexOf('/') + 1;
                  let cssName = url.substring(lastPosition, url.length).trim();
                  if(children[i].href && children[i].href.indexOf(cssName) != -1){
                     exists = true;
                  }
                }
              }
              return exists;
          }

          const putGalleryHead = (url) => {
              let head = document.getElementsByTagName('head')[0];
              let exists = checkIfExistsImport(head.children, url);
              if(!exists) {
                const element = document.createElement('link');
                element.href = url;
                element.rel = 'stylesheet';
                head.appendChild(element);
              }
          }

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
            scope.galleries = scope.galleries || [
              {
                name: 'Font Awesome',
                prefix: 'fa',
                url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
                icons: []
              },
              {
                name: 'Material Icons',
                prefix: 'zmdi',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.css',
                icons: []
              }
            ]
            scope.galleries.forEach(gallery => putGalleryHead(gallery.url));
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

  GumgaGalleryIcon.$inject = ['$uibModal'];

  angular.module('gumga.gallery-icon', ['ui.bootstrap'])
    .directive('gumgaGalleryIcon', GumgaGalleryIcon)
    .controller('GalleryIconModalController', ModalController);

})();
