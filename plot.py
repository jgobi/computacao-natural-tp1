#!/home/joao/anaconda3/bin/python3
import sys
import pandas as pd
import matplotlib.pyplot as plt

dt = None

if sys.argv[1] == '-':
    dt = pd.read_json(sys.stdin)
else:
    dt = pd.read_json(sys.argv[1])

if len(sys.argv) > 2:
    df = pd.read_csv(sys.argv[2], sep='\\s+', names=['x','y'])
    plt.scatter(df['x'], df['y'])


plt.scatter(dt[0], dt[1])
plt.show()