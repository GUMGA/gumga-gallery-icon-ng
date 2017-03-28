(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ModalController = function ModalController(scope, modalProperties, $uibModalInstance, $http, ngModel, galleries, $timeout) {
  scope.close = function () {
    return $uibModalInstance.close();
  };

  scope.uidModal = 'gumga-gallery-' + Math.random().toString(36).substring(7);

  scope.galleries = angular.copy(galleries);

  scope.modal = modalProperties;

  scope.getIconsByGallery = function (gallery, callback) {
    if (gallery.icons.length > 0) {
      if (!ngModel) scope.selectIconDetails(gallery.icons[0]);
      if (callback) callback(gallery);
      return;
    };
    gallery.loading = true;
    $http.get(gallery.url).then(function (resp) {
      var css = resp.data,
          regex = /\.([\w-]*):before/g;
      gallery.icons = css.match(regex).map(function (icon) {
        var item = {
          icon: icon.replace(':before', '').replace('.', gallery.prefix.trim() + ' '),
          selected: false
        };
        return item;
      });
      if (!ngModel) scope.selectIconDetails(gallery.icons[0]);
      gallery.loading = false;
      if (callback) callback(gallery);
    });
  };

  if (ngModel) {
    var prefix = ngModel.split(" ")[0];
    scope.galleries.forEach(function (gallery, galleryIndex) {
      if (gallery.prefix == prefix) {
        scope.galleryActiveIndex = galleryIndex;
        scope.getIconsByGallery(gallery, function (gallery) {
          gallery.icons.forEach(function (icon, index) {
            if (icon.icon == ngModel) {
              scope.selectIconDetails(icon);
              var scroll = 32 * index / 3.4;
              var elm = document.getElementById(scope.uidModal);
              $timeout(function () {
                elm.scrollTop = scroll;
              }, 500);
            }
          });
        });
      }
    });
  } else {
    scope.galleryActiveIndex = 0;
  }

  scope.selectIconDetails = function (icon) {
    return scope.iconDetails = angular.copy(icon);
  };

  scope.setNgModelAndCloseModal = function (icon) {
    return $uibModalInstance.close(angular.copy(icon));
  };
};

ModalController.$inject = ['$scope', 'modalProperties', '$uibModalInstance', '$http', 'ngModel', 'galleries', '$timeout'];

exports.default = ModalController;

},{}],2:[function(require,module,exports){
'use strict';

(function () {
  'use strict';

  var TEMPLATE = require('./gallery.template.js').default;
  var TEMPLATE_MODAL = require('./gallery.template.modal.js').default;
  var ModalController = require('./gallery.controller.modal.js').default;
  require('./gallery.service.js');

  var GumgaGalleryIcon = function GumgaGalleryIcon($uibModal, GumgaGalleryService) {
    return {
      restrict: 'E',
      template: TEMPLATE,
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
      link: function link(scope, elm, attrs) {

        var checkIfExistsImport = function checkIfExistsImport(children, url) {
          var exists = false;
          for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == 'LINK') {
              var lastPosition = url.lastIndexOf('/') + 1;
              var cssName = url.substring(lastPosition, url.length).trim();
              if (children[i].href && children[i].href.indexOf(cssName) != -1) {
                exists = true;
              }
            }
          }
          return exists;
        };

        var putGalleryHead = function putGalleryHead(url) {
          var head = document.getElementsByTagName('head')[0];
          var exists = checkIfExistsImport(head.children, url);
          if (!exists) {
            var element = document.createElement('link');
            element.href = url;
            element.rel = 'stylesheet';
            head.appendChild(element);
          }
        };

        var init = function init() {
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
          };
          scope.galleries = scope.galleries || GumgaGalleryService.getGalleries();
          scope.galleries.forEach(function (gallery) {
            return putGalleryHead(gallery.url);
          });
        };

        var getModalSize = function getModalSize() {
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
        };

        init();

        scope.openModalIcons = function () {
          var modal = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            template: TEMPLATE_MODAL,
            size: getModalSize(),
            backdrop: scope.backdrop,
            windowClass: 'gumga-gallery-icon-modal',
            controller: 'GalleryIconModalController',
            resolve: {
              modalProperties: function modalProperties() {
                return scope.modalProperties;
              },
              ngModel: function ngModel() {
                return angular.copy(scope.ngModel);
              },
              galleries: function galleries() {
                return scope.galleries;
              }
            }
          });
          modal.result.then(function (icon) {
            if (icon) scope.ngModel = icon.icon;
          });
        };
      }
    };
  };

  GumgaGalleryIcon.$inject = ['$uibModal', 'GumgaGalleryService'];

  angular.module('gumga.gallery-icon', ['ui.bootstrap', 'gumga.gallery-icon.service']).directive('gumgaGalleryIcon', GumgaGalleryIcon).controller('GalleryIconModalController', ModalController);
})();

},{"./gallery.controller.modal.js":1,"./gallery.service.js":3,"./gallery.template.js":5,"./gallery.template.modal.js":6}],3:[function(require,module,exports){
'use strict';

(function () {
  'use strict';

  var GumgaGalleryService = function GumgaGalleryService() {

    var galleries = [{
      name: 'Font Awesome',
      prefix: 'fa',
      url: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      icons: []
    }, {
      name: 'Material Icons',
      prefix: 'zmdi',
      url: 'http://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
      icons: []
    }];

    var getGalleries = function getGalleries() {
      return galleries;
    };

    var setGalleries = function setGalleries(value) {
      galleries = value;
    };

    return {
      getGalleries: getGalleries,
      setGalleries: setGalleries,
      $get: function $get() {
        return {
          getGalleries: getGalleries,
          setGalleries: setGalleries
        };
      }
    };
  };

  angular.module('gumga.gallery-icon.service', []).provider('GumgaGalleryService', GumgaGalleryService);
})();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n\nbody.modal-open .gumga-gallery-icon-modal {\n  display: flex !important;\n  height: 100%;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog {\n  margin: auto !important;\n  transition: all 1s ease-out;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content{\n  border-radius: 0px;\n  transition: all 10s ease-out;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-header{\n  background: #f5f5f5;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-body{\n  transition: all 5s ease-out;\n  transition: height .3s;\n  padding-bottom: 0;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-footer{\n  background: #f5f5f5;\n}\n\nbody.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-header > i{\n  margin-top: 10px;\n  cursor: pointer;\n}\n\n.gallery-icons-loading {\n  margin-top: 40px;\n  transition: all 5s ease-out;\n  transition: height .3s;\n}\n\n.gallery-icons-loading > i {\n  font-size: 40px;\n}\n\n.gallery-icons-loading > label {\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n\n.gallery-icons-collections{\n  max-height: 350px !important;\n  overflow: auto !important;\n  padding-top: 10px;\n  padding-left: 10px;\n}\n\n.gallery-icons-collections > div{\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  color: #222;\n  line-height: 32px;\n  height: 32px;\n  padding-left: 10px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.gallery-icons-collections > div:hover{\n  background: #f5f5f5;\n}\n\n.gallery-icons-collections > div.selected{\n  background: #adadad;\n  color: #fff;\n}\n\n.gallery-icons-collections > div > i{\n  font-size: 18px;\n}\n\n.gumga-gallery-icon-label-details{\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n\n";

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _galleryStyle = require('./gallery.style.js');

var _galleryStyle2 = _interopRequireDefault(_galleryStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = '\n\n  <style>' + _galleryStyle2.default + '</style>\n\n  <button class="{{buttonClass}}" data-ng-click="openModalIcons()" ng-show="!ngModel">\n    {{buttonText}}\n  </button>\n\n  <button class="{{buttonClass}}" data-ng-click="openModalIcons(ngModel)" ng-show="ngModel">\n    <i style="font-size: {{buttonIconSize}}px;" class="{{ngModel}}"></i> \n    <span ng-show="buttonShowIconText">{{ngModel}}</span>\n  </button>\n\n';

},{"./gallery.style.js":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = "\n\n<div class=\"modal-header\">\n  <h3 class=\"modal-title pull-left\">{{modal.title}}</h3>\n  <i  data-ng-click=\"close()\" class=\"glyphicon glyphicon-remove pull-right\"></i>\n</div>\n\n<div class=\"modal-body\">\n  <uib-tabset active=\"galleryActiveIndex\">\n   <uib-tab data-ng-repeat=\"gallery in galleries\"\n            select=\"getIconsByGallery(gallery)\"\n            index=\"$index\"\n            heading=\"{{gallery.name}}\">\n\n            <div ng-if=\"gallery.loading\" align=\"center\" class=\"gallery-icons-loading\">\n                <i class=\"fa fa-spinner fa-spin\" aria-hidden=\"true\"></i> <br>\n                <label>Carregando galeria, aguarde...</label>\n            </div>\n\n            <div ng-show=\"!gallery.loading\">\n              <br>\n              <input class=\"gmd form-control\" ng-model=\"search\" placeholder=\"{{modal.inputSearchPlaceholder}}\"/>\n            </div>\n\n            <div ng-show=\"!gallery.loading\" align=\"left\" class=\"gallery-icons-collections row\" id=\"{{uidModal}}\">\n                <div data-ng-repeat=\"icon in gallery.icons | filter : {icon: search} track by $index \"\n                     class=\"col-sm-4\"\n                     data-ng-click=\"selectIconDetails(icon)\"\n                     ng-class=\"{'selected' : (icon.selected || iconDetails.icon == icon.icon)}\">\n                  <i class=\"{{icon.icon}}\"></i> <span>{{icon.icon}}</span>\n                </div>\n            </div>\n\n            <div ng-if=\"!gallery.loading && (gallery.icons | filter : {icon: search}).length == 0\" align=\"center\" class=\"gallery-icons-loading\">\n                <label>Nenhum \xEDcone foi encontrado.</label>\n            </div>\n\n            <div  ng-show=\"!gallery.loading && iconDetails\"\n                  align=\"left\"\n                  class=\"row modal-footer\">\n\n                <div class=\"col-sm-4\" style=\"text-align: center;\">\n                    <i style=\"font-size: 50px;\" class=\"{{iconDetails.icon}}\"></i>\n                    <br>\n                    <label class=\"gumga-gallery-icon-label-details\">{{iconDetails.icon}}</label>\n                </div>\n                <div class=\"col-sm-8\" style=\"text-align: center;padding-top: 20px;\">\n                    <button class=\"{{modal.buttonSelectIconClass}}\" data-ng-click=\"setNgModelAndCloseModal(iconDetails)\">\n                      {{modal.buttonSelectIconText}}\n                    </button>\n                </div>\n\n            </div>\n\n   </uib-tab>\n  </uib-tabset>\n</div>\n\n\n\n";

},{}]},{},[2]);
