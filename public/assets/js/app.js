document.addEventListener("DOMContentLoaded", event => {
    const articleContainer = document.getElementById("articleContainer");
    const scraperBtn = document.getElementById("scraper");

    const API = {
        ajax: {
            get: function (targetURL) {
                return $.ajax({
                    method: "GET",
                    url: targetURL
                })
            },
            post: function (targetURL, data) {
                return $.ajax({
                    method: "POST",
                    url: targetURL,
                    data: data
                })
            }
        }
    }

    articleContainer.addEventListener("click", event => {
        const cardContainer = this.event.target.parentElement.parentElement
        if (this.event.target.id === "saveArticle") {
            const data = {
                title: this.event.target.getAttribute('data-title'),
                summary: this.event.target.getAttribute('data-summary'),
                link: this.event.target.getAttribute('data-link')
            }
            API.ajax.post("/api/save", data)
                .then(result => cardContainer.parentElement.removeChild(cardContainer));
        }
    });
    scraperBtn.addEventListener("click", event => {
        API.ajax.get("/api/scrape")
            .then(data => {
                let cardHolder = ""
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