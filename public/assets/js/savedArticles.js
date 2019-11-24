document.addEventListener("DOMContentLoaded", event => {
    const modalTitle = document.getElementById("modalTitle");
    const noteList = document.getElementById("noteList");
    const noteTextArea = document.getElementById("newNoteTextArea");
    const saveNoteBtn = document.getElementById("saveNewNote");
    const scrapeBtn = document.getElementById("scraper")
    let titleForCommentSection;

    scrapeBtn.style.display = "none"
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
            },
        },
        containsSpecialCharacters: function (str) {
            var regex = /[+\-=\[\]{}\\|<>\/]/g;
            return regex.test(str);
        },
        populateCommentList: function (input) {
            let notes = ""
            input.forEach(note => {
                let li =
                    `
                    <li class=" container-fluid white-text  notesList list-group-item">
                        <button class="d-block btn btn-danger note-delete" id="deleteComment" data-comment="${note}" data-title="${titleForCommentSection}" >x</button>
                        <h4 class="d-inline note-list-item">${note}</h4>
                    </li>`;
                notes = notes + li;
            })
            noteTextArea.value = "";
            noteList.innerHTML = notes;
        }
    };

    articleContainer.addEventListener("click", event => {
        const cardContainer = this.event.target.parentElement.parentElement;
        const title = this.event.target.getAttribute('data-title');

        if (this.event.target.id === "deleteButton") {
            API.ajax.post("/api/delete", { title })
                .then(response =>
                    cardContainer.parentElement.removeChild(cardContainer));

        } else if (this.event.target.id === "noteButton") {

            modalTitle.innerHTML = title;
            titleForCommentSection = title;

            API.ajax.get(`api/article/${title}`)
                .then(response => {
                    saveNoteBtn.setAttribute("data-title", title);
                    API.populateCommentList(response);
                    $("#noteModal").modal('toggle');
                });
        };
    });

    noteList.addEventListener("click", event => {
        if (this.event.target.id === "deleteComment") {
            const commentContainer = this.event.target.parentElement;
            const comment = this.event.target.getAttribute("data-comment");
            const postTitle = this.event.target.getAttribute("data-title");
            const data = {
                title: postTitle,
                comment: comment
            };

            API.ajax.post('/api/article/remove-comment', data)
                .then(response => {
                    commentContainer.parentElement.removeChild(commentContainer);
                });
        };
    });

    saveNoteBtn.addEventListener("click", event => {
        const newNoteValue = noteTextArea.value.trim();

        if (newNoteValue !== undefined && !API.containsSpecialCharacters(newNoteValue)) {
            const data = {
                note: newNoteValue,
                article: saveNoteBtn.getAttribute("data-title")
            };

            API.ajax.post('api/article/add-note', data)
                .then(response => {
                    const commentsArr = response.comments;
                    API.populateCommentList(commentsArr);
                })
        };
    });
});
