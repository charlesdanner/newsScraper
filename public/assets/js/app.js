document.addEventListener("DOMContentLoaded", event => {
    const articleContainer = document.getElementById("articleContainer");
    const scraperBtn = document.getElementById("scraper");
    const clearArticlesBtn = document.getElementById("clear");
    const noteModal = document.getElementById("noteModal");

    articleContainer.addEventListener("click", event => {
        const cardContainer = this.event.target.parentElement.parentElement.parentElement
        if (this.event.target.id === "saveButton") {
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
        } else if(this.event.target.id === "deleteButton") {

            $.ajax({
                method: "POST",
                url: "/api/delete",
                data: {title: this.event.target.getAttribute('data-title')}

            }).then(response => cardContainer.parentElement.removeChild(cardContainer));
        } else if (this.event.target.id === "noteButton") {

            $.ajax({
                method: "GET",
                url: `api/article/${this.event.target.getAttribute('data-title')}`
            }).then(response => {
                console.log(response)
                $("#noteModal").modal('toggle');
            })
            // $.ajax({
            //     method: "POST",
            //     url: `api/article/${this.event.target.getAttribute('data-title')}`
            //     data: //value of form
            // })
        }
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