
export default `

<div class="modal-header">
  <h3 class="modal-title pull-left">{{modal.title}}</h3>
  <i  data-ng-click="close()" class="glyphicon glyphicon-remove pull-right"></i>
</div>

<div class="modal-body">
  <uib-tabset active="galleryActiveIndex">
   <uib-tab data-ng-repeat="gallery in galleries"
            select="getIconsByGallery(gallery)"
            index="$index"
            heading="{{gallery.name}}">

            <div ng-if="gallery.loading" align="center" class="gallery-icons-loading">
                <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> <br>
                <label>Carregando galeria, aguarde...</label>
            </div>

            <div ng-show="!gallery.loading">
              <br>
              <input class="gmd form-control" ng-model="search" placeholder="{{modal.inputSearchPlaceholder}}"/>
            </div>

            <div ng-show="!gallery.loading" align="left" class="gallery-icons-collections row" id="{{uidModal}}">
                <div data-ng-repeat="icon in gallery.icons | filter : {icon: search} track by $index "
                     class="col-sm-4"
                     data-ng-click="selectIconDetails(icon)"
                     ng-class="{'selected' : (icon.selected || iconDetails.icon == icon.icon)}">
                  <i class="{{icon.icon}}"></i> <span>{{icon.icon}}</span>
                </div>
            </div>

            <div ng-if="!gallery.loading && (gallery.icons | filter : {icon: search}).length == 0" align="center" class="gallery-icons-loading">
                <label>Nenhum ícone foi encontrado.</label>
            </div>

            <div  ng-show="!gallery.loading && iconDetails"
                  align="left"
                  class="row modal-footer">

                <div class="col-sm-4" style="text-align: center;">
                    <i style="font-size: 50px;" class="{{iconDetails.icon}}"></i>
                    <br>
                    <label class="gumga-gallery-icon-label-details">{{iconDetails.icon}}</label>
                </div>
                <div class="col-sm-8" style="text-align: center;padding-top: 20px;">
                    <button class="{{modal.buttonSelectIconClass}}" data-ng-click="setNgModelAndCloseModal(iconDetails)">
                      {{modal.buttonSelectIconText}}
                    </button>
                </div>

            </div>

   </uib-tab>
  </uib-tabset>
</div>



`;
