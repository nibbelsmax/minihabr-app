$(function () {
  let commentForm;
  let parentId;

  function form(isNew, comment) {
    $('.reply').show();

    if (commentForm) {
      commentForm.remove();
    }
    parentId = null;

    commentForm = $('.comment').clone(true, true);

    if (isNew) {
      commentForm.find('.cancel').hide();
      commentForm.appendTo('.comment-list');
    } else {
      var parentComment = $(comment).parent();
      parentId = parentComment.attr('id');
      $(comment).after(commentForm);
    }

    commentForm.css({ display: 'flex' });
  }

  // load
  form(true);

  // add form
  $('.reply').on('click', function () {
    form(false, this);
    $(this).hide();
  });

  $('form.comment .cancel').on('click', function (e) {
    e.preventDefault();
    commentForm.remove();
    form(true);
  });

  $('form.comment .send').on('click', (e) => {
    e.preventDefault();
    //removeErrors();

    let data = {
      post: $('.comments').attr('id'),
      body: commentForm.find('textarea').val(),
      parent: parentId,
    };
    console.log(`data: ${data}`);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/comment/add',
    }).done((data) => {
      console.log(data);
      if (!data.ok) {
        if (data.error === undefined) {
          data.error = 'Неизвестная ошибка';
        }
        $(commentForm).prepend(`<p class = "error">${data.error}</p>`);
      } else {
        let newComment = `<ul><li style = "background-color:#ffffe0;"><div class="head"><a href="/users/${data.login}">${data.login}</a>
            <spam class="date">только что</spam></div>${data.body}</li></ul>`;
        $(commentForm).after(newComment);
        form(true);
      }
    });
  });
});
