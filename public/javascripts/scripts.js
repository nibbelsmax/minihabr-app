/* eslint-disable no-undef */
$(function() {

  // toggle
  let flag = true;
  $('.switch-button').on('click', function(e) {
    e.preventDefault();

    $('input').val('');
    removeErrors();

    if (flag) {
      flag = false;
      $('.register').show('slow');
      $('.login').hide();
    } else {
      flag = true;
      $('.login').show('slow');
      $('.register').hide();
    }
  });

  $('form.login input, for.register input').on('focus', () => {
    removeErrors();
  });

  // Регистрация
  $('.register-button').on('click', (e) => {
    e.preventDefault();
    removeErrors();

    let data = {
      login: $('#register-login').val(),
      password: $('#register-password').val(),
      passwordConfirm: $('#register-password-confirm').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/register'
    }).done( data => {
      if (!data.ok) {
        $('.register h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href','/');
      }
    });
  });

  $('.login-button').on('click', (e) => {
    e.preventDefault();
    removeErrors();

    let data = {
      login: $('#login-login').val(),
      password: $('#login-password').val(),      
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/login'
    }).done( data => {
      if (!data.ok) {
        $('.login h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href','/');
      }
    });
  });

  function removeErrors() {    
    $('form.login p.error, form.register p.error').remove();
    $('form.login input, form.register input').removeClass('error');    
}

});



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

$(function () {
  $('.post-form input, #post-body').on('focus', function () {
    removeErrors();
  });

  $('.post-button').on('click', (e) => {
    e.preventDefault();
    removeErrors();

    let data = {
      title: $('#post-title').val(),
      body: $('#post-body').val(),
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/post/add',
    }).done((data) => {
      console.log(data);
      if (!data.ok) {
        $('.post-form h1').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach((item) => {
            $('#post-' + item).addClass('error');
          });
        }
      } else {
        $(location).attr('href', '/');
      }
    });
  });

  function removeErrors() {
    $('.post-form p.error').remove();
    $('.post-form input, #post-body').removeClass('error');
  }

  //upload
  $('#fileinfo').on('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false,
      success: function (result) {
        console.log(result.ok);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
