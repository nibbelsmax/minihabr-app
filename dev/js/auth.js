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


