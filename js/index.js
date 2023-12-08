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
        let object = responseData.data;
        let title = object[0].attributes.title.en;
        let description = object[0].attributes.description.en;
        let mangaId = 
        console.log("title: ", title);
        console.log("descrption: ", description);

        contentContainer.innerHTML = `<h1 style="color:black;">AJ NIGGRO</h1>`;
        clearInterval(loading);
    }
}, 1000)