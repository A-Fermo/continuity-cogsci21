jsPsych.plugins['causal-familiarisation'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'causal-familiarisation',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'Image to be displayed.'
      },
      stim_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: 100,
        description: 'Height of images in pixels.'
      },
      stim_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus width',
        default: 100,
        description: 'Width of images in pixels'
      },
      nodes_coord: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Nodes coordinates',
        default: null,
        array: true,
        description: 'Coordinates of the top-left of each node'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        array: true,
        description: 'It can be used to provide a reminder about the action the subject is supposed to take.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  ['Continue'],
        description: 'The text that appears on the button to continue to the next trial.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    
    var start_time = performance.now();
    
  	var IMG = $("<img>",{
      id: "Graphics",
      src: trial.stimulus,
      useMap:"#gra"
	  });
	  IMG.addClass("center");

	  var MAP1 = $("<map>",{
  	  name: "gra"
	  });

    var html_IMG = '<div id="IMG_container"</div>';
    var next_btn = '<button id="jspsych-causal-familiarisation-next-btn" class="jspsych-btn" style="margin-left: 5px">'+trial.button_label_next+'</button>';

    display_element.innerHTML = html_IMG;
    IMG.appendTo("#IMG_container");
    MAP1.appendTo("#IMG_container");
    display_element.innerHTML += next_btn;

    var nxt_btn = document.getElementById("jspsych-causal-familiarisation-next-btn");

    nxt_btn.disabled = true;

    var node_name;
    for (var i = 0; i < trial.nodes_coord.length; i++) {
      var x_left = trial.nodes_coord[i][0];
      var y_left = trial.nodes_coord[i][1];
      var x_right = x_left+38;
      var y_right = y_left+38;
      var coordinates = x_left+","+y_left+","+x_right+","+y_right;
      node_name = "node"+(i+1);
    
      $('<area/>', {
      'alt': '',
      'id': node_name,
      'coords' : coordinates,  
      'shape' : 'rect',
      "href" : '#',
      }).appendTo("map");
    }

    var rankOptions = [];
    var selectDetect = {};
    // rendering options for the 1st selected state
    
    for (var i = 1; i <= trial.nodes_coord.length; i++) {
      var displayOptions = {
        altImage: "img/inst_7"+i+".png",
        altImageOpacity: 1,
        stroke: true,
        strokeColor: 'ff0000',
        strokeWidth: 3
      };
      rankOptions.push(displayOptions);
    }

    function ranking(){
      var nodes_selected = map.mapster('get');   // returns a comma-separated list
      var nodes_ranked = [];
      for(var key of nodes_selected.split(',')) {
        nodes_ranked.push({
          selected: key,
          rank: selectDetect[key] // rank is like the color
        });
      }
      
      return JSON.stringify(nodes_ranked)
    }

    function onClick(data) {
      //console.log("here",data)
      // get current state (0,1,2) -- default to zero which means unset
      var currentNode = selectDetect[data.key] || 0,
          next = (currentNode + 1) % (trial.nodes_coord.length+1);

      // always unset: if state 0, this is all we need to do. if state
      // 2, we have to unset first, since setting the state for an area
      // that's already selected will do nothing. If it happens to be going from 
      // 0 to 1, then no harm done.
    
      map.mapster('set', false, data.key);

      if (next) {        
        // now set the area state using the correct options
        map.mapster('set', true , data.key, rankOptions[currentNode]);
      }
    
      // update local store with current state
      // add 1, and apply a modulus of 3 to get new state

      selectDetect[data.key] = next;
      /*
      var nodes_selected = map.mapster('get');   // returns a comma-separated list
      var nodes_ranked = [];
      for(var key of nodes_selected.split(',')) {
        nodes_ranked.push({
          selected: key,
          rank: selectDetect[key] // rank is like the color
        });
      } 
      console.log(JSON.stringify(nodes_ranked));
      */

      nodes_ranked = ranking()

      correct_answer = '[{"selected":"node1","rank":2},{"selected":"node2","rank":1},{"selected":"node3","rank":1},{"selected":"node6","rank":4},{"selected":"node7","rank":3},{"selected":"node8","rank":1},{"selected":"node10","rank":3}]'

      if (nodes_ranked == correct_answer){
        nxt_btn.disabled = false;
      } else {
        nxt_btn.disabled = true;
      }
      
    }

    var altImages = {};
    for (var i = 1; i <= trial.nodes_coord.length; i++) {
      var altImage_key = "img"+i;
      altImages[altImage_key] = rankOptions[i-1].altImage;
    }
    
    var map = $("#Graphics");
    map.mapster({
      altImages:altImages,
      highlight:true,
      render_highlight: {
        fillColor: 'ff0000',
        fillOpacity: 1,
        stroke: true
      },
      fadeInterval: 50,
      mapKey: "id",
      // setting isSelectable=false will prevent imagemapster from using its own click-select
      // handling. You could also return false from the onClick event to stop internal handling
      isSelectable: false,
      onClick: onClick
    });
     
    nxt_btn.addEventListener('click', function(){
      
      var end_time = performance.now();
      var rt = end_time - start_time;
      var trial_data;
      
      trial_data = {
        "stimulus": trial.stimulus,
        "rt": rt
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
        
    });
	     	    	

  };
  return plugin;
})();
