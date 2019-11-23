document.addEventListener("DOMContentLoaded", event => {
    const articleContainer = document.getElementById("articleContainer");
    const scraperBtn = document.getElementById("scraper");
    const clearArticlesBtn = document.getElementById("clear");
    const modalTitle = document.getElementById("modalTitle");
    const noteList = document.getElementById("noteList");
    const noteTextArea = document.getElementById("newNoteTextArea");
    const saveNoteBtn = document.getElementById("saveNewNote");
    var targetArticle;

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
        } else if (this.event.target.id === "deleteButton") {

            $.ajax({
                method: "POST",
                url: "/api/delete",
                data: { title: this.event.target.getAttribute('data-title') }

            }).then(response => cardContainer.parentElement.removeChild(cardContainer));
        } else if (this.event.target.id === "noteButton") {
            const articleTitle = this.event.target.getAttribute("data-title")

            console.log(articleTitle)
            modalTitle.innerHTML = articleTitle

            $.ajax({
                method: "GET",
                url: `api/article/${articleTitle}`
            }).then(response => {
                saveNoteBtn.setAttribute("data-title", articleTitle)
                populateCommentList(response)
                $("#noteModal").modal('toggle');
            })
        }
    });

    const populateCommentList = (input) => {
        let notes = ""
        input.forEach(note => {
            let li = 
            `
                <li class=" container-fluid list-group-item">
                    <button class="d-block btn btn-danger note-delete">x</button>
                    <h4 class="d-inline note-list-item">${note}</h4>
                </li>`
            notes = notes + li
        })
        noteTextArea.value = ""
        noteList.innerHTML = notes
    }

    saveNoteBtn.addEventListener("click", event => {
        const containsSpecialCharacters = str => {
            var regex = /[+\-=\[\]{}\\|<>\/]/g;
            return regex.test(str);
        }

        const newNoteValue = noteTextArea.value.trim()
        console.log(containsSpecialCharacters(newNoteValue))
        if (newNoteValue !== undefined && containsSpecialCharacters(newNoteValue) === false) {
            $.ajax({
                method: "POST",
                url: `api/article/add-note`,
                data: {
                    note: newNoteValue,
                    article: saveNoteBtn.getAttribute("data-title")
                }
            }).then(response => {
                console.log(response)
                const commentsArr = response.comments
                populateCommentList(commentsArr)
            })
        }
    })

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