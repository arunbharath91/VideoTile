let modalIndex: number = 1000;

interface IList {
  title: string;
  caption: string;
  url : string;
}

export class VideoTile {
  private modal!: HTMLElement;
  private iframe!: HTMLElement;
  private video!:HTMLElement;
  private currentIndex!: number;
  private videoSrc!:HTMLElement;
  private videoListArrayOptions: IList[] = [];
  private selector: string;
  constructor(selector: string) {
  this.selector = selector;
  this.elementRegistration();
  }

  public render() {
    this.eventRegistration(this.selector);
  }

  protected eventRegistration(selector: string) {
   const videoListNode  = document.querySelectorAll(selector);
   const videoListArray = (Array.prototype.slice.call(videoListNode));
   this.videoListArrayOptions = [];
   videoListArray.forEach((list, index) => {
    this.videoListArrayOptions.push({
      title: list.getAttribute('data-title'),
      caption: list.getAttribute('data-caption'),
      url : list.getAttribute('data-url'),
     });
     list.addEventListener('click', (e: any) => {
     e.preventDefault();
     this.initModal(index);
     })
   });
  }

  protected elementRegistration() {
    this.modal = document.createElement('modal');
    this.modal.className = 'modal';
    this.modal.style.zIndex = modalIndex.toString();

    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.height = '400px';
    this.iframe.setAttribute('frameborder', '0');
    this.iframe.setAttribute('allowfullscreen', 'true');

    this.video = document.createElement('video');
    this.video.setAttribute('controls', 'true');
    
    this.video.style.width = '100%';
    this.video.style.height = '400px';
    this.videoSrc = document.createElement('source');
    this.video.append(this.videoSrc);
    document.body.insertAdjacentHTML('beforeend','<div class="modal-view-cdk"></div>');

    (document.querySelector('.modal-view-cdk') as HTMLElement).addEventListener('click', (e: any) => {
      switch(e.target.id) {
        case 'vi_modal_close':
          this.close();
          break;
        case 'vi_modal_prev':
          this.prev(e);
          break;
        case 'vi_modal_next':
          this.next(e);
          break;
        default: 
        e.stopPropagation();
        return;
      }
    });
  }

  private initModal(listIndex: number) {
    this.currentIndex =  listIndex;
    this.modal.innerHTML = `<div class="modal-container lg">
          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <span class="modal-title"></span>
              <button type="button" class="close" id="vi_modal_close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
           <div class="view-container">

           </div>
          </div>
          <div class="modal-footer">
          <div class="col-md-6">
          <span class="modal-caption"></span>
          </div>
                <div class="col-md-6" style="text-align:right">
                    <button type="button" class="btn btn-primary" id="vi_modal_prev">Previous</button>
                    <button type="button" class="btn btn-secondary" id="vi_modal_next">Next</button>
                    </div>
                    
            </div>
        </div>
      </div>`;
    (document.querySelector('.modal-view-cdk') as HTMLElement).prepend(this.modal);
    this.projectViewContainer(this.currentIndex);
    this.navtoggler();
    }

  private next(e: any) {
    if (this.currentIndex >= this.videoListArrayOptions.length - 1) { 
      e.stopPropagation();
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    this.projectViewContainer(this.currentIndex);
    this.navtoggler();
  }

  private prev(e: any) {
    if (this.currentIndex <= 0) {
      e.stopPropagation();
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    this.projectViewContainer(this.currentIndex);
    this.navtoggler();
  }

  private close() {
    this.modal.remove();
    modalIndex--;
  }

  private navtoggler() {
    if(this.currentIndex <= 0) {
      (this.modal.querySelector('#vi_modal_prev') as HTMLElement).classList.add('disabled');
      (this.modal.querySelector('#vi_modal_next') as HTMLElement).classList.remove('disabled');
    } else if(this.currentIndex >= this.videoListArrayOptions.length - 1) {
      (this.modal.querySelector('#vi_modal_prev') as HTMLElement).classList.remove('disabled');
      (this.modal.querySelector('#vi_modal_next') as HTMLElement).classList.add('disabled');
    } else if (this.currentIndex >= 0 && this.currentIndex <= this.videoListArrayOptions.length - 1) {
      (this.modal.querySelector('#vi_modal_prev') as HTMLElement).classList.remove('disabled');
      (this.modal.querySelector('#vi_modal_next') as HTMLElement).classList.remove('disabled')
    }
  }

  private isUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;  
    }
  }

  protected projectViewContainer(listIndex: number) {

  (this.modal.querySelector('.modal-title') as HTMLElement).innerHTML = this.videoListArrayOptions[listIndex].title;
  (this.modal.querySelector('.modal-caption') as HTMLElement).innerHTML = this.videoListArrayOptions[listIndex].caption;
  this.modal.setAttribute('source', this.videoListArrayOptions[listIndex].url);
  if(this.isUrl(this.videoListArrayOptions[listIndex].url)) {
    this.video.remove();
    this.iframe.className = 'loading';
    this.modal.querySelector('.view-container')?.append(this.iframe);
    this.iframe.setAttribute('src', this.videoListArrayOptions[listIndex].url);
    this.iframe.onload = () => this.iframe.className = 'loaded';
  } else {
    this.iframe.remove();
    this.video.className = 'loading';
    this.modal.querySelector('.view-container')?.append(this.video);
    this.videoSrc.setAttribute('src', this.videoListArrayOptions[listIndex].url);
    this.video.onload = () => this.video.className = 'loaded';
  }
  }

}
