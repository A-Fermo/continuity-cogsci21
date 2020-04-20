jsPsych.plugins['causal-graph-inactive'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'causal-graph-inactive',
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
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'It can be used to provide a reminder about the action the subject is supposed to take.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Run',
        description: 'The text that appears on the button to run the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    var start_time = performance.now();

    var html_prompt = '<p id="prompt">'+trial.prompt+'<\p>';
    var html_img = '<img id="Graphics" src='+trial.stimulus+' usemap="#gra" width='+trial.stim_width+' height='+trial.stim_height+'>'
    var html_map = '<map name="gra"></map>'
    var continue_btn = '<button id="jspsych-causal-graph-inactive-done-btn" class="jspsych-btn">'+trial.button_label+'</button>';
    var loader = '<div id="ld" style="visibility:hidden" class="loader"></div>';
    var html = html_prompt + html_img + html_map + continue_btn + loader;
    display_element.innerHTML = html;

    var map = $("#Graphics");

    map.mapster({
      mapKey: "id"
    });

    display_element.querySelector('#jspsych-causal-graph-inactive-done-btn').addEventListener('click', function(){

      var end_time = performance.now();
      var rt = end_time - start_time;

      var trial_data = {
        "rt": rt
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });
  
  };
  return plugin;
})();