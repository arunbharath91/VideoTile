
import { VideoTile } from "./video";
const video = new VideoTile('.videocon');
const listcontainer = document.querySelector('#videoModal');
let listParams = 5;

document.querySelector('#load_more')?.addEventListener('click', () => {
  listParams = listParams + 5;
  httpRequest(listParams);
})


const httpRequest = (params: any) => {
  fetch(`https://run.mocky.io/v3/5f234acc-3544-46f8-822d-497991f678da/${params}`, )
  .then((response) => {
    response.json().then((json) => {
      (listcontainer as HTMLElement).appendChild(stringToHTML(renderList(json)));
      video.render();
    });
  })
  .catch((err) => {
    console.log(err);
    (listcontainer as HTMLElement).appendChild(stringToHTML(`<li> <p style="margin-left: 20px">${err} </p></li>`));
  });
}

httpRequest(listParams);


const renderList = (json:any[]) => {
  let list = '';
  json.forEach((data: any, index) => {
    list += `<li class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
    <a class="videocon" href="${data.url}"
    data-title="${data.title}" 
    data-caption="${data.caption}"
    data-url="${data.url}"
    style="background-image: url('assets/images/y${index+1}.jpg')"
    target="_blank" title="Hi Iam Khushi">
            <span><img src="assets/images/vcthumb.png" class="img-responsive"></span>
            <span class="duration">03:15</span>
        </a>
    </li>`    
});
return list;
}

const stringToHTML = (str: string) => document.createRange().createContextualFragment(str);
