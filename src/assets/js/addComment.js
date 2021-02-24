import axios from "axios";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber"); // length 값 그 자체
const commentDelete = document.querySelectorAll("#jsDeleteComment");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    span.innerHTML = comment;
    delBtn.innerHTML = "❌";
    li.appendChild(span);
    li.appendChild(delBtn);
    commentList.prepend(li);
    increaseNumber();
};

const sendComment = async(comment) => {
    const videoId = window.location.href.split("/videos/")[1];

    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    });
    if (response.status === 200) {
        addComment(comment);
    }
};

const handleSubmit = event => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};

function destroyComment(event) {
    const li = event.target.parentNode;
    commentList.removeChild(li);
}

function decreaseNumber() {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

const deleteComment = async(event) => {
    const videoId = window.location.href.split("/videos/")[1];
    const commentId = event.target.parentNode.getAttribute("value"); // ㅅㅂ 밸ㄹ는 getAttribute 써야함 왜인진 모름
    const response = await axios({
        url: `/api/${videoId}/${commentId}`,
        method: "POST"
    });
    if (response.status === 200) {
        destroyComment(event);
        decreaseNumber();
    }
}

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
    Array.from(commentDelete).forEach(button => button.addEventListener("click", deleteComment));
}

if (addCommentForm) {
    init();
}