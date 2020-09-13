#!/home/joao/anaconda3/bin/python3

import sys
import pandas as pd
import matplotlib.pyplot as plt

dt = None

if sys.argv[1] == '-':
  dt = pd.read_json(sys.stdin)
else:
  dt = pd.read_json(sys.argv[1])

df = pd.read_csv(sys.argv[2], sep='\\s+', names=['x1','x2','x3','x4','x5','x6','x7','x8','y'])


plt.rcParams["figure.figsize"] = (15,5)
def plotFitness(X, real_y, pred_y, xlabel='X', pointsize=8, errsize=3.5, alpha = 0.05, axis=plt):
  axis.scatter(X, real_y, s=pointsize, label='GT value', color = 'darkcyan', zorder=2)
  axis.scatter(X, pred_y, s=pointsize, label='Predicted value', color = 'C1', zorder=3)

  errargs = {'color':'darkcyan', 'alpha':alpha, 'linewidth':errsize, 'solid_capstyle':'round'}
  for i in range(len(X)):
    axis.plot((X[i], X[i]), (real_y[i], pred_y[i]), **errargs, zorder=1)
  axis.plot([], [], label="Prediction error", **errargs)
  
  if axis == plt:
    axis.legend()
    axis.ylabel('Y')
    axis.xlabel(xlabel)
    axis.title('Best individual')

plotFitness(list(range(len(dt))), dt.iloc[:,-1].values, df.iloc[:,-1].values)
plt.show()
