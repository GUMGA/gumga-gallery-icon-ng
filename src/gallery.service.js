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

      return {
        getGalleries : getGalleries,
        setGalleries : setGalleries,
        $get : function(){
          return {
            getGalleries : getGalleries,
            setGalleries : setGalleries
          }
        }
      };
  }

  angular.module('gumga.gallery-icon.service', [])
         .provider('GumgaGalleryService', GumgaGalleryService);
})();
