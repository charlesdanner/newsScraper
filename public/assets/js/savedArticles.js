document.addEventListener("DOMContentLoaded", event => {
    const modalTitle = document.getElementById("modalTitle");
    const noteList = document.getElementById("noteList");
    const noteTextArea = document.getElementById("newNoteTextArea");
    const saveNoteBtn = document.getElementById("saveNewNote");
    let titleForCommentSection;

    const populateCommentList = input => {
        let notes = ""
        input.forEach(note => {
            let li =
                `
                <li class=" container-fluid white-text  notesList list-group-item">
                    <button class="d-block btn btn-danger note-delete" id="deleteComment" data-comment="${note}" data-title="${titleForCommentSection}" >x</button>
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
            titleForCommentSection= articleTitle

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

    noteList.addEventListener("click", event => {

        if (this.event.target.id === "deleteComment") {
            const commentContainer = this.event.target.parentElement
            const comment = this.event.target.getAttribute("data-comment")
            const postTitle = this.event.target.getAttribute("data-title")
            console.log("hello")
            console.log(comment)
            console.log(postTitle)


            $.ajax({
                method: "POST",
                url: `/api/article/remove-comment`,
                data: {
                    title: postTitle,
                    comment: comment
                }
            }).then(response => {
                commentContainer.parentElement.removeChild(commentContainer)
            })
        }
    })

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
