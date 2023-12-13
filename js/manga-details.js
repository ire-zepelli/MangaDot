const skeleton = `<div class="manga animate-flicker">
                  <img class="poster" src="assets/manga-content/image-placeholder.svg" alt="poster"/>
                  </div>
`;
const contentContainer = document.querySelector(".content");
var title = localStorage.getItem('index');
localStorage.clear();
contentContainer.innerHTML += skeleton;

fetch(`https://api.mangadex.org/manga?limit=1&title=${title}&includes%5B%5D=cover_art`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        contentContainer.innerHTML = ``;
        let object = data.data[0];

        //looks for english title
        let title = object.attributes.title.en;
        //if none, check for other languages
        if (title == undefined) {
          for (let property in object.attributes.title) {
            title = object.attributes.title[property];
          }
        }
  
        //looks for english description
        let description = object.attributes.description.en;
        //if none, check for other languages
        if (description == undefined) {
          for (let property in object.attributes.description) {
            description = object.attributes.description[property];
          }
        }
        //handles cases where there is no description for a manga
        if (description == undefined) {
          description = "No Description";
        }
  
        //looks for manga id
        let mangaId = object.id;
  
        //looks for file name
        let fileName;
        let length = object.relationships.length;
        //iterates through the "type" to look for the "cover_art"
        for (let j = 0; j < length; j++) {
          if (object.relationships[j].type == "cover_art") {
            fileName = object.relationships[j].attributes.fileName;
          }
        }
        //displays all the manga information
        contentContainer.innerHTML += `<div class="manga">
                                            <img class="poster" src="https://uploads.mangadex.org/covers/${mangaId}/${fileName}" alt="poster">
                                            <div class="manga-description">
                                                <p id="title" class="cool-text">${title}</p>
                                                <div id="details">
                                                <p id="cool-text">Description</p>
                                                <p id="description" class="cool-text">${description}</p>
                                                </div>
                                            </div>
                                          </div>
                                          `;
    })
    .catch(err => console.log(err))