function load_project(){
  urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("project")){
    project = urlParams.get("project");
    switch (project) {
      case "pinchtype": 
        select_pinchtype();
        break;
      case "strokesketch": 
        select_stroke();
        break;
      case "15bricks" : 
        select_brick();
        break;
      case "rebuschat" : 
        select_rebus();
        break;
      case "astraea" : 
        select_astraea();
        break;
      case "vrhome" : 
        select_vrhome();
        break;
      case "pickmeup" : 
        select_pickmeup();
        break;
      case "emop" : 
        select_emop();
        break;
      case "infinitedescent" : 
        select_descent();
        break;
      case "deepstock" : 
        select_deepstock();
        break;
      case "tracingmovement" : 
        select_tracing();
        break;
      case "genesong" : 
        select_genesong();
        break;
      default : 
        load_grid();
        break;
    } 
  } else {
      load_grid();
  }
}

function load_grid(){
  $( "#content" ).load("projects_navigation.html", function() {
      $( "#pinchtype_button" ).click(function() {
        document.location.search = ["project=pinchtype"];
      });
      $( "#stroke_button" ).click(function() {
        document.location.search = ["project=strokesketch"];
      });
      $( "#brick_button" ).click(function() {
        document.location.search = ["project=15bricks"];
      });
      $( "#rebus_button" ).click(function() {
        document.location.search = ["project=rebuschat"];
      });
      $( "#astraea_button" ).click(function() {
        document.location.search = ["project=astraea"];
      });
      $( "#vrhome_button" ).click(function() {
        document.location.search = ["project=vrhome"];
      });
      $( "#pickmeup_button" ).click(function() {
        document.location.search = ["project=pickmeup"];
      });
      $( "#emop_button" ).click(function() {
        document.location.search = ["project=emop"];
      });
      $( "#descent_button" ).click(function() {
        document.location.search = ["project=infinitedescent"];
      });
      $( "#deepstock_button" ).click(function() {
        document.location.search = ["project=deepstock"];
      });
      $( "#tracing_button" ).click(function() {
        document.location.search = ["project=tracingmovement"];
      });
      $( "#genesong_button" ).click(function() {
        document.location.search = ["project=genesong"];
      });
  });
}

function select_pinchtype(){
  $( "#content" ).load("projects/pinchtype.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#pinchtype" ).addClass( "sidebar_selected");
}

function select_stroke(){
  $( "#content" ).load("projects/stroke.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#stroke" ).addClass( "sidebar_selected");
}

function select_brick(){
  $( "#content" ).load("projects/bricks.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#bricks" ).addClass( "sidebar_selected");
}

function select_rebus(){
  $( "#content" ).load("projects/rebus_chat.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#rebus" ).addClass( "sidebar_selected");
}

function select_astraea(){
  $( "#content" ).load("projects/astraea.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#astraea" ).addClass( "sidebar_selected");
}

function select_vrhome(){
  $( "#content" ).load("projects/vr_home.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#vrhome" ).addClass( "sidebar_selected");
}

function select_pickmeup(){
  $( "#content" ).load("projects/pick_me_up.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#pickmeup" ).addClass( "sidebar_selected");
}

function select_emop(){
  $( "#content" ).load("projects/emop.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#emop" ).addClass( "sidebar_selected");
}

function select_descent(){
  $( "#content" ).load("projects/infinite_descent.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#descent" ).addClass( "sidebar_selected");
}

function select_deepstock(){
  $( "#content" ).load("projects/deepstock.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#deepstock" ).addClass( "sidebar_selected");
}

function select_tracing(){
  $( "#content" ).load("projects/tracing_movement.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#tracing" ).addClass( "sidebar_selected");
}

function select_genesong(){
  $( "#content" ).load("projects/genesong.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#genesong" ).addClass( "sidebar_selected");
}

function load_framework(){
    $("#navbar").load("header.html", function() {$("#projects_tab").addClass( "selected" );}); 
    $("#footer").load("footer.html");
    $("#sidebar").load("projects_sidebar.html", function() {
      $( "#pinchtype" ).click(function() {
        document.location.search = ["project=pinchtype"];
      });
      $( "#stroke" ).click(function() {
        document.location.search = ["project=strokesketch"];
      });
      $( "#bricks" ).click(function() {
        document.location.search = ["project=15bricks"];
      });
      $( "#rebus" ).click(function() {
        document.location.search = ["project=rebuschat"];
      });
      $( "#astraea" ).click(function() {
        document.location.search = ["project=astraea"];
      });
      $( "#vrhome" ).click(function() {
        document.location.search = ["project=vrhome"];
      });
      $( "#pickmeup" ).click(function() {
        document.location.search = ["project=pickmeup"];
      });
      $( "#emop" ).click(function() {
        document.location.search = ["project=emop"];
      });
      $( "#descent" ).click(function() {
        document.location.search = ["project=infinitedescent"];
      });
      $( "#deepstock" ).click(function() {
        document.location.search = ["project=deepstock"];
      });
      $( "#tracing" ).click(function() {
        document.location.search = ["project=tracingmovement"];
      });
      $( "#genesong" ).click(function() {
        document.location.search = ["project=genesong"];
      });
      load_project();
    });
  }
