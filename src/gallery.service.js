(() => {
  'use strict';

  const GumgaGalleryService = () => {

      let galleries = [
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

      const getGalleries = () => {
        return galleries;
      }

      const setGalleries = value => {
        galleries = value;
      }

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

      const applyImports = (galleries) => {
        galleries = galleries || getGalleries();
        galleries.forEach(gallery => putGalleryHead(gallery.url));
      }

      return {
        getGalleries : getGalleries,
        setGalleries : setGalleries,
        applyImports : applyImports,
        $get : function(){
          return {
            getGalleries : getGalleries,
            setGalleries : setGalleries,
            applyImports : applyImports
          }
        }
      };

  }

  angular.module('gumga.gallery-icon.service', [])
         .provider('GumgaGalleryService', GumgaGalleryService);
})();
