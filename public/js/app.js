const contactForm = document.querySelector('.contact-form');

const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    name: name.value,
    email: email.value,
    message: message.value
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onload = function(){
  if(xhr.responseText == 'success') {
     $('.submit').css('display', 'block');
     $('.submit').css('display', 'none');
     $('.alert-success').css('display', 'block');
      name.value = '';
      email.value = '';
      message.value = '';
  }
  else{
      alert('Something went wrong!');
    }
  }

  xhr.send(JSON.stringify(formData));

})
