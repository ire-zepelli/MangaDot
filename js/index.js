//important variables
const contentContainer = document.querySelector(".content");
const searchBar = document.querySelector(".search-bar");
const legend = document.getElementById("legend");
var responseData = "";
var searchData = "";
var skeleton = `<div class="manga animate-flicker">
                    <img class="poster" src="assets/manga-content/image-placeholder.svg" alt="poster">
                </div>`;


//prints the skeleton loading screen
for (let i = 0; i < 6; i++) {
  contentContainer.innerHTML += skeleton;
}

//request data
fetch("https://api.mangadex.org/manga?limit=10&includes%5B%5D=cover_art")
  .then((res) => res.json())
  .then((parsedRes) => {
    console.log(parsedRes);
    responseData = parsedRes;

    //clears  the container
    contentContainer.innerHTML = ``;

    //iterates through the array of json
    for (let i = 0; i < 10; i++) {
      let object = responseData.data;

      //looks for english title
      let title = object[i].attributes.title.en;
      //if none, check for other languages
      if (title == undefined) {
        for (let property in object[i].attributes.title) {
          title = object[i].attributes.title[property];
        }
      }

      //looks for english description
      let description = object[i].attributes.description.en;
      //if none, check for other languages
      if (description == undefined) {
        for (let property in object[i].attributes.description) {
          description = object[i].attributes.description[property];
        }
      }
      //handles cases where there is no description for a manga
      if (description == undefined) {
        description = "No Description";
      }

      //looks for manga id
      let mangaId = object[i].id;

      //looks for file name
      let fileName;
      let length = object[i].relationships.length;
      //iterates through the "type" to look for the "cover_art"
      for (let j = 0; j < length; j++) {
        if (object[i].relationships[j].type == "cover_art") {
          fileName = object[i].relationships[j].attributes.fileName;
        }
      }
      //displays all the manga information
      contentContainer.innerHTML += `<div class="manga">
                                          <img class="poster" src="https://uploads.mangadex.org/covers/${mangaId}/${fileName}" alt="poster">
                                          <div class="manga-description">
                                              <p id="title" class="cool-text">${title}</p>
                                              <p id="description" class="cool-text">${description}</p>
                                          </div>
                                        </div>
                                        `;
    }
  })
  .catch((error) => console.error(error));


//SEARCH EVENT
searchBar.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    //updates the legend
    legend.innerHTML = `<p>Results for "${searchBar.value}"</p>`;
    //lower cases the input
    let input = searchBar.value.toLowerCase();
    //converts spaces to %20 and other characters..
    let encodedInput = encodeURI(input);
    //clears the container
    contentContainer.innerHTML = ``;
    //then add the skeleton loading screen
    for (let i = 0; i < 6; i++) {
      contentContainer.innerHTML += skeleton;
    }

    //request user input data
    fetch(
      `https://api.mangadex.org/manga?limit=10&title=${encodedInput}&includes%5B%5D=cover_art`
    )
      .then((res) => res.json())
      .then((data) => {
        searchData = data;
        console.log(searchData);
        //if server returns an empty data, which means manga not found
        if (searchData.data.length == 0) {
          contentContainer.innerHTML = `<h1 id="notFound"> Manga Not Found </h1>`;
        }
        //else if server return a data
        else {
          //clears container
          contentContainer.innerHTML = ``;

          //iterates through the array of json
          for (let i = 0; i < 10; i++) {
            let object = searchData.data;

            //looks for english title
            let title = object[i].attributes.title.en;
            //if none, check for other languages
            if (title == undefined) {
              for (let property in object[i].attributes.title) {
                description = object[i].attributes.title[property];
              }
            }

            //looks for english description
            let description = object[i].attributes.description.en;
            //if none, check for other languages
            if (description == undefined) {
              for (let property in object[i].attributes.description) {
                description = object[i].attributes.description[property];
              }
            }
            //handles cases where there is no description for a manga
            if (description == undefined || description == '') {
              description = "No Description";
            }

            //looks for manga id
            let mangaId = object[i].id;

            //looks for file name
            let fileName;
            //iterates through the "type" to look for the "cover_art"
            let length = object[i].relationships.length;
            for (let j = 0; j < length; j++) {
              if (object[i].relationships[j].type == "cover_art") {
                fileName = object[i].relationships[j].attributes.fileName;
              }
            }
            //displays all the manga information
            contentContainer.innerHTML += `<div class="manga">
                                            <img class="poster" src="https://uploads.mangadex.org/covers/${mangaId}/${fileName}" alt="poster">
                                            <div class="manga-description">
                                                <p id="title" class="cool-text">${title}</p>
                                                <p id="description" class="cool-text">${description}</p>
                                            </div>
                                          </div>
                                          `;
          }
        }
      })
      .catch((err) => console.log(err));
  }
});
