//important variables
const contentContainer = document.querySelector(".content");
const searchBar = document.querySelector(".search-bar");
const legend = document.getElementById("legend");
const show = document.getElementById("show-btn");
var encodedInput = "";
var responseData = "";
var searchData = "";
var skeleton = `<div class="manga animate-flicker">
                    <img class="poster" src="assets/manga-content/image-placeholder.svg" alt="poster">
                </div>`;
var offset = 0;
var mangaIndex = 0;
localStorage.clear();

//prints the skeleton loading screen
for (let i = 0; i < 6; i++) {
  contentContainer.innerHTML += skeleton;
}

//request data to the server
fetch(
  `https://api.mangadex.org/manga?limit=10&offset=${offset}&includes%5B%5D=cover_art`
)
  .then((res) => res.json())
  .then((parsedRes) => {
    localStorage.clear();
    console.log(parsedRes);
    responseData = parsedRes;

    //clears the container
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
      contentContainer.innerHTML += `<div class="manga" data-index=${mangaIndex}>
                                          <img class="poster" src="https://uploads.mangadex.org/covers/${mangaId}/${fileName}" alt="poster">
                                          <div class="manga-description">
                                              <p id="title" class="cool-text">${title}</p>
                                              <p id="description" class="cool-text">${description}</p>
                                          </div>
                                        </div>
                                        `;
      mangaIndex++;
    }
  })
  .catch((error) => console.error(error));

//SEARCH EVENT
searchBar.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    offset = 0;
    show.style.display = "block";
    //updates the legend
    legend.innerHTML = `<p>Results for "${searchBar.value}"</p>`;
    //lower cases the input
    let input = searchBar.value.toLowerCase();
    //converts spaces to %20 and other characters..
    encodedInput = encodeURI(input);
    //clears the container
    contentContainer.innerHTML = ``;
    //then add the skeleton loading screen
    for (let i = 0; i < 6; i++) {
      contentContainer.innerHTML += skeleton;
    }
    console.log(encodedInput);
    //request user input data
    fetch(
      `https://api.mangadex.org/manga?limit=10&offset=${offset}&title=${encodedInput}&includes%5B%5D=cover_art`
    )
      .then((res) => res.json())
      .then((data) => {
        searchData = data;
        console.log(searchData);
        //if server returns an empty data, which means manga not found
        if (searchData.data.length == 0) {
          contentContainer.innerHTML = `<h1 id="notFound"> Manga Not Found </h1>`;
          show.style.display = "none";
        }
        //else if server return a data
        else {
          //clears container
          contentContainer.innerHTML = ``;

          //if it returns data but less than 10
          if (searchData.data.length < 10) {
            show.style.display = "none";
          }

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
            if (description == undefined || description == "") {
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

show.addEventListener("click", () => {
  offset += 10;
  fetch(
    `https://api.mangadex.org/manga?limit=10&offset=${offset}&title=${encodedInput}&includes%5B%5D=cover_art`
  )
    .then((res) => res.json())
    .then((data) => {
      responseData = data;

      if (responseData.data.length < 10) {
        show.style.display = "none";
      } else {
        show.style.display = "block";
      }

      console.log("test");
      console.log(responseData);
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
    .catch((err) => console.log(err));
});

document.addEventListener("click", (event) => {
  var mangaElements = document.querySelectorAll(".manga");
  mangaElements.forEach((manga) => {
    manga.addEventListener("click", handleMangaClick);
  });
});

function handleMangaClick(event) {
  // Access the clicked element and its attributes
  const clickedManga = event.currentTarget;
  const mangaTitle = clickedManga.querySelector("#title").innerText;
  const mangaDescription = clickedManga.querySelector("#description").innerText;
  mangaIndex = clickedManga.dataset.index;

  console.log(clickedManga);
  console.log(`Clicked Manga: ${mangaTitle}`);
  console.log(`index: ${mangaIndex}`);
  let input = mangaTitle.toLowerCase();
  //converts spaces to %20 and other characters..
  input = encodeURI(input);
  mangaTitle
  localStorage.setItem('index',  input);
  window.location = `http://localhost/manga-website/manga-details.html`;
}