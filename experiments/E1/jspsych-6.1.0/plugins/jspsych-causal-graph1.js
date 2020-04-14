jsPsych.plugins['causal-graph1'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'causal-graph1',
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
      button_label_again: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  null,
        description: 'The text that appears on the button to run again the current trial.'
      },
      button_label: {
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

    var html_img = '<img id="Graphics" src='+trial.stimulus+' usemap="#gra" width='+trial.stim_width+' height='+trial.stim_height+'>'
    var html_map = '<map name="gra"></map>'
    var again_btn = '<button id="jspsych-causal-graph1-again-btn" class="jspsych-btn" style="margin-right: 5px";>'+trial.button_label_again+'</button>';
    var continue_btn = '<button id="jspsych-causal-graph1-done-btn" class="jspsych-btn" style="margin-left: 5px">'+trial.button_label_next+'</button>';
    if (trial.button_label_again !== null) {
      var html = html_prompt + html_img + html_map + again_btn + continue_btn;
    }
    if (trial.button_label_again == null) {
      var html = html_prompt + html_img + html_map + continue_btn;
    }

    display_element.innerHTML = html;

    var areas = [];
    for (var i = 0; i < trial.nodes_coord.length; i++) {
      var x_left = trial.nodes_coord[i][0];
      var y_left = trial.nodes_coord[i][1];
      var x_right = x_left+38;
      var y_right = y_left+38;
      var coordinates = x_left+","+y_left+","+x_right+","+y_right;
      var node_name = "node"+i;
      var area = {
        key: node_name
      };
      areas.push(area);
    
      $('<area/>', {
        'alt': '',
        'id': node_name,
        'coords' : coordinates,  
        'shape' : 'rect',
        "href" : '#',
      }).appendTo("map");
    }
    
    
    var map = $("#Graphics");
    
    map.mapster(
      {
        singleSelect: true,
        render_highlight: {
            fillColor: 'ff0000',
            fillOpacity: 1,
            stroke: true
        },
        render_select: {
            strokeColor: 'ff0000',
            strokeWidth: 3,
            fillOpacity: 0,
            stroke: true
        },
        fadeInterval: 50,
        mapKey: 'id',
        areas: areas
    });

    display_element.querySelector('#jspsych-causal-graph1-done-btn').addEventListener('click', function(){

      var again = 0;
      var end_time = performance.now();
      var rt = end_time - start_time;

      var trial_data = {
        "rt": rt,
        "again": again
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });

    if (trial.button_label_again !== null) {
      display_element.querySelector('#jspsych-causal-graph1-again-btn').addEventListener('click', function(){
      var again = 1;
      var trial_data = {
        "again": again
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });
    }
    

    
  };
  return plugin;
})();