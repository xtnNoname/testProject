function inscription() {
  $('#signin').toggle("slow","swing",function() {
    console.log("fired");
    if($('#signin').css("display")=="none")
      $('#gridSystemModalLabel').html('Inscription')
    else
      $('#gridSystemModalLabel').html('Connexion');
  });
  $('#signon').toggle("slow","swing");
  //$('#signin').toggle('connection');
  //$('#signon').toggle('inscription');
};

$(document).ready(function() {
  "use strict";

  //$("...").css("background", "brown");
  $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      console.log(scroll);
      if (scroll > 51) {
        $("#mainNav").addClass('affix');
      }
      else {
        $("#mainNav").removeClass('affix');
      }
  });
  // Add scrollspy to <body>
$('body').scrollspy({target: ".navbar-fixed-top", offset: 50});

// Add smooth scrolling on all links inside the navbar
$("#navbar a").on('click', function(event) {

  // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {

    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;
    console.log(hash);
    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function(){

    // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
    });

  } // End if

});
  // Optimalisation: Store the references outside the event handler:
    var $window = $(window);
    var $pane = $('header > div > div > h1');

    function checkWidth() {
        var windowsize = $window.width();
        // Fit Text Plugin for Main Header
        $("h1").fitText(
            1.2, {
                minFontSize: '35px',
                maxFontSize: '65px'
            }
        );
        console.log($("h1").css('font-size'));
        /*
        if (windowsize < 768) {
          var fontSize = parseInt($($pane).css("font-size"));
          fontSize = (fontSize - 0.1) + "px";
          $($pane).css({'font-size':fontSize});
          console.log(fontSize);
        }
        else {
          console.log(windowsize);
        }
        */
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    $(window).resize(checkWidth);

});
