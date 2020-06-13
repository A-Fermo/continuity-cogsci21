jsPsych.plugins['causal-graph2'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'causal-graph2',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        array: true,
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
      gif_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'GIF duration',
        default: null,
        description: 'How long the animation lasts.'
      },
      status: {
      	type: jsPsych.plugins.parameterType.STRING,
      	pretty_name: 'The status of the plugin',
      	default: 'active',
      	description: 'Whether the causal graph is active or not.'
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
      button_label_again: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  null,
        description: 'The text that appears on the button to run again the current trial.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  ['Run','Next network'],
        array: true,
        description: 'The text that appears on the button to continue to the next trial.'
      },
      prompt_error: {
      	type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt error',
        default: null,
        description: 'The message displayed in case of error.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
  	
  	var run_max = 10;
  	var IMG = $("<img>", 
	{
	  id: "Graphics",
	  src: trial.stimulus[0],
	  useMap:"#gra"
	});
	IMG.addClass("center");
  	var GIFs = [];
  	for (var i=0; i < run_max; i++){
  		var GIF = $("<img>", 
		{
		  id: "Graphics",
		  src: trial.stimulus[1]+"?a="+Math.random(),
		  useMap:"#gra"
		});
		GIF.addClass("center");
		GIFs.push(GIF);
  	}

	
	var MAP1 = $("<map>",
	{
  	  name: "gra"
	});
  	var stim_type, length, branch_first, state_OR_event, time_interval;
  	if(trial.stimulus.length > 1){
	   if(trial.stimulus[1].split("_")[0].split("/")[1] == "chain"){
	    	stim_type = "Chain";
	    	if(trial.stimulus[1].split("_")[1][1] == "S"){
	    		length = "Short";
	    	}
	    	if(trial.stimulus[1].split("_")[1][1] == "M"){
			    length = "Medium";
	    	}
	    	if(trial.stimulus[1].split("_")[1][1] == "L"){
			   length = "Long";
	    	}
	    } else{
  	    	stim_type = "AND_Gate";
	    	if(trial.stimulus[1].split("_")[1][1] == "T"){
	    		branch_first = "Top";
		} else{
			  branch_first = "Bottom";
		}
	    	if(trial.stimulus[1].split("_")[1][2] == "S"){
  	    	length = "Short";
		}
		if(trial.stimulus[1].split("_")[1][2] == "M"){
	    		length = "Medium";
		}
		if(trial.stimulus[1].split("_")[1][2] == "L"){
	    	 length = "Long";
		}
		if(trial.stimulus[1].split("_")[1][3] == "S"){
	    	 state_OR_event = "State";
		}
		if(trial.stimulus[1].split("_")[1][3] == "E"){
	    		state_OR_event = "Event";
	    		if(trial.stimulus[1].split("_")[1][4] == "1"){
	    			time_interval = "Short";
			}
			if(trial.stimulus[1].split("_")[1][4] == "2"){
	    			time_interval = "Medium";
			}
			if(trial.stimulus[1].split("_")[1][4] == "3"){
	    			time_interval = "Long";
			}
		}
		
	    }
    	}
    var html_prompt = '<p id="prompt">'+trial.prompt[0]+'</p>';
    var html_IMG = '<div id="IMG_container"</div>';
    var continue_btn = '<button id="jspsych-causal-graph2-continue-btn" class="jspsych-btn" style="margin-left: 5px">'+trial.button_label_next[0]+'</button>';
    var loader = '<div id="ld" class="loader"></div>';
    var html = html_prompt + html_IMG;
    display_element.innerHTML = html;
    IMG.appendTo("#IMG_container");
    MAP1.appendTo("#IMG_container");
    display_element.innerHTML += (continue_btn + loader);
    
    var map = $("#Graphics");

    map.mapster({
      mapKey: "id"
    });
    
    var cont_btn = document.getElementById("jspsych-causal-graph2-continue-btn");
    var ld = document.getElementById("ld");
    ld.style.visibility="hidden";

    var again_btn = '<button id="jspsych-causal-graph2-again-btn" class="jspsych-btn" style="margin-right: 5px";>'+trial.button_label_again+'</button>';
    var next_btn = '<button id="jspsych-causal-graph2-next-btn" class="jspsych-btn" style="margin-left: 5px">'+trial.button_label_next[1]+'</button>';
    html_prompt = '<p id="prompt">'+trial.prompt[1]+'</p>';
    cont_btn.addEventListener('click', function(){
    
    	if(trial.stimulus.length > 1){
    	
        var nb_of_run = 1;
        var index = 0;
        function run_graph(index){
        //console.log(index);
        var html_GIF = '<div id="GIF_container"</div>';
    		var html = html_prompt + html_GIF;
        display_element.innerHTML = html;
        GIFs[index].appendTo("#GIF_container");
        MAP1.appendTo("#GIF_container");
        display_element.innerHTML += (again_btn + next_btn + loader);
        var node_name;
		    if (trial.status == 'active'){
		    	for (var i = 0; i < trial.nodes_coord.length; i++) {
            var x_left = trial.nodes_coord[i][0];
            var y_left = trial.nodes_coord[i][1];
            var x_right = x_left+38;
            var y_right = y_left+38;
            var coordinates = x_left+","+y_left+","+x_right+","+y_right;

            if(trial.stimulus[1].split("_")[1][0] == "L"){
              node_name = "node"+(trial.nodes_coord.length-i);
            } else {
              node_name = "node"+(i+1);
            }

            $('<area/>', {
            'alt': '',
            'id': node_name,
            'coords' : coordinates,  
            'shape' : 'rect',
            "href" : '#',
            }).appendTo("map");
		    	}
        }
        
        var altimage_name = trial.stimulus[1].split('_')[0].split('/')[1];
        if(altimage_name == 'branch'){
          if(trial.stimulus[1].split("_")[1][0] == "L"){
            altimage_name += '_L';
          }
          if(trial.stimulus[1].split("_")[1][0] == "R"){
            altimage_name += '_R';
          }
        }
        if(altimage_name == 'chain'){
          altimage_name += '_';
        }
      
        /*
		    var map = $("#Graphics");
		    map.mapster(
		    {
          noHrefIsMask: true,
          highlight:false,
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
          staticState:false,
          mapKey : 'id'
		    }
		    );

        */

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
          noHrefIsMask: true,
          highlight:false,
          staticState:false,
          altImages: altImages,
          mapKey: "id",
          // setting isSelectable=false will prevent imagemapster from using its own click-select
          // handling. You could also return false from the onClick event to stop internal handling
          isSelectable: false,
          onClick: onClick
        });

        var nxt_btn = document.getElementById("jspsych-causal-graph2-next-btn");
        var ag_btn = document.getElementById("jspsych-causal-graph2-again-btn");
        var ld = document.getElementById("ld");
        ld.style.visibility="visible";
		   
        ag_btn.disabled = true;
        nxt_btn.disabled = true;
	
		    setTimeout(clickable_areas,trial.gif_duration);
		    var start_time = performance.now();
		    function clickable_areas(){
		    	
		    	document.getElementById("prompt").innerHTML = trial.prompt[2];
		    	ld.style.visibility="hidden";
		    	if(index < run_max-1){
		    		ag_btn.disabled = false;
		    	}
		    	nxt_btn.disabled = false;
		    	map.mapster("set_options",{
            highlight:true,
            staticState:null
			    });
			
		    }
			     
		    nxt_btn.addEventListener('click', function(){
		     
		     	var node_selected = map.mapster('get');

          if(trial.status == 'inactive'){
            node_selected = "Na";
          }
			      
          if (node_selected === ""){
            text_error = trial.prompt_error;
            document.getElementById("prompt").innerHTML = text_error.fontcolor("ff0000");
          } else {
			      
			      		
            //console.log(node_selected);
            var run_again = false;
            var end_time = performance.now();
            var rt = end_time - start_time;
            var trial_data;
            
            if(trial.status == 'active'){
              trial_data = {
                "stimulus": trial.stimulus,
                "status": trial.status,
                "stim_type": stim_type,
                "length": length,
                "state_OR_event": state_OR_event,
                "branch_first": branch_first,
                "time_interval": time_interval,
                "node_selected": node_selected,
                "nb_of_run": nb_of_run,
                "rt": rt
              };
            } else {
              trial_data = {
                "stimulus": trial.stimulus,
                "status": trial.status,
                "nb_of_run": nb_of_run
              };
            }
            
            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);
				      
				  }
		    });
		
        ag_btn.addEventListener('click', function(){
        index++;
        nb_of_run++;
        run_graph(index);
        });
		     
	    }
	     
	    run_graph(index);
	     
	} else {
		var trial_data = {
			"stimulus": trial.stimulus,
			"status": trial.status
		};
		display_element.innerHTML = '';
		jsPsych.finishTrial(trial_data);
	}     	    	
    });

  };
  return plugin;
})();
