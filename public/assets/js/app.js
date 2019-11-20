document.addEventListener("DOMContentLoaded", event => {
    const articleContainer = document.getElementById("articleContainer");
    const scraperBtn = document.getElementById("scraper");
    const clearArticlesBtn = document.getElementById("clear");

    articleContainer.addEventListener("click", event => {
        if (this.event.target.id === "saveButton") {
            const cardContainer = this.event.target.parentElement.parentElement.parentElement

            const data = {
                title: this.event.target.getAttribute('data-title'),
                summary: this.event.target.getAttribute('data-summary'),
                link: this.event.target.getAttribute('data-link')
            }
            $.ajax({
                method: "POST",
                url: "/save",
                data: data
            }).then(result => cardContainer.parentElement.removeChild(cardContainer));
        };
    });



    scraperBtn.addEventListener("click", event => {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            // With that done, add the note information to the page
            .then(function (data) {

            })
    })

    clearArticlesBtn.addEventListener("click", event => {

    })



























});