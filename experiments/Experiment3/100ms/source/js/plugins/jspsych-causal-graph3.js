jsPsych.plugins['causal-graph3'] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'causal-graph1',
		description: '',
		parameters: {
			stim_GIF_A: {
			type: jsPsych.plugins.parameterType.IMAGE,
			pretty_name: 'Stimulus',
			default: undefined,
			description: 'Image to be displayed.'
			},
			stim_GIF_B: {
			type: jsPsych.plugins.parameterType.IMAGE,
			pretty_name: 'Stimulus',
			default: null,
			array: true,
			description: 'Image to be displayed.'
			},
			stim_GIF_C: {
			type: jsPsych.plugins.parameterType.IMAGE,
			pretty_name: 'Stimulus',
			default: undefined,
			description: 'Image to be displayed.'
			},
			loop_state : {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Loop state',
			default: null,
			description: 'Whether the loop is in the state condition or not.'
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
			GIF_B_duration: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'GIF duration',
			default: null,
			array: true,
			description: 'How long the animation lasts.'
			},
			status: {
			type: jsPsych.plugins.parameterType.STRING,
			pretty_name: 'The status of the plugin',
			default: 'active',
			description: 'Whether the causal graph is active or not.'
			},
			A_coord: {
			type: jsPsych.plugins.parameterType.OBJECT,
			pretty_name: 'Nodes coordinates',
			default: null,
			array: true,
			description: 'Coordinates of the round detectors.'
			},
			B_coord: {
			type: jsPsych.plugins.parameterType.OBJECT,
			pretty_name: 'Nodes coordinates',
			default: null,
			array: true,
			description: 'Coordinates of the square detectors.'
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
		var GIF_A = $("<img>",{
		id: "Graphics",
		src: trial.stim_GIF_A,
		useMap:"#gra"
		});
		var GIFs_B_names;
		if(trial.loop_state == true){
			GIFs_B_names = ['GIF0','GIF1','GIF2','GIF3','GIF4','GIF5','GIF6','GIF7','GIF8','GIF9','GIF10','GIF11','GIF12','GIF13','GIF14','GIF15','GIF16','GIF17','GIF18','GIF19'];
		} else if(trial.loop_state == false){
			GIFs_B_names = ['GIF'];
		}
		
		var GIFs_B = {};
		var GIFs_C = [];

		for (var[idx,item] of GIFs_B_names.entries()){
			GIFs_B[item] = [];
			for (var i=0; i < run_max; i++){
				var GIF_B = $("<img>",{
					id: "Graphics",
					src: trial.stim_GIF_B[idx]+"?a="+Math.random(),
					useMap:"#gra"
				});
				GIFs_B[item].push(GIF_B);
			}
		}

		for (var i=0; i < run_max; i++){
			var GIF_C = $("<img>",{
				id: "Graphics",
				src: trial.stim_GIF_C+"?a="+Math.random(),
				useMap:"#gra"
				});
			GIFs_C.push(GIF_C);
		}

		var MAP1 = $("<map>",{
		name: "gra"
		});
		var stim_type, length, branch_first, state_OR_event, time_interval;
		/*
		if(trial.stim_GIF_B != null){
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
		} */
		var html_prompt = '<p id="prompt" style="margin-bottom:50px">'+trial.prompt[0]+'</p>';
		var html_IMG = '<div id="IMG_container" style="padding:0px 50px 0px 50px"</div>';
		var continue_btn = '<button id="jspsych-causal-graph3-continue-btn" class="jspsych-btn" style="margin-left: 5px ; margin-top:40px">'+trial.button_label_next[0]+'</button>';
		var loader = '<div id ="ld" class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
		var html = html_prompt + html_IMG;
		display_element.innerHTML = html;
		GIF_A.appendTo("#IMG_container");
		MAP1.appendTo("#IMG_container");
		var start_anim = performance.now();
		display_element.innerHTML += (continue_btn + loader);
		
		var map = $("#Graphics");
		map.mapster({
		mapKey: "id"
		});

		function tb(stim){
			return stim.split('/')[1].split('_')[1];
		}
		console.log(trial.stim_GIF_A.split('/')[1],tb(trial.stim_GIF_A));

		var cont_btn = document.getElementById("jspsych-causal-graph3-continue-btn");
		var ld = document.getElementById("ld");
		ld.style.visibility="hidden";

		var again_btn = '<button id="jspsych-causal-graph3-again-btn" class="jspsych-btn" style="margin-right: 5px ; margin-top:40px";>'+trial.button_label_again+'</button>';
		var next_btn = '<button id="jspsych-causal-graph3-next-btn" class="jspsych-btn" style="margin-left: 5px ; margin-top:40px">'+trial.button_label_next[1]+'</button>';
		html_prompt = '<p id="prompt" style="margin-bottom:50px">'+trial.prompt[1]+'</p>';
		
		cont_btn.addEventListener('click', function(){

			if(trial.loop_state == true){
				var end_anim = performance.now();
				var GIF_duration = end_anim - start_anim;
				var start_loc = 10;
				var detector_loc = Math.round((GIF_duration/2000-Math.floor(GIF_duration/2000))*10/0.5);
				if(start_loc + detector_loc < 20){detector_loc = start_loc + detector_loc} else{detector_loc = start_loc + detector_loc-20};
			} else if(trial.loop_state == false){
				detector_loc = 0;
			}
			
			if(trial.stim_GIF_B != null){
				var nb_of_run = 1;
				var index = 0;
				function run_graph(GIFs_B,index,detector_loc){

					var html_GIF = '<div id="GIF_container" style="padding:0px 50px 0px 50px"</div>';
					var html = html_prompt + html_GIF;
					display_element.innerHTML = html;

					var GIF_B;
					if(trial.loop_state == true){
						GIF_B = 'GIF'+detector_loc;
					} else if(trial.loop_state == false){
						GIF_B = 'GIF';
					}
					
					GIFs_B[GIF_B][index].appendTo("#GIF_container");
					MAP1.appendTo("#GIF_container");

					setTimeout(circleNets,trial.GIF_B_duration[detector_loc]);

					display_element.innerHTML += (again_btn + next_btn + loader);

					var map = $("#Graphics");
					map.mapster({
					mapKey: "id"
					})

					var nxt_btn = document.getElementById("jspsych-causal-graph3-next-btn");
					var ag_btn = document.getElementById("jspsych-causal-graph3-again-btn");
					var ld = document.getElementById("ld");
					ld.style.visibility="visible";
					ag_btn.disabled = true;
					nxt_btn.disabled = true;

					function circleNets(){
						display_element.innerHTML = html;
						GIFs_C[index].appendTo("#GIF_container");
						MAP1.appendTo("#GIF_container");
						if(trial.loop_state == true){var start_anim = performance.now()};
						var start_time = performance.now();
						display_element.innerHTML += (again_btn + next_btn + loader);
						var nxt_btn = document.getElementById("jspsych-causal-graph3-next-btn");
						var ag_btn = document.getElementById("jspsych-causal-graph3-again-btn");
						var ld = document.getElementById("ld");
						ld.style.visibility="hidden";
						document.getElementById("prompt").innerHTML = trial.prompt[2];
						if(index >= run_max-1){
							ag_btn.disabled = true;
						}
						nxt_btn.disabled = false;

						var node_name;
						if (trial.status == 'active'){
							for (var i = 0; i < trial.B_coord.length; i++) {
								var x_left = trial.B_coord[i][0];
								var y_left = trial.B_coord[i][1];
								var x_right = x_left+12;
								var y_right = y_left+12;
								var coordinates = x_left+","+y_left+","+x_right+","+y_right;

								node_name = "nodeB"+(i+1);

								$('<area/>', {
								'alt': '',
								'id': node_name,
								'coords' : coordinates,  
								'shape' : 'rect',
								"href" : '#',
								}).appendTo("map");
							}

							for (var i = 0; i < trial.A_coord.length; i++) {
								var x = trial.A_coord[i][0];
								var y = trial.A_coord[i][1];
								var z = 5;
								coordinates = x+","+y+","+z

								node_name = "nodeA"+(i+1);

								$('<area/>', {
								'alt': '',
								'id': node_name,
								'coords' : coordinates,  
								'shape' : 'circle',
								"href" : '#',
								}).appendTo("map");
							
							}


						}
					
						var map = $("#Graphics");
						map.mapster({
							noHrefIsMask: true,
							highlight:true,
							singleSelect: true,
							render_highlight: {
								fillColor: 'ff0000',
								fillOpacity: 1,
								stroke: true
							},
							render_select: {
								strokeColor: 'ff0000',
								strokeWidth: 2.5,
								fillOpacity: 0,
								stroke: true
							},
							fadeInterval: 50,
							staticState:null,
							mapKey : 'id'
						});

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

							if(trial.loop_state == true){
								var end_anim = performance.now();
								var GIF_duration = end_anim - start_anim;
								var start_loc = 11;
								var detector_loc = Math.round((GIF_duration/2000-Math.floor(GIF_duration/2000))*10/0.5);
								if(start_loc + detector_loc < 20){detector_loc = start_loc + detector_loc} else{detector_loc = start_loc + detector_loc-20};
							} else if(trial.loop_state == false){
								detector_loc = 0;
							}

							run_graph(GIFs_B,index,detector_loc);
						}); 
					} 

					
					/*
					function onClick(data){
						console.log(trial.stimulus[1],data.key)
					}*/

					
					
							
 
				}
			
				run_graph(GIFs_B,index,detector_loc);
			
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
