project_id_list = ["wristscrolling", "puzzlefactory", "timescript", "pinchtype", "doodlebugs", "15bricks", "rebuschat", "astraea", "vrhome", "pickmeup", "emop", "infinitedescent", "deepstock", "tracingmovement", "genesong"];
project_filter_list = ["publications", "arvr", "puzzlesgames"];

function load_project(){
  urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("project")){
    project_id = urlParams.get("project");
    if (project_id && project_id_list.includes(project_id)) {
      select_project(project_id);
    } else {
      load_grid();
    }
  } else {
    load_grid();
  }
}

function load_grid(){
  $( "#content" ).load("projects_navigation.html", function() {
      clear_filters();
      project_id_list.forEach((project_id) => 
        $( "#" + project_id + "_button" ).click(function() {
          document.location.search = ["project=" + project_id];
        }));
      project_filter_list.forEach((filter_name) => 
        $( "#" + filter_name + "_filter").click(function() {
          select_filter(filter_name);
        }));
      $( "#all_filter").click(function() {
          clear_filters();
      });
  });
}

function select_project(project_id){
  clear_filters();
  $( "#content" ).load("project_pages/" + project_id + ".html");
  $( ".sidebar_selected").removeClass( "sidebar_selected" );
  $( "#" + project_id ).addClass( "sidebar_selected");
}

function select_filter(filter_name){
  $( "#filter_row .selected").removeClass( "selected" );
  $( "#" + filter_name + "_filter" ).addClass( "selected");
  $( ".filtered_out").each( function (i) {
      $(this).removeClass( "filtered_out" );
  });
  $( ".grid_button").each( function (i) {
    if (! $(this).hasClass( filter_name )) {
      $(this).addClass( "filtered_out" );
    }
  });
  $( ".sidebar_link").each( function (i) {
    if (! $(this).hasClass( filter_name )) {
      $(this).addClass( "filtered_out" );
    }
  });
}

function clear_filters(){
  $( "#filter_row .selected").removeClass( "selected" );
  $( "#all_filter" ).addClass( "selected");
  $( ".filtered_out").each( function (i) {
      $(this).removeClass( "filtered_out" );
  });
}

function load_framework(){
    $("#navbar").load("header.html", function() {$("#projects_tab").addClass( "selected" );}); 
    $("#footer").load("footer.html");
    $("#sidebar").load("projects_sidebar.html", function() {
      project_id_list.forEach((project_id) => 
        $( "#" + project_id).click(function() {
          document.location.search = ["project=" + project_id];
        }));
      load_project();
    });
  }
