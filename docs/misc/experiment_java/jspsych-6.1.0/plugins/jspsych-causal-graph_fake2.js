jsPsych.plugins['causal-graph'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'causal-graph',
    description: '',
    parameters: {
      stim_img: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'Image to be displayed.'
      },
      stim_gif: {
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
        default: undefined,
        array: true,
        description: 'Coordinates of the top-left of each node'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'It can be used to provide a reminder about the action the subject is supposed to take.'
      },
      button_label_run: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Run',
        description: 'The text that appears on the button to run for the first time the current trial.'
      },
      button_label_again: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Run again',
        description: 'The text that appears on the button to run again the current trial.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to continue to the next trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    var start_time = performance.now();

    var html_prompt = "";
    // check if there is a prompt and if it is shown above
    if (trial.prompt !== null) {
      html_prompt += trial.prompt;
    }

    var html_img = '<img id="Graphics" src='+trial.stim_img+' width='+trial.stim_width+' height='+trial.stim_height+'>';
    var run_btn = '<button id="jspsych-causal-graph-run-btn" class="jspsych-btn">'+trial.button_label_run+'</button>';
    var html = html_img + run_btn;
    display_element.innerHTML = html;
    btn = display_element.querySelector('#jspsych-causal-graph-run-btn');

    btn.addEventListener('click', function(){
      display_element.innerHTML += "hi";
    });

    var html_gif = '<img id="Graphics" src='+trial.stim_gif+' usemap="#gra" width='+trial.stim_width+' height='+trial.stim_height+'>';
    var html_map = '<map name="gra"></map>';
    var continue_btn = '<button id="jspsych-causal-graph-done-btn" class="jspsych-btn" style="margin-left: 5px">'+trial.button_label_next+'</button>';
    var again_btn = '<button id="jspsych-causal-graph-again-btn" class="jspsych-btn" style="margin-right: 5px";>'+trial.button_label_again+'</button>';
    var html = html_prompt + html_gif + html_map + again_btn + continue_btn;
    display_element.innerHTML = html;


    for (var i = 0; i < trial.nodes_coord.length; i++) {
      var x_left = trial.nodes_coord[i][0];
      var y_left = trial.nodes_coord[i][1];
      var x_right = x_left+38;
      var y_right = y_left+38;
      var coordinates = x_left+","+y_left+","+x_right+","+y_right;
      var node_name = "node"+i;
    
      $('<area/>', {
        'alt': '',
        'id': node_name,
        'coords' : coordinates,  
        'shape' : 'rect',
        "href" : '#',
      }).appendTo("map");
    }
      
    var str = trial.stim_gif.split("/")[1].split("_");
    var altimage_name = str[0]+"_"// +str[1][0]+"B" the name of the underlying general altImage (for instance "branch_SB")
    
    var map = $("#Graphics");
      
      var renderOpts = [];
      selNodes = {};
      // rendering options for the 1st selected state
      for (var i = 1; i <= trial.nodes_coord.length; i++) {
        var selectedOpt = {
          stroke: true,
          strokeColor: 'ff0000',
          strokeWidth: 2,
          altImage: "img/"+altimage_name+i+".png",
          altImageOpacity: 1
        };
        renderOpts.push(selectedOpt);
      }
    
    function onClick(data) {
      console.log("here",data)
      // get current state (0,1,2) -- default to zero which means unset
      var cur = selNodes[data.key] || 0,
          next = (cur + 1) % (trial.nodes_coord.length+1);

      // always unset: if state 0, this is all we need to do. if state
      // 2, we have to unset first, since setting the state for an area
      // that's already selected will do nothing. If it happens to be going from 
      // 0 to 1, then no harm done.
    
      map.mapster('set', false, data.key);

      if (next) {        
          // now set the area state using the correct options
          map.mapster('set', true , data.key, renderOpts[cur]);
      }
    
      // update local store with current state
      // add 1, and apply a modulus of 3 to get new state

      selNodes[data.key] = next;
    }
    
    var altImages = {};
    for (var i = 1; i <= trial.nodes_coord.length; i++) {
      var alt_key = "img"+i;
      altImages[alt_key] = renderOpts[i-1].altImage;
    }
    
    map.mapster({
      altImages: altImages,
      mapKey: "id",
      // setting isSelectable=false will prevent imagemapster from using its own click-select
      // handling. You could also return false from the onClick event to stop internal handling
      isSelectable: false,
      onClick: onClick
    });

    display_element.querySelector('#jspsych-causal-graph-done-btn').addEventListener('click', function(){

      var again = 0;
      var end_time = performance.now();
      var rt = end_time - start_time;
      // gather data
      // get final state of each node
      var activeKeys = map.mapster('get');   // returns a comma-separated list
      var activeNodes = [];
      for(var key in activeKeys.split(',')) {
        activeNodes.push({
            node: key,
            rank: selNodes[key] // rank is like the color
        });
      }

      var trial_data = {
        "activeNodes": JSON.stringify(activeNodes),
        "rt": rt,
        "again": again
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });

    display_element.querySelector('#jspsych-causal-graph-again-btn').addEventListener('click', function(){
      var again = 1;
      var trial_data = {
        "again": again
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });
  
  };
  return plugin;
})();