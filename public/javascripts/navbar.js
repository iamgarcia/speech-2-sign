document.addEventListener("DOMContentLoaded", function (event) {
  var nav = document.querySelector("ul.navbar-nav");
  var navLinks = nav.querySelectorAll(".nav-link");

  var route = window.location.pathname;

  switch (route) {
    case "/":
      setActiveNavLink(0);
      break;

    case "/about":
      setActiveNavLink(1);
      break;

    case "/contact":
      setActiveNavLink(2);
      break;
  }

  function setActiveNavLink(activeNavLink) {
    for (var i = 0; i < navLinks.length; i++) {
      if (i != activeNavLink) {
        navLinks[i].className.replace(" active", "");
        navLinks[i].removeAttribute('aria-current');
      } else {
        navLinks[i].className += ' active';
        navLinks[i].setAttribute('aria-current', 'true');
      }
    }
  }
});
