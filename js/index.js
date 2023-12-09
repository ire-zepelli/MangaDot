const contentContainer = document.querySelector(".content");
var responseData = '';

fetch("https://api.mangadex.org/manga?limit=10&includes%5B%5D=cover_art")
.then(res => res.json())
.then(parsedRes => {
    console.log(parsedRes);
    responseData = parsedRes;
})
.catch(error => console.log(error))

var loading = setInterval(() => {
    if(responseData){
        contentContainer.innerHTML = ``;
        for(let i = 0; i < 10; i++){
        let object = responseData.data;
        let title = object[i].attributes.title.en;
        let description = object[i].attributes.description.en;
        let mangaId = object[i].id;

        let fileName;
        let length = object[i].relationships.length;
            for(let j = 0; j < length; j++){
                if(object[i].relationships[j].type == 'cover_art'){
                fileName = object[i].relationships[j].attributes.fileName;
                }
            }

        console.log("title: ", title);
        console.log("descrption: ", description);
        console.log("mangaId: ", mangaId);
        console.log("filename:", fileName);
        contentContainer.innerHTML += `<div class="manga">
                                        <img class="poster" src="https://uploads.mangadex.org/covers/${mangaId}/${fileName}" alt="poster">
                                        <div class="manga-description">
                                            <p id="title" class="cool-text">${title}</p>
                                            <p id="description" class="cool-text">${description}</p>
                                        </div>
                                      </div>
                                      `;
        }
        clearInterval(loading);
    }
}, 1000)