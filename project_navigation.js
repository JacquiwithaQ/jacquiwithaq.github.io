function load_project(){
  urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("project")){
    project = urlParams.get("project");
    switch (project) {
      case "wristscrolling": 
        select_wristscrolling();
        break;
      case "puzzlefactory": 
        select_puzzlefactory();
        break;
      case "timescript": 
        select_timescript();
        break;
      case "pinchtype": 
        select_pinchtype();
        break;
      case "doodlebugs": 
        select_doodle();
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
      case "puzzlehunt" : 
        select_puzzlehunt();
        break;
      case "filmtheatre" : 
        select_filmtheatre();
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
  	  $( "#wristscrolling_button" ).click(function() {
        document.location.search = ["project=wristscrolling"];
      });
  	  $( "#puzzlefactory_button" ).click(function() {
        document.location.search = ["project=puzzlefactory"];
      });
      $( "#timescript_button" ).click(function() {
        document.location.search = ["project=timescript"];
      });
      $( "#pinchtype_button" ).click(function() {
        document.location.search = ["project=pinchtype"];
      });
      $( "#doodle_button" ).click(function() {
        document.location.search = ["project=doodlebugs"];
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
      $( "#puzzlehunt_button" ).click(function() {
        document.location.search = ["project=puzzlehunt"];
      });
      $( "#filmtheatre_button" ).click(function() {
        document.location.search = ["project=filmtheatre"];
      });
  });
}

function select_wristscrolling(){
  $( "#content" ).load("project_pages/wristscrolling.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#wristscrolling" ).addClass( "sidebar_selected");
}

function select_puzzlefactory(){
  $( "#content" ).load("project_pages/puzzlefactory.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#puzzlefactory" ).addClass( "sidebar_selected");
}

function select_timescript(){
  $( "#content" ).load("project_pages/timescript.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#timescript" ).addClass( "sidebar_selected");
}

function select_pinchtype(){
  $( "#content" ).load("project_pages/pinchtype.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#pinchtype" ).addClass( "sidebar_selected");
}

function select_doodle(){
  $( "#content" ).load("project_pages/doodle_bugs.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#doodle" ).addClass( "sidebar_selected");
}

function select_brick(){
  $( "#content" ).load("project_pages/bricks.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#bricks" ).addClass( "sidebar_selected");
}

function select_rebus(){
  $( "#content" ).load("project_pages/rebus_chat.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#rebus" ).addClass( "sidebar_selected");
}

function select_astraea(){
  $( "#content" ).load("project_pages/astraea.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#astraea" ).addClass( "sidebar_selected");
}

function select_vrhome(){
  $( "#content" ).load("project_pages/vr_home.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#vrhome" ).addClass( "sidebar_selected");
}

function select_pickmeup(){
  $( "#content" ).load("project_pages/pick_me_up.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#pickmeup" ).addClass( "sidebar_selected");
}

function select_emop(){
  $( "#content" ).load("project_pages/emop.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#emop" ).addClass( "sidebar_selected");
}

function select_descent(){
  $( "#content" ).load("project_pages/infinite_descent.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#descent" ).addClass( "sidebar_selected");
}

function select_deepstock(){
  $( "#content" ).load("project_pages/deepstock.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#deepstock" ).addClass( "sidebar_selected");
}

function select_tracing(){
  $( "#content" ).load("project_pages/tracing_movement.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#tracing" ).addClass( "sidebar_selected");
}

function select_genesong(){
  $( "#content" ).load("project_pages/genesong.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#genesong" ).addClass( "sidebar_selected");
}

function select_puzzlehunt(){
  $( "#content" ).load("project_pages/puzzlehunt.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#puzzlehunt" ).addClass( "sidebar_selected");
}

function select_filmtheatre(){
  $( "#content" ).load("project_pages/filmtheatre.html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#filmtheatre" ).addClass( "sidebar_selected");
}

function load_framework(){
    $("#navbar").load("header.html", function() {$("#projects_tab").addClass( "selected" );}); 
    $("#footer").load("footer.html");
    $("#sidebar").load("projects_sidebar.html", function() {
      $( "#wristscrolling" ).click(function() {
        document.location.search = ["project=wristscrolling"];
      });
      $( "#puzzlefactory" ).click(function() {
        document.location.search = ["project=puzzlefactory"];
      });
      $( "#timescript" ).click(function() {
        document.location.search = ["project=timescript"];
      });
      $( "#pinchtype" ).click(function() {
        document.location.search = ["project=pinchtype"];
      });
      $( "#doodle" ).click(function() {
        document.location.search = ["project=doodlebugs"];
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
      $( "#puzzlehunt" ).click(function() {
        document.location.search = ["project=puzzlehunt"];
      });
      $( "#filmtheatre" ).click(function() {
        document.location.search = ["project=filmtheatre"];
      });
      load_project();
    });
  }
