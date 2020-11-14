$(function () {
  let editor = new MediumEditor("#post-body", {
    placeholder: {
      text: "",
      hideOnClick: true,
    },
  });

  $(".post-form input, #post-body").on("focus", function () {
    removeErrors();
  });

  $(".post-button").on("click", (e) => {
    e.preventDefault();
    removeErrors();

    let data = {
      title: $("#post-title").val(),
      body: $("#post-body").html(),
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/post/add",
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

  function removeErrors() {
    $(".post-form p.error").remove();
    $(".post-form input, #post-body").removeClass("error");
  }
});
