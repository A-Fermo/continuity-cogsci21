# Actual causes as changes of state in continuous time

This repository provides the source code, the data and the experimental materials for: 

[cite paper in preparation...]

<br>

## Overview
---
<br>

`experiments` contains the experimental materials for four different pilot experiments we ran.

`preprocessing` contains all the notebooks that process and clean the raw data from the experiments. A CSV file is saved for each experiment in `data`.

`data` contains all the cleaned CSV files.

`analysis` contains all the notebooks that analyse each data set.

`docs` contains different useful file like ethics form and articles.

<br>

## Folder `experiments`
---
Contains four folders including the materials for the pilot experiments we ran.

<br>

`Experiment1`
- `500ms_temporary`. Folder that contains the materials for the first version of the experiment. The stimuli and the task correspond to Experiment 1 in the paper however the time delay between two activations was initially set at 500ms. This is a temporary version. 29 participants. [Not included in the paper]
- `100ms_definitive`. Folder that contains the definitive version of **Experiment 1** we included in the paper. The time delay was set at 100ms. See below for mor information about the changes between the temporary and the definitive versions. 30 participants.

`ExperimentB`
- `500ms_temporary`. Contains the material for an experience very similar to Experiment 1. The stimuli were the same however the task was to causaly rank the detectors. The delay was set at 500ms. 28 participants. [Not included in the paper]

`ExperimentC`
- `100ms_definitive`. Contains the materials for a third experiment. The stimuli are similar to those of Experiment 2 in the paper but implied different types of detectors (which don't maintain their activation) and loops. 89 participants. [Not included in the paper]

`Experiment2`
- `100ms_definitive`. Contains the materials for **Experiment 2** we included in the paper. 98 participants.

<br>

## Changelog
---

Series of modifications that affected all the subsequent experiments. The date indicates when the experiment was deployed on Google App Engine. 

<br>

**Experiment1, 500ms_temporary (29/05/2020)**

**ExperimentB, 500ms_temporary (17/06/2020)**
- The star indicating the location of the GCM is replaced by "GCM"

**Experiment1, 100ms_definitive (01/07/2020)**
- 500ms --> 100ms
- [only with respect to Experiment1,500ms_temporary] Modification of questions 2 and 3 of the survey at the end of the instruction 

**ExperimentC, 100ms_definitive (29/08/2020)**
- spinner replaced during activation (suppresion of the rotating effect)

**Experiment2, 100ms_definitive (24/09/2020)**
