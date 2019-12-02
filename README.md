# Where does the failure come from ? 
## Proposing a causal model of situation (un)awareness in mixed-initiative systems.

(References can be found in [docs/readings/HMI](https://github.com/Sonybronx/Hypothesis_generation/tree/master/docs/readings/HMI))

### Background

Systems where Human and Computer/Robot are considered as members of a cooperative team is sometimes said _mixed-initiative_ ([Jiang 2015](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Jiang2015_Mixed-InitiativeHuman-RobotInteraction.pdf), [Drougard 2017](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Drougard2017_Mixed-initiativeMission%20PlanningConsideringHumanOperatorStateEstimation.pdf)), but they are more generally related to the notion of _Human-Machine Interface_ (HMI). In a mixed-initiative system (MIS), for a given task (e.g. avoiding a collision), automated device can just alert the human agent (alarm, visual stimuli...), or make recommendations (proposing different trajectories) or even take the initiative from the human agent (performing automatically the action). There are different levels of initiative sharing as well as different degrees of explicit cooperation in term of information communication ([Jiang 2015](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Jiang2015_Mixed-InitiativeHuman-RobotInteraction.pdf)), but a MIS aims to supplant human action when his cognitive or physical capabilities end up decreasing. In this condition, MIS (like _Collision Avoidance System_ in vehicles) might be very useful and becomes more and more reliable. 

However a quite important literature, relying on empirical investigations, showed that when automated device fails somewhere − and if it is not too late yet − more time and cognitive energy is required for the human to recover the situation. Sometimes he might even be unable to understand where the failure comes from ([Nothwang 2016](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Nothwang2016_TheHumanShouldBePartOfTheControlLoop.pdf)). It is due to the fact that automation, being too much trusted, leads human to reduce monitoring or system checking and then to lose _situation awareness_ ([Parasuraman 2010](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Parasuraman2010_ComplacencyAndBiasInHumanUseOfAutomation.pdf)).  Moreover several studies argued that more the device is automated, bigger is the risk of losing situation awareness in case of failure ([Nothwang 2016](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Nothwang2016_TheHumanShouldBePartOfTheControlLoop.pdf), [Robinson 2016](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Robinson2016_DegreeOfAutomationInCommandAndControl.pdf)). In other words, interpreting the situation and determining the root cause of failure becomes harder for human when the degree of automation and complexity of the device (using neural networks, etc.) is higher.

### Project proposal

Some studies ([Onnasch 2013](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Onnasch2013_HumanPerformanceConsequencesLevelsOfAutomation.pdf), [Parasuraman 2010](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Parasuraman2010_ComplacencyAndBiasInHumanUseOfAutomation.pdf),...) recently proposed psychological explanations of the loss of situation awareness in term of _bias_ and _heuristics_ (automation complacency, automation bias, cognitive-miser hypothesis, bias in weighting information from different sources, etc.) with more or less integrative account of the phenomenon but:

1. It seems that very few ones (for now actually I haven't seen any) propose a causal model of situation (un)awareness in case of system failure. Yet it is precisely because the human has trouble inferring the root cause of the failure that it might lead to catastrophic scenarios;
2. There is clearly a lack of computational models of failure understanding in mixed-initiative systems (and perhaps more generally);
3. This lack doesn't allow us to see how the situation awareness, thought of as causal structure understanding, might be integrated to existing models of mixed-initiative decision making in uncertain environment.

Then the project (to be clearly specified...) would consist in developing a computational model of how people might infer causal structure from the evidence of a failure in context where they cooperate with an automated aid device. More precisely it would be interesting to see whether one observes any patterns in human causal inquiries depending on the previous states of the system (more or less automated). As a theoretical framework for our mixed-initiative system, we could rely on a simplified example of planning mixed-initiative actions modelled by Partially Observable Markov Decision Process (POMDP) (like in [Drougard 2017](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Drougard2017_Mixed-initiativeMission%20PlanningConsideringHumanOperatorStateEstimation.pdf)). 

However the objective would be to develop a Bayesian model of failure root cause understanding that _could eventually_ deal with mixed-initiative actions planning models based on POMDP framework. So the main purpose wouldn't be to specifically work on POMDP models, but rather to consider a way of reconciling them with a Bayesian account of situation awareness and failure understanding.


### Short example and first prediction

Let's take for instance a very simplified version of the model in ([Drougard 2017](https://github.com/Sonybronx/Hypothesis_generation/blob/master/docs/readings/HMI/Drougard2017_Mixed-initiativeMission%20PlanningConsideringHumanOperatorStateEstimation.pdf)):

Here the mixed-initiative system consists of a human agent and a firefighter robot. The robot is located in an area with some trees that might suddenly self-ignite. The goal of the game is too extinguish the fire, but the human has to pay attention to the battery charge level of the robot and the volume of water it contains. If it is not recharged, the game is over, and if its tank is empty then it can no longer extinguish the trees. If the human doesn't pay enough attention to the state of battery and tank, the robot displays visual alarms. Moreover data are recorded from the human physiological reaction to the stress and workload, that informs the robot whether it has to takes the initiative to switch from manual to autonomous mode. 

Thus :

- _V<sub>t</sub>_  the observable state space à time _t_ (location of the robot, whether trees are burning or not, etc.)
- _S<sub>t</sub>_  the space of human hidden mental states, in part inferred from physiological data (eye-tracking, EEG, heart rate, etc.)
- _A<sub>t</sub>_  the space of the different actions and states of the robot (displaying visual alarm, making recommendation, being manually controlled or finally autonomous)
- _b<sub>t</sub>(s)_  the belief state of the system

To roughly sketch out the situation, typically _A_ depends on _b(s)_ which depends on _S_ and _V_, and _S_ depends in part on _V_. Now let's imagine that at time _t_ a failure _F_ occurs. A general question would be : how does the inferred causal structure of the _F_-occurrence depend on _A_ at the previous states of the system (so at times _t-1_, _t-2_, _t-3_,..., _t<sub>0</sub>_) ? 

The intuitive prediction would be that the more the system has been autonomous before the _F_-occurrence ("more autonomous" being associated with the level of automation from visual alerts to complete autonomy as well as with the number of times the robot was previously in these states), the less the human would be able to infer the causal network underlying the _F_-occurrence.



