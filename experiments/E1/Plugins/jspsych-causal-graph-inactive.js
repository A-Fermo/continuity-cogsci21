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
    
        if(trial.stimulus.split("_")[0].split("/")[1] == "chain"){
    	var stim_type = "Chain"
    	if(trial.stimulus.split("_")[1][1] == "S"){
    		var length = "Short";
    	}
    	if(trial.stimulus.split("_")[1][1] == "M"){
		var length = "Medium";
    	}
    	if(trial.stimulus.split("_")[1][1] == "L"){
		var length = "Long";
    	}
    	var branch_first = "";
    	var state_OR_event = "";
    	var time_interval = "";
    } else{
    	var stim_type = "AND_Gate"
    	if(trial.stimulus.split("_")[1][1] == "T"){
    		var branch_first = "Top"
	} else{
		var branch_first = "Bottom"
	}
    	if(trial.stimulus.split("_")[1][2] == "S"){
    		var length = "Short"
	}
	if(trial.stimulus.split("_")[1][2] == "M"){
    		var length = "Medium"
	}
	if(trial.stimulus.split("_")[1][2] == "L"){
    		var length = "Long"
	}
	if(trial.stimulus.split("_")[1][3] == "S"){
    		var state_OR_event = "State"
    		var time_interval = ""
	}
	if(trial.stimulus.split("_")[1][3] == "E"){
    		var state_OR_event = "Event"
    		if(trial.stimulus.split("_")[1][4] == "1"){
    			var time_interval = "Short"
		}
		if(trial.stimulus.split("_")[1][4] == "2"){
    			var time_interval = "Medium"
		}
		if(trial.stimulus.split("_")[1][4] == "3"){
    			var time_interval = "Long"
		}
	}
	
    }

    display_element.querySelector('#jspsych-causal-graph-inactive-done-btn').addEventListener('click', function(){

      var end_time = performance.now();
      var rt = end_time - start_time;

      var trial_data = {
        "rt": rt,
        "stim_name": trial.stimulus,
        "stim_type": stim_type,
	"length": length,
	"state_OR_event": state_OR_event,
	"branch_first": branch_first,
	"time_interval": time_interval
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    });
  
  };
  return plugin;
})();
