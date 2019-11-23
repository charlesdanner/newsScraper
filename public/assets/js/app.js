document.addEventListener("DOMContentLoaded", event => {
    const articleContainer = document.getElementById("articleContainer");
    const scraperBtn = document.getElementById("scraper");

    articleContainer.addEventListener("click", event => {
        console.log(this.event.target)
        const cardContainer = this.event.target.parentElement.parentElement
        if (this.event.target.id === "saveArticle") {
            console.log(this.event.target.id)
            const data = {
                title: this.event.target.getAttribute('data-title'),
                summary: this.event.target.getAttribute('data-summary'),
                link: this.event.target.getAttribute('data-link')
            }
            $.ajax({
                method: "POST",
                url: "/api/save",
                data: data

            }).then(result => cardContainer.parentElement.removeChild(cardContainer));
        }
    });
    scraperBtn.addEventListener("click", event => {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data.articles)
                let cardHolder = ""

//                 <div class="card">
//     <div class="card-header">
//       <h3 class="d-inline">
//         <a class="article-link saved-article-link" target="_blank" rel="noopener noreferrer"
//           href="{{this.link}}">{{this.title}}</a> 
//       </h3>
//       <a class="btn btn-success save d-inline float-right" id="saveArticle" data-title="{{this.title}}" data-link="{{this.link}}" data-summary="{{this.summary}}" id="saveButton">Save Article</a>
//     </div>
//     <p class="card-body">{{this.summary}}</p>
//   </div>
                data.articles.forEach(article => {
                    const card = ` 
                    <div class="card">
                        <div class="card-header">
                            <h3 class="d-inline">
                                <a class="article-link saved-article-link" target="_blank" rel="noopener noreferrer" href="${article.link}">${article.title}</a>
                            </h3>
                            <a class="btn btn-success save d-inline float-right" id="saveArticle" data-title="${article.title}" data-link="${article.link}" data-summary="${article.summary}" id="saveButton">Save Article</a>
                        </div>
                        <p class="card-body">${article.summary}</p>
                    </div>`
                    cardHolder = cardHolder + card
                })
                articleContainer.innerHTML = cardHolder

            })
    })


});