#!/home/joao/anaconda3/bin/python3
#%%
import sys
import pandas as pd
import matplotlib.pyplot as plt

dt = None

dt = pd.read_json(sys.stdin)

for i in range(1, 51):
    plt.scatter(dt.iloc[0, :], dt.iloc[i, :])
    plt.show()
