#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: Aurélien Fermo
"""

#%%
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
root_dir = os.path.dirname(os.getcwd())

#%%
# Importing data from experiment 1 and experiment 2.
data_E1 = pd.read_csv(os.path.join(root_dir,'data','E1_responses.csv'))
for col in data_E1.columns[1:]:
    data_E1[col] = data_E1[col].astype('category')
print('\n Dataframe of the results of Experiment 1:\n\n',data_E1)

data_E2 = pd.read_csv(os.path.join(root_dir,'data','E2_responses.csv'))
for col in data_E2.columns[1:]:
    data_E2[col] = data_E2[col].astype('category')
print('\n Dataframe of the results of Experiment 2:\n\n',data_E2)

#%%
# Functions for bootstraping and generating the two figures of the paper.

def bootstrap(stim,experiment):
    df_mean_std = {}
    data = stim.response.to_numpy()
    stim_type = stim.stimulustype.cat.remove_unused_categories().cat.categories[0]
    if experiment == 'E1':
        length = stim.length.cat.remove_unused_categories().cat.categories[0]
        pop_size = 30
        if stim_type == 'dualbranch' and length == 'short':
            labels = ['otherC','otherD','RC_IC','RD_ID','GCM']
        elif stim_type == 'dualbranch' and length != 'short':
            labels = ['otherC','otherD','RC','RD','IC','ID','GCM']
        elif stim_type == 'chain' and length == 'short':
            labels = ['otherC','RC_IC','GCM']
        elif stim_type == 'chain' and length != 'short':
            labels = ['otherC','RC','IC','GCM']
    elif experiment == 'E2':
        pop_size = 100
        if stim_type == 'dualbranch':
            labels = ['RC','RD','IC','ID','otherC','otherD','GCM']
        elif stim_type == 'chain':
            labels = ['RC','IC','otherC','GCM']
            
    mean_per_cat = []
    std_per_cat = []    

    sample_mean = {}
    for category in labels:
            sample_mean[category] = []
    for _ in range(100):
        sample_n = np.random.choice(data, size=pop_size)
        series = pd.Series(sample_n).value_counts(normalize=True)*100
        
        for category in sample_mean.keys():
            if category in series.index:
                mean = series[category]
                sample_mean[category].append(mean)

    for category in sample_mean.keys():
        sample_mean[category] = np.array(sample_mean[category])
        if len(sample_mean[category]) != 0:
            mean = np.mean(sample_mean[category])
            std = np.std(sample_mean[category])
        else:
            mean = 0
            std = 0

        mean_per_cat.append(mean)
        std_per_cat.append(std)

    df_mean_std["mean"] = mean_per_cat
    df_mean_std["std"] = std_per_cat

    df_mean_std = pd.DataFrame(df_mean_std,columns=['mean','std'],index=labels)
        
    return df_mean_std

# Function that plots figure 2-b of the paper (corresponding to experiment 1)
def graph_E1(list_of_data):
    fig = plt.figure(figsize=(3.15,1.57))
    plt.rcParams['axes.grid'] = False
    a = str(len(list_of_data))
    titles = ['Short','Medium','Long']
    for i,x in enumerate(list_of_data):
        axis = fig.add_subplot(int("1"+a+str(i+1)))
        axis.spines["top"].set_visible(False)
        axis.spines["right"].set_visible(False)
        axis.set_ylim([0,100])
        kwargs={'fontsize':7}
        axis.set_ylabel("Number of responses (%)",**kwargs)
        axis.set_title(titles[i],fontsize=7)
        axis.label_outer()
        if i == 0:
            categories = ['$\mathregular{R,I_C}$','$\mathregular{R,I_D}$','other']
            
            event_mean = [x[0].loc['RC_IC','mean'],x[0].loc['RD_ID','mean'],
                     x[0].loc['otherC','mean']+x[0].loc['otherD','mean']+x[0].loc['GCM','mean']]
            state_mean = [x[1].loc['RC_IC','mean'],x[1].loc['RD_ID','mean'],
                     x[1].loc['otherC','mean']+x[1].loc['otherD','mean']+x[1].loc['GCM','mean']]
            
            event_std = [x[0].loc['RC_IC','std'],x[0].loc['RD_ID','std'],
                     x[0].loc['otherC','std']+x[0].loc['otherD','std']+x[0].loc['GCM','std']]
            state_std = [x[1].loc['RC_IC','std'],x[1].loc['RD_ID','std'],
                     x[1].loc['otherC','std']+x[1].loc['otherD','std']+x[1].loc['GCM','std']]
            
        else:
            categories = ['$\mathregular{R_C}$','$\mathregular{R_D}$','$\mathregular{I_C}$','$\mathregular{I_D}$','other']
            
            event_mean = [x[0].loc['RC','mean'],x[0].loc['RD','mean'],x[0].loc['IC','mean'],
                          x[0].loc['ID','mean'],x[0].loc['otherC','mean']+x[0].loc['otherD','mean']+
                     x[0].loc['GCM','mean']]
            state_mean = [x[1].loc['RC','mean'],x[1].loc['RD','mean'],x[1].loc['IC','mean'],
                          x[1].loc['ID','mean'],x[1].loc['otherC','mean']+x[1].loc['otherD','mean']+
                     x[1].loc['GCM','mean']]
            
            event_std = [x[0].loc['RC','std'],x[0].loc['RD','std'],x[0].loc['IC','std'],
                          x[0].loc['ID','std'],x[0].loc['otherC','std']+x[0].loc['otherD','std']+
                     x[0].loc['GCM','std']]
            state_std = [x[1].loc['RC','std'],x[1].loc['RD','std'],x[1].loc['IC','std'],
                          x[1].loc['ID','std'],x[1].loc['otherC','std']+x[1].loc['otherD','std']+
                     x[1].loc['GCM','std']]
            
        df_mean = pd.DataFrame({'event':event_mean,'state':state_mean}, index=categories)
        df_std = pd.DataFrame({'event':event_std,'state':state_std}, index=categories)
        df_mean.plot.bar(ax=axis,yerr=df_std,capsize=1,ecolor='black',rot=90,error_kw={'elinewidth':0.5,'capthick':0.5},fontsize=7)
        axis.legend(fontsize=7)
        if i != 1:
            axis.get_legend().remove()

# Function that plots figure 3-c of the paper (corresponding to experiment 2)
def graph_E2(x):
    plt.rcParams['axes.grid'] = False
    fig = plt.figure(figsize=(3.15,1.57))
    axis = fig.add_subplot(111)
    axis.spines["top"].set_visible(False)
    axis.spines["right"].set_visible(False)
    axis.set_ylim([0,80])
    kwargs={'fontsize':7}
    axis.set_ylabel("Number of responses (%)",**kwargs)
    axis.label_outer()
    categories = ['$\mathregular{R_C}$','$\mathregular{R_D}$','$\mathregular{I_C}$','$\mathregular{I_D}$','other']
    event_R1c_mean = [x[0].loc["RC","mean"],x[0].loc["RD","mean"],x[0].loc["IC",'mean'],
                 x[0].loc['ID','mean'],x[0].loc['otherC','mean']+x[0].loc['otherD','mean']+x[0].loc['GCM','mean']]
    event_R2c_mean = [x[1].loc["RC","mean"],x[0].loc["RD","mean"],x[1].loc["IC",'mean'],
                 x[1].loc['ID','mean'],x[1].loc['otherC','mean']+x[1].loc['otherD','mean']+x[1].loc['GCM','mean']]
    state_R2c_mean = [x[2].loc["RC","mean"],x[2].loc["RD","mean"],x[2].loc["IC",'mean'],
                 x[2].loc['ID','mean'],x[2].loc['otherC','mean']+x[2].loc['otherD','mean']+x[2].loc['GCM','mean']]
                      
    event_R1c_std = [x[0].loc["RC","std"],x[0].loc["RD","std"],x[0].loc["IC",'std'],
                 x[0].loc['ID','std'],x[0].loc['otherC','std']+x[0].loc['otherD','std']+x[0].loc['GCM','std']]
    event_R2c_std = [x[1].loc["RC","std"],x[1].loc["RD","std"],x[1].loc["IC",'std'],
                 x[1].loc['ID','std'],x[1].loc['otherC','std']+x[1].loc['otherD','std']+x[1].loc['GCM','std']]
    state_R2c_std = [x[2].loc["RC","std"],x[2].loc["RD","std"],x[2].loc["IC",'std'],
                 x[2].loc['ID','std'],x[2].loc['otherC','std']+x[2].loc['otherD','std']+x[2].loc['GCM','std']]
    
    df_mean = pd.DataFrame({'$R_C$,$R_D$,$I_D$,$I_C$':event_R1c_mean,'$R_D$,$R_C$,$I_D$,$I_C$':event_R2c_mean,'$R_D$,$I_D$,$R_C$,$I_C$':state_R2c_mean}, 
                          index=categories)
    df_std = pd.DataFrame({'$R_C$,$R_D$,$I_D$,$I_C$':event_R1c_std,'$R_D$,$R_C$,$I_D$,$I_C$':event_R2c_std,'$R_D$,$I_D$,$R_C$,$I_C$':state_R2c_std}, 
                          index=categories)   
    df_mean.plot.bar(ax=axis,yerr=df_std,capsize=1,ecolor='black',rot=0,error_kw={'elinewidth':0.5,'capthick':0.5},fontsize=7)
    axis.legend(fontsize=7)
    plt.show()

#%%
ShortState = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='short')&(data_E1['state_or_event']=='state')]
MediumState = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='medium')&(data_E1['state_or_event']=='state')]
LongState = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='long')&(data_E1['state_or_event']=='state')]
ShortEvent = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='short')&(data_E1['state_or_event']=='event')]
MediumEvent = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='medium')&(data_E1['state_or_event']=='event')]
LongEvent = data_E1[(data_E1['stimulustype']=='dualbranch')&(data_E1['length']=='long')&(data_E1['state_or_event']=='event')]

SS = bootstrap(ShortState,'E1')
MS = bootstrap(MediumState,'E1')
LS = bootstrap(LongState,'E1')
SE = bootstrap(ShortEvent,'E1')
ME = bootstrap(MediumEvent,'E1')
LE = bootstrap(LongEvent,'E1')

graph_E1([[SE,SS],[ME,MS],[LE,LS]])
#plt.savefig('figure_E1.eps',format='eps',bbox_inches='tight')

#%%
RD_ID_RC = data_E2[(data_E2['stimulustype']=='dualbranch')&(data_E2['order']=='RD_ID_RC')]
RC_RD_ID = data_E2[(data_E2['stimulustype']=='dualbranch')&(data_E2['order']=='RC_RD_ID')]
RD_RC_ID = data_E2[(data_E2['stimulustype']=='dualbranch')&(data_E2['order']=='RD_RC_ID')]

####### Bootstrapping #######

RD_ID_RC = bootstrap(RD_ID_RC,'E2')
RC_RD_ID = bootstrap(RC_RD_ID,'E2')
RD_RC_ID = bootstrap(RD_RC_ID,'E2')

graph_E2([RC_RD_ID,RD_RC_ID,RD_ID_RC])
#plt.savefig('figure_E2.eps',format="eps",bbox_inches='tight')