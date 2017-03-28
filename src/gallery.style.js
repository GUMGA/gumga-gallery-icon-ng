export default `

body.modal-open .gumga-gallery-icon-modal {
  display: flex !important;
  height: 100%;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog {
  margin: auto !important;
  transition: all 1s ease-out;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content{
  border-radius: 0px;
  transition: all 10s ease-out;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-header{
  background: #f5f5f5;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-body{
  transition: all 5s ease-out;
  transition: height .3s;
  padding-bottom: 0;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-footer{
  background: #f5f5f5;
}

body.modal-open .gumga-gallery-icon-modal .modal-dialog .modal-content .modal-header > i{
  margin-top: 10px;
  cursor: pointer;
}

.gallery-icons-loading {
  margin-top: 40px;
  transition: all 5s ease-out;
  transition: height .3s;
}

.gallery-icons-loading > i {
  font-size: 40px;
}

.gallery-icons-loading > label {
  margin-top: 20px;
  margin-bottom: 20px;
}

.gallery-icons-collections{
  max-height: 350px !important;
  overflow: auto !important;
  padding-top: 10px;
  padding-left: 10px;
}

.gallery-icons-collections > div{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  color: #222;
  line-height: 32px;
  height: 32px;
  padding-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.gallery-icons-collections > div:hover{
  background: #f5f5f5;
}

.gallery-icons-collections > div.selected{
  background: #adadad;
  color: #fff;
}

.gallery-icons-collections > div > i{
  font-size: 18px;
}

.gumga-gallery-icon-label-details{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


`
