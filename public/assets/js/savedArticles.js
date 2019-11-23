document.addEventListener("DOMContentLoaded", event => {
    const modalTitle = document.getElementById("modalTitle");
    const noteList = document.getElementById("noteList");
    const noteTextArea = document.getElementById("newNoteTextArea");
    const saveNoteBtn = document.getElementById("saveNewNote");

    const populateCommentList = input => {
        let notes = ""
        input.forEach(note => {
            let li =
                `
                <li class=" container-fluid white-text list-group-item">
                    <button class="d-block btn btn-danger note-delete">x</button>
                    <h4 class="d-inline note-list-item">${note}</h4>
                </li>`
            notes = notes + li
        })
        noteTextArea.value = ""
        noteList.innerHTML = notes
    }

    articleContainer.addEventListener("click", event => {
        console.log(this.event.target)
        const cardContainer = this.event.target.parentElement.parentElement
         if (this.event.target.id === "deleteButton") {

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

    saveNoteBtn.addEventListener("click", event => {
        const newNoteValue = noteTextArea.value.trim()

        const containsSpecialCharacters = str => {
            var regex = /[+\-=\[\]{}\\|<>\/]/g;
            return regex.test(str);
        }
        
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
})
