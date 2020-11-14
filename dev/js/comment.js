$(function () {
  let commentForm;
  let parentId;
  //add form
  $("#new, #reply").on("click", function () {
    if (commentForm) {
      commentForm.remove();
    }

    parentId = null;
    commentForm = $("form.comment").clone(true, true);

    if ($(this).attr("id") === "new") {
      commentForm.appendTo(".comment-list");
    } else {
      let parentComment = $(this).parent();
      parentId = parentComment.attr("id");
      $(this).after(commentForm);
    }

    commentForm.css({ display: "flex" });
  });

  $("form.comment .cancel").on("click", function (e) {
    e.preventDefault();
    commentForm.remove();
  });

  $("form.comment .send").on("click", (e) => {
    e.preventDefault();
    //removeErrors();

    let data = {
      post: $(".comments").attr("id"),
      body: commentForm.find("textarea").val(),
      parent: parentId,
    };
    console.log(`data: ${data}`);
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/comment/add",
    }).done((data) => {
      console.log(data);
      if (!data.ok) {
        $(".post-form h1").after('<p class="error">' + data.error + "</p>");
        if (data.fields) {
          data.fields.forEach((item) => {
            $("#post-" + item).addClass("error");
          });
        }
      } else {
        $(location).attr("href", "/");
      }
    });
  });
});
