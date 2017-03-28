import style from './gallery.style.js'

export default `

  <style>${style}</style>

  <button class="{{buttonClass}}" data-ng-click="openModalIcons()" ng-show="!ngModel">
    {{buttonText}}
  </button>

  <button class="{{buttonClass}}" data-ng-click="openModalIcons(ngModel)" ng-show="ngModel">
    <i style="font-size: {{buttonIconSize}}px;" class="{{ngModel}}"></i> 
    <span ng-show="buttonShowIconText">{{ngModel}}</span>
  </button>

`;
